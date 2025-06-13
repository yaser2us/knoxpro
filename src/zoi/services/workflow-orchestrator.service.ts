// src/zoi/services/workflow-orchestrator.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventBus } from '../events/event-bus';
import { WorkflowRun } from '../entity/workflow.run.entity';
import { WorkflowLog } from '../entity/workflow.log.entity';
import { WorkflowTemplate } from '../entity/workflow.template.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid'; // 🔧 ADD: Import UUID generator

export interface WorkflowStep {
    id: string;
    type: 'module_task' | 'approval' | 'notification' | 'delay' | 'condition' | 'parallel' | 'manual';
    name: string;
    module?: string; // Which module handles this step
    config: any;
    timeout?: number; // Timeout in seconds
    retryCount?: number;
    nextSteps?: string[]; // Next step IDs
    conditions?: Array<{
        field: string;
        operator: string;
        value: any;
        nextStep: string;
    }>;
}

export interface WorkflowDefinition {
    id: string;
    name: string;
    version: string;
    steps: WorkflowStep[];
    startStep: string;
}

export interface WorkflowContext {
    workflowRunId: string;
    currentStepId: string;
    data: Record<string, any>;
    variables: Record<string, any>;
    history: Array<{
        stepId: string;
        status: 'completed' | 'failed' | 'skipped';
        timestamp: Date;
        result?: any;
        error?: string;
    }>;
}

@Injectable()
export class WorkflowOrchestrator {
    private readonly logger = new Logger(WorkflowOrchestrator.name);
    private runningWorkflows = new Map<string, WorkflowContext>();
    private waitingWorkflows = new Map<string, {
        context: WorkflowContext;
        resumeAt: Date;
        reason: string;
    }>();

    constructor(
        @InjectRepository(WorkflowRun)
        private readonly workflowRunRepo: Repository<WorkflowRun>,
        @InjectRepository(WorkflowLog)
        private readonly workflowLogRepo: Repository<WorkflowLog>,
        @InjectRepository(WorkflowTemplate)
        private readonly workflowTemplateRepo: Repository<WorkflowTemplate>
    ) {
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Listen for workflow control events
        EventBus.on('workflow.start', this.handleWorkflowStart.bind(this));
        EventBus.on('workflow.step.completed', this.handleStepCompleted.bind(this));
        EventBus.on('workflow.step.failed', this.handleStepFailed.bind(this));
        EventBus.on('workflow.resume', this.handleWorkflowResume.bind(this));
        EventBus.on('workflow.pause', this.handleWorkflowPause.bind(this));
        EventBus.on('workflow.cancel', this.handleWorkflowCancel.bind(this));

        // Listen for module responses
        EventBus.on('pulse.task.completed', this.handleModuleTaskCompleted.bind(this));
        EventBus.on('knox.task.completed', this.handleModuleTaskCompleted.bind(this));
        EventBus.on('approval.granted', this.handleApprovalCompleted.bind(this));
        EventBus.on('approval.rejected', this.handleApprovalCompleted.bind(this));

        this.logger.log('🎯 Workflow orchestrator event listeners registered');
    }

    // 🔧 FIXED: Generate proper UUIDs for workflow run IDs
    private generateWorkflowRunId(): string {
        // ❌ OLD: return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // ✅ NEW: Generate proper UUID
        return uuidv4();
    }

    // 🔧 ALTERNATIVE: If you want custom prefixed IDs, change the entity
    private generateCustomWorkflowRunId(): string {
        // If you prefer custom IDs like "wf_abc123...", you'd need to change the entity:
        // @PrimaryGeneratedColumn('uuid') → @Column({ type: 'varchar', primary: true })
        return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // 🔧 FIXED: Generate proper UUIDs for event IDs too
    private generateEventId(): string {
        // ❌ OLD: return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // ✅ NEW: Generate proper UUID (if this is used for UUID fields)
        return uuidv4();
        
        // 🔧 ALTERNATIVE: If event IDs don't need to be UUIDs, keep the old format
        // return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // 🚀 Start a new workflow
    async startWorkflow(
        workflowDefinition: WorkflowDefinition,
        initialData: any,
        triggeredBy?: string
    ): Promise<string> {
        const workflowRunId = this.generateWorkflowRunId();
        
        this.logger.log(`🚀 Starting workflow: ${workflowDefinition.name} (${workflowRunId})`);

        // Create workflow run record
        const workflowRun = new WorkflowRun();
        workflowRun.id = workflowRunId;
        workflowRun.document_id = initialData.documentId;
        workflowRun.version = workflowDefinition.version;
        workflowRun.status = 'running';
        workflowRun.current_step_index = 0;
        workflowRun.context = {
            definition: workflowDefinition,
            initialData,
            variables: {},
            currentStepId: workflowDefinition.startStep,
            triggeredBy,
            startedAt: new Date().toISOString(),
            totalSteps: workflowDefinition.steps.length
        };

        // Find and associate template
        const template = await this.workflowTemplateRepo.findOne({
            where: { id: workflowDefinition.id }
        });
        
        if (template) {
            workflowRun.template = template;
        }

        await this.workflowRunRepo.save(workflowRun);

        // Initialize workflow context
        const context: WorkflowContext = {
            workflowRunId,
            currentStepId: workflowDefinition.startStep,
            data: initialData,
            variables: {},
            history: []
        };

        this.runningWorkflows.set(workflowRunId, context);

        // Start executing the first step
        await this.executeNextStep(context, workflowDefinition);

        return workflowRunId;
    }

    // 🎯 Execute the next step in the workflow
    private async executeNextStep(
        context: WorkflowContext,
        definition: WorkflowDefinition
    ): Promise<void> {
        const currentStep = definition.steps.find(s => s.id === context.currentStepId);
        
        if (!currentStep) {
            await this.completeWorkflow(context, 'completed');
            return;
        }

        this.logger.log(`📋 Executing step: ${currentStep.name} (${currentStep.id})`);

        // Update current step in workflow run
        await this.updateWorkflowRunStep(context.workflowRunId, currentStep.id, definition.steps.findIndex(s => s.id === currentStep.id));
        
        await this.logWorkflowStep(context.workflowRunId, 'started', `Step ${currentStep.name} started`, {
            stepId: currentStep.id,
            stepName: currentStep.name,
            stepType: currentStep.type
        });

        try {
            switch (currentStep.type) {
                case 'module_task':
                    await this.executeModuleTask(context, currentStep, definition);
                    break;
                case 'approval':
                    await this.executeApprovalStep(context, currentStep, definition);
                    break;
                case 'notification':
                    await this.executeNotificationStep(context, currentStep, definition);
                    break;
                case 'delay':
                    await this.executeDelayStep(context, currentStep, definition);
                    break;
                case 'condition':
                    await this.executeConditionStep(context, currentStep, definition);
                    break;
                case 'parallel':
                    await this.executeParallelStep(context, currentStep, definition);
                    break;
                case 'manual':
                    await this.executeManualStep(context, currentStep, definition);
                    break;
                default:
                    throw new Error(`Unknown step type: ${currentStep.type}`);
            }
        } catch (error) {
            console.log(error)
            this.logger.error(`❌ Step ${currentStep.name} failed:`, error);
            await this.handleStepError(context, currentStep, error, definition);
        }
    }

    // 🏭 Execute module task (delegates to other modules)
    private async executeModuleTask(
        context: WorkflowContext,
        step: WorkflowStep,
        definition: WorkflowDefinition
    ): Promise<void> {
        const { module, config } = step;
        
        this.logger.log(`🏭 Delegating task to ${module} module via ${module}.task.execute, Running ID ${context.workflowRunId}`);

        // Emit event to the target module
        const taskEvent = {
            id: this.generateEventId(),
            type: `${module}.task.execute`,
            timestamp: new Date().toISOString(),
            source: 'workflow-orchestrator',
            payload: {
                workflowRunId: context.workflowRunId,
                stepId: step.id,
                stepName: step.name,
                config,
                data: context.data,
                variables: context.variables
            }
        };

        // Set timeout for the task
        if (step.timeout) {
            setTimeout(() => {
                this.handleStepTimeout(context, step, definition);
            }, step.timeout * 1000);
        }

        await EventBus.emit(taskEvent.type, taskEvent);
        
        // Workflow will continue when module emits completion event
        this.logger.log(`⏳ Waiting for ${module} to complete task: ${step.name}`);
    }

    // 👔 Execute approval step
    private async executeApprovalStep(
        context: WorkflowContext,
        step: WorkflowStep,
        definition: WorkflowDefinition
    ): Promise<void> {
        const { config } = step;
        
        this.logger.log(`👔 Starting approval process: ${step.name}`);

        const approvalEvent = {
            id: this.generateEventId(),
            type: 'approval.request',
            timestamp: new Date().toISOString(),
            source: 'workflow-orchestrator',
            payload: {
                workflowRunId: context.workflowRunId,
                stepId: step.id,
                approvers: config.approvers,
                requiredApprovals: config.requiredApprovals || 1,
                timeout: config.timeout,
                document: context.data,
                message: this.processTemplate(config.message, context)
            }
        };

        await EventBus.emit('approval.request', approvalEvent);
        
        // If there's a timeout, schedule it
        if (config.timeout) {
            setTimeout(() => {
                this.handleApprovalTimeout(context, step, definition);
            }, config.timeout * 1000);
        }

        this.logger.log(`⏳ Waiting for approval: ${step.name}`);
    }

    // 📢 Execute notification step
    private async executeNotificationStep(
        context: WorkflowContext,
        step: WorkflowStep,
        definition: WorkflowDefinition
    ): Promise<void> {
        const { config } = step;
        
        this.logger.log(`📢 Sending notification: ${step.name}`);

        const notificationEvent = {
            id: this.generateEventId(),
            type: 'notification.send',
            timestamp: new Date().toISOString(),
            source: 'workflow-orchestrator',
            payload: {
                recipients: config.recipients,
                message: this.processTemplate(config.message, context),
                subject: this.processTemplate(config.subject, context),
                priority: config.priority || 'normal',
                workflowRunId: context.workflowRunId
            }
        };

        await EventBus.emit('notification.send', notificationEvent);
        
        // Notifications complete immediately
        await this.completeStep(context, step, { sent: true }, definition);
    }

    // ⏰ Execute delay step (for long waiting periods)
    private async executeDelayStep(
        context: WorkflowContext,
        step: WorkflowStep,
        definition: WorkflowDefinition
    ): Promise<void> {
        const { config } = step;
        const delaySeconds = config.delaySeconds || 0;
        const delayUntil = config.delayUntil; // ISO date string
        
        let resumeAt: Date;
        
        if (delayUntil) {
            // Handle template processing for dynamic dates
            const processedDelayUntil = this.processTemplate(delayUntil, context);
            resumeAt = new Date(processedDelayUntil);
            this.logger.log(`⏰ Delaying until: ${resumeAt.toISOString()}`);
        } else {
            resumeAt = new Date(Date.now() + (delaySeconds * 1000));
            this.logger.log(`⏰ Delaying for ${delaySeconds} seconds until: ${resumeAt.toISOString()}`);
        }

        // Move workflow to waiting state
        await this.pauseWorkflow(context, resumeAt, `Delayed until ${resumeAt.toISOString()}`);
        
        // Schedule resume (for short delays, or use cron for long delays)
        if (delaySeconds > 0 && delaySeconds < 3600) { // Less than 1 hour, use setTimeout
            setTimeout(async () => {
                await this.resumeWorkflow(context.workflowRunId, { delayCompleted: true });
            }, delaySeconds * 1000);
        }
        // For longer delays, the cron job will handle resume
    }

    // 🔀 Execute condition step
    private async executeConditionStep(
        context: WorkflowContext,
        step: WorkflowStep,
        definition: WorkflowDefinition
    ): Promise<void> {
        const { conditions } = step;
        
        this.logger.log(`🔀 Evaluating conditions for: ${step.name}`);

        let nextStepId = step.nextSteps?.[0]; // Default next step

        if (conditions) {
            for (const condition of conditions) {
                const fieldValue = this.getFieldValue(context, condition.field);
                const conditionMet = this.evaluateCondition(condition, fieldValue);
                
                this.logger.debug(`🔍 Condition: ${condition.field} ${condition.operator} ${condition.value} = ${conditionMet} (actual: ${fieldValue})`);
                
                if (conditionMet) {
                    nextStepId = condition.nextStep;
                    this.logger.log(`✅ Condition met, proceeding to: ${nextStepId}`);
                    break;
                }
            }
        }

        await this.logWorkflowStep(context.workflowRunId, 'completed', `Condition step ${step.name} completed`, {
            stepId: step.id,
            nextStepId,
            conditionsEvaluated: conditions?.length || 0
        });

        // Move to next step
        if (nextStepId) {
            context.currentStepId = nextStepId;
            await this.executeNextStep(context, definition);
        } else {
            await this.completeWorkflow(context, 'completed');
        }
    }

    // 🔄 Execute parallel step
    private async executeParallelStep(
        context: WorkflowContext,
        step: WorkflowStep,
        definition: WorkflowDefinition
    ): Promise<void> {
        const { config } = step;
        const parallelSteps = config.parallelSteps || [];
        
        this.logger.log(`🔄 Starting ${parallelSteps.length} parallel tasks`);

        const parallelPromises = parallelSteps.map(async (parallelStepId: string) => {
            const parallelContext = { ...context, currentStepId: parallelStepId };
            return this.executeNextStep(parallelContext, definition);
        });

        try {
            await Promise.all(parallelPromises);
            await this.completeStep(context, step, { parallelTasksCompleted: parallelSteps.length }, definition);
        } catch (error) {
            this.logger.error(`❌ Parallel step failed:`, error);
            throw error;
        }
    }

    // 👤 Execute manual step (waits for human intervention)
    private async executeManualStep(
        context: WorkflowContext,
        step: WorkflowStep,
        definition: WorkflowDefinition
    ): Promise<void> {
        const { config } = step;
        
        this.logger.log(`👤 Manual step requires human intervention: ${step.name}`);

        const manualTaskEvent = {
            id: this.generateEventId(),
            type: 'manual.task.created',
            timestamp: new Date().toISOString(),
            source: 'workflow-orchestrator',
            payload: {
                workflowRunId: context.workflowRunId,
                stepId: step.id,
                taskName: step.name,
                description: this.processTemplate(config.description, context),
                assignedTo: config.assignedTo,
                priority: config.priority || 'normal',
                dueDate: config.dueDate,
                data: context.data
            }
        };

        await EventBus.emit('manual.task.created', manualTaskEvent);
        
        // Workflow pauses until manual task is completed
        this.logger.log(`⏳ Waiting for manual completion: ${step.name}`);
    }

    // ✅ Handle step completion
    private async completeStep(
        context: WorkflowContext,
        step: WorkflowStep,
        result: any,
        definition: WorkflowDefinition
    ): Promise<void> {
        this.logger.log(`✅ Step completed: ${step.name}`);

        // Update context
        context.history.push({
            stepId: step.id,
            status: 'completed',
            timestamp: new Date(),
            result
        });

        // Update variables if step produced results
        if (result && step.config?.outputVariable) {
            context.variables[step.config.outputVariable] = result;
        }

        await this.logWorkflowStep(context.workflowRunId, 'completed', `Step ${step.name} completed`, {
            stepId: step.id,
            stepName: step.name,
            result,
            outputVariable: step.config?.outputVariable
        });

        // Update workflow run progress
        await this.updateWorkflowProgress(context.workflowRunId, definition);

        // Move to next step
        const nextStepId = step.nextSteps?.[0];
        if (nextStepId) {
            context.currentStepId = nextStepId;
            await this.executeNextStep(context, definition);
        } else {
            await this.completeWorkflow(context, 'completed');
        }
    }

    // 📥 Handle workflow start event
    private async handleWorkflowStart(event: any): Promise<void> {
        const { payload } = event;
        const { template, document, user, context: eventContext } = payload;

        this.logger.log(`📥 Handling workflow start for template: ${template.name}`);

        // Convert template to workflow definition
        const workflowDefinition: WorkflowDefinition = {
            id: template.id,
            name: template.name,
            version: template.version,
            steps: template.dsl.steps || [],
            startStep: template.dsl.startStep || template.dsl.steps?.[0]?.id
        };

        const initialData = {
            documentId: document.id,
            document,
            user,
            triggeredBy: user?.id,
            ...eventContext
        };

        await this.startWorkflow(workflowDefinition, initialData, user?.id);
    }

    // 📥 Handle step completion from modules
    private async handleStepCompleted(event: any): Promise<void> {
        const { payload } = event;
        const { workflowRunId, stepId, result } = payload;

        this.logger.log(`📥 Handling step completion: ${stepId} for workflow ${workflowRunId}`);

        // const context = this.runningWorkflows.get(workflowRunId);
        let context = this.runningWorkflows.get(workflowRunId);

        // if (!context) {
        //     this.logger.warn(`⚠️ Workflow context not found: ${workflowRunId}`);
        //     return;
        // }

        if (!context) {
            this.logger.warn(`⚠️ Workflow context not found: ${workflowRunId}, attempting recovery...`);
            
            // 🔧 TRY TO RECOVER THE WORKFLOW
            const recoveryResult = await this.recoverWorkflows();
            
            // Try to find the context again after recovery
            context = this.runningWorkflows.get(workflowRunId);
            
            if (!context) {
                this.logger.error(`❌ Failed to recover workflow: ${workflowRunId}`);
                return;
            }
            
            this.logger.log(`✅ Successfully recovered workflow: ${workflowRunId}`);
        }

        // Find the workflow definition
        const workflowRun = await this.workflowRunRepo.findOne({
            where: { id: workflowRunId }
        });

        if (!workflowRun) {
            this.logger.error(`❌ Workflow run not found: ${workflowRunId}`);
            return;
        }

        const definition = workflowRun.context.definition;
        const step = definition.steps.find(s => s.id === stepId);

        if (step) {
            await this.completeStep(context, step, result, definition);
        }
    }

    // 📥 Handle module task completion
    private async handleModuleTaskCompleted(event: any): Promise<void> {
        const { payload } = event;
        const { workflowRunId, stepId, result, module } = payload;

        this.logger.log(`🏭 Module task completed: ${module} → ${stepId}`);

        // Emit generic step completion event
        await EventBus.emit('workflow.step.completed', {
            id: this.generateEventId(),
            type: 'workflow.step.completed',
            timestamp: new Date().toISOString(),
            source: 'workflow-orchestrator',
            payload: { workflowRunId, stepId, result }
        });
    }

    // 📥 Handle approval completion
    private async handleApprovalCompleted(event: any): Promise<void> {
        const { payload } = event;
        const { workflowRunId, stepId, approved, approver, comments } = payload;

        this.logger.log(`👔 Approval ${approved ? 'granted' : 'rejected'} by ${approver}`);

        const result = {
            approved,
            approver,
            comments,
            timestamp: new Date().toISOString()
        };

        // Emit step completion
        await EventBus.emit('workflow.step.completed', {
            id: this.generateEventId(),
            type: 'workflow.step.completed',
            timestamp: new Date().toISOString(),
            source: 'workflow-orchestrator',
            payload: { workflowRunId, stepId, result }
        });
    }

    // ⏸️ Pause workflow for long delays
    private async pauseWorkflow(
        context: WorkflowContext,
        resumeAt: Date,
        reason: string
    ): Promise<void> {
        this.logger.log(`⏸️ Pausing workflow ${context.workflowRunId} until ${resumeAt.toISOString()}`);

        // Move from running to waiting
        this.runningWorkflows.delete(context.workflowRunId);
        this.waitingWorkflows.set(context.workflowRunId, {
            context,
            resumeAt,
            reason
        });

        // Update database
        const existingRun = await this.workflowRunRepo.findOne({
            where: { id: context.workflowRunId }
        });

        if (existingRun) {
            existingRun.status = 'paused';
            existingRun.context = {
                ...existingRun.context,
                pausedAt: new Date().toISOString(),
                resumeAt: resumeAt.toISOString(),
                pauseReason: reason
            };
            await this.workflowRunRepo.save(existingRun);
        }

        await this.logWorkflowStep(context.workflowRunId, 'paused', `Workflow paused: ${reason}`, { 
            reason, 
            resumeAt: resumeAt.toISOString() 
        });
    }

    // ▶️ Resume workflow
    async resumeWorkflow(workflowRunId: string, resumeData?: any): Promise<void> {
        this.logger.log(`▶️ Resuming workflow: ${workflowRunId}`);

        const waitingWorkflow = this.waitingWorkflows.get(workflowRunId);
        if (!waitingWorkflow) {
            this.logger.warn(`⚠️ Waiting workflow not found: ${workflowRunId}`);
            return;
        }

        const { context } = waitingWorkflow;

        // Move from waiting to running
        this.waitingWorkflows.delete(workflowRunId);
        this.runningWorkflows.set(workflowRunId, context);

        // Update database
        const workflowRun = await this.workflowRunRepo.findOne({
            where: { id: workflowRunId }
        });

        if (workflowRun) {
            workflowRun.status = 'running';
            workflowRun.context = {
                ...workflowRun.context,
                resumedAt: new Date().toISOString()
            };
            await this.workflowRunRepo.save(workflowRun);

            const definition = workflowRun.context.definition;
            
            // Add resume data to context
            if (resumeData) {
                context.data = { ...context.data, ...resumeData };
            }

            await this.logWorkflowStep(workflowRunId, 'resumed', 'Workflow resumed', resumeData);
            
            // Continue from current step
            await this.executeNextStep(context, definition);
        }
    }

    // 🕐 Cron job to resume waiting workflows
    @Cron(CronExpression.EVERY_MINUTE)
    async checkWorkflowsToResume(): Promise<void> {
        const now = new Date();
        const workflowsToResume: string[] = [];

        this.waitingWorkflows.forEach((waitingWorkflow, workflowRunId) => {
            if (waitingWorkflow.resumeAt <= now) {
                workflowsToResume.push(workflowRunId);
            }
        });

        for (const workflowRunId of workflowsToResume) {
            try {
                await this.resumeWorkflow(workflowRunId);
            } catch (error) {
                this.logger.error(`❌ Failed to resume workflow ${workflowRunId}:`, error);
            }
        }

        if (workflowsToResume.length > 0) {
            this.logger.log(`▶️ Resumed ${workflowsToResume.length} workflows`);
        }
    }

    // 🏁 Complete workflow
    private async completeWorkflow(context: WorkflowContext, status: 'completed' | 'failed' | 'cancelled'): Promise<void> {
        this.logger.log(`🏁 Workflow ${status}: ${context.workflowRunId}`);

        // Remove from running workflows
        this.runningWorkflows.delete(context.workflowRunId);

        // Update database
        const workflowRun = await this.workflowRunRepo.findOne({
            where: { id: context.workflowRunId }
        });

        if (workflowRun) {
            workflowRun.status = status;
            workflowRun.context = {
                ...workflowRun.context,
                completedAt: new Date().toISOString(),
                finalResult: context.data,
                history: context.history
            };
            await this.workflowRunRepo.save(workflowRun);

            await this.logWorkflowStep(context.workflowRunId, 'completed', `Workflow ${status}`, {
                status,
                finalData: context.data,
                totalSteps: context.history.length
            });

            // Emit completion event
            const completionEvent = {
                id: this.generateEventId(),
                type: 'workflow.completed',
                timestamp: new Date().toISOString(),
                source: 'workflow-orchestrator',
                payload: {
                    workflowRun,
                    status,
                    finalData: context.data,
                    history: context.history
                }
            };

            await EventBus.emit('workflow.completed', completionEvent);
        }
    }

    // 🛠️ Helper methods
    private generateWorkflowRunIdLegacy(): string {
        return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateEventIdLegacy(): string {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private processTemplate(template: string, context: WorkflowContext): string {
        if (!template) return '';
        return template.replace(/\{\{(.*?)\}\}/g, (match, path) => {
            return this.getFieldValue(context, path.trim()) || match;
        });
    }

    private getFieldValue(context: WorkflowContext, fieldPath: string): any {
        const fullContext = {
            data: context.data,
            variables: context.variables,
            workflowRunId: context.workflowRunId
        };
        return fieldPath.split('.').reduce((obj, key) => obj?.[key], fullContext);
    }

    private evaluateCondition(condition: any, fieldValue: any): boolean {
        const { operator, value } = condition;

        switch (operator) {
            case 'equals': return fieldValue === value;
            case 'not_equals': return fieldValue !== value;
            case 'greater_than': return Number(fieldValue) > Number(value);
            case 'less_than': return Number(fieldValue) < Number(value);
            case 'contains': return String(fieldValue || '').includes(String(value));
            case 'not_contains': return !String(fieldValue || '').includes(String(value));
            case 'exists': return fieldValue !== undefined && fieldValue !== null;
            case 'not_exists': return fieldValue === undefined || fieldValue === null;
            case 'in': return Array.isArray(value) && value.includes(fieldValue);
            case 'not_in': return Array.isArray(value) && !value.includes(fieldValue);
            case 'regex':
                try {
                    const regex = new RegExp(value);
                    return regex.test(String(fieldValue || ''));
                } catch {
                    return false;
                }
            default:
                this.logger.warn(`⚠️ Unknown condition operator: ${operator}`);
                return true;
        }
    }

    // 🔧 Database helper methods
    private async updateWorkflowRunStep(workflowRunId: string, stepId: string, stepIndex: number): Promise<void> {
        try {
            await this.workflowRunRepo.update(workflowRunId, {
                current_step_index: stepIndex,
                context: () => `context || '{}'::jsonb || '{"currentStepId": "${stepId}"}'::jsonb`
            });
        } catch (error) {
            this.logger.error('❌ Failed to update workflow run step:', error);
        }
    }
                
    private async updateWorkflowProgress(workflowRunId: string, definition: WorkflowDefinition): Promise<void> {
        try {
            const workflowRun = await this.workflowRunRepo.findOne({
                where: { id: workflowRunId }
            });

            if (workflowRun) {
                const completedSteps = workflowRun.context.history?.length || 0;
                const totalSteps = definition.steps.length;
                
                workflowRun.context = {
                    ...workflowRun.context,
                    completedSteps,
                    totalSteps,
                    progress: Math.round((completedSteps / totalSteps) * 100)
                };
                
                await this.workflowRunRepo.save(workflowRun);
            }
        } catch (error) {
            this.logger.error('❌ Failed to update workflow progress:', error);
        }
    }

    private async logWorkflowStep(
        workflowRunId: string,
        type: 'triggered' | 'workflow_triggered' | 'trigger_error' | 'resumed' | 'failed' | 'skipped' | 'completed' | 'manual_edit' | 'trigger_failed' | 'started' | 'paused',
        message: string,
        metadata?: any
    ): Promise<void> {
        try {
            const workflowRun = await this.workflowRunRepo.findOne({
                where: { id: workflowRunId }
            });

            if (!workflowRun) {
                this.logger.warn(`⚠️ WorkflowRun not found for logging: ${workflowRunId}`);
                return;
            }

            const log = new WorkflowLog();
            log.workflow_run = workflowRun;
            log.type = type;
            log.message = message;
            log.metadata = metadata || {};
            log.step_index = metadata?.stepIndex || null;
            log.actor_user_id = metadata?.actorUserId || null;
            log.actor_workspace_id = metadata?.actorWorkspaceId || null;

            await this.workflowLogRepo.save(log);
        } catch (error) {
            this.logger.error('❌ Failed to log workflow step:', error);
        }
    }

    // Handle various error scenarios
    private async handleStepError(
        context: WorkflowContext,
        step: WorkflowStep,
        error: Error,
        definition: WorkflowDefinition
    ): Promise<void> {
        const retryCount = step.retryCount || 0;
        const currentRetries = context.history.filter(h => h.stepId === step.id && h.status === 'failed').length;

        await this.logWorkflowStep(context.workflowRunId, 'failed', `Step ${step.name} failed: ${error.message}`, {
            stepId: step.id,
            stepName: step.name,
            error: error.message,
            currentRetries,
            maxRetries: retryCount
        });

        if (currentRetries < retryCount) {
            this.logger.log(`🔄 Retrying step ${step.name} (${currentRetries + 1}/${retryCount})`);
            
            // Add failed attempt to history
            context.history.push({
                stepId: step.id,
                status: 'failed',
                timestamp: new Date(),
                error: error.message
            });

            // Retry after a delay
            setTimeout(() => this.executeNextStep(context, definition), 5000);
        } else {
            this.logger.error(`❌ Step ${step.name} failed permanently after ${retryCount} retries`);
            await this.completeWorkflow(context, 'failed');
        }
    }

    private async handleStepTimeout(
        context: WorkflowContext,
        step: WorkflowStep,
        definition: WorkflowDefinition
    ): Promise<void> {
        if (this.runningWorkflows.has(context.workflowRunId)) {
            this.logger.warn(`⏰ Step timeout: ${step.name}`);
            await this.handleStepError(context, step, new Error('Step timeout'), definition);
        }
    }

    private async handleApprovalTimeout(
        context: WorkflowContext,
        step: WorkflowStep,
        definition: WorkflowDefinition
    ): Promise<void> {
        if (this.runningWorkflows.has(context.workflowRunId)) {
            this.logger.warn(`⏰ Approval timeout: ${step.name}`);
            
            // You can either fail the workflow or proceed with default action
            const defaultAction = step.config?.timeoutAction || 'fail';
            if (defaultAction === 'approve') {
                await this.completeStep(context, step, { 
                    approved: true, 
                    reason: 'auto-approved on timeout',
                    timeout: true 
                }, definition);
            } else if (defaultAction === 'reject') {
                await this.completeStep(context, step, { 
                    approved: false, 
                    reason: 'auto-rejected on timeout',
                    timeout: true 
                }, definition);
            } else {
                await this.handleStepError(context, step, new Error('Approval timeout'), definition);
            }
        }
    }

    // Event handlers for workflow management
    private async handleWorkflowResume(event: any): Promise<void> {
        const { workflowRunId, resumeData } = event.payload;
        await this.resumeWorkflow(workflowRunId, resumeData);
    }

    private async handleWorkflowPause(event: any): Promise<void> {
        const { workflowRunId, reason, resumeAt } = event.payload;
        const context = this.runningWorkflows.get(workflowRunId);
        if (context) {
            await this.pauseWorkflow(context, new Date(resumeAt), reason);
        }
    }

    private async handleWorkflowCancel(event: any): Promise<void> {
        const { workflowRunId, reason } = event.payload;
        const context = this.runningWorkflows.get(workflowRunId) || this.waitingWorkflows.get(workflowRunId)?.context;
        if (context) {
            await this.logWorkflowStep(workflowRunId, 'trigger_failed', `Workflow cancelled: ${reason || 'Manual cancellation'}`, { reason });
            await this.completeWorkflow(context, 'cancelled');
        }
    }

    private async handleStepFailed(event: any): Promise<void> {
        const { payload } = event;
        const { workflowRunId, stepId, error } = payload;

        const context = this.runningWorkflows.get(workflowRunId);
        if (!context) return;

        const workflowRun = await this.workflowRunRepo.findOne({ where: { id: workflowRunId } });
        if (!workflowRun) return;

        const definition = workflowRun.context.definition;
        const step = definition.steps.find(s => s.id === stepId);

        if (step) {
            await this.handleStepError(context, step, new Error(error), definition);
        }
    }

    // 📊 Public API methods for workflow management
    async getWorkflowStatus(workflowRunId: string): Promise<any> {
        const running = this.runningWorkflows.get(workflowRunId);
        const waiting = this.waitingWorkflows.get(workflowRunId);
        
        if (running) {
            return {
                status: 'running',
                currentStep: running.currentStepId,
                data: running.data,
                variables: running.variables,
                history: running.history
            };
        }
        
        if (waiting) {
            return {
                status: 'waiting',
                currentStep: waiting.context.currentStepId,
                resumeAt: waiting.resumeAt,
                reason: waiting.reason,
                data: waiting.context.data,
                variables: waiting.context.variables,
                history: waiting.context.history
            };
        }

        // Check database for completed workflows
        const workflowRun = await this.workflowRunRepo.findOne({
            where: { id: workflowRunId },
            relations: ['template']
        });

        return workflowRun ? {
            status: workflowRun.status,
            context: workflowRun.context,
            template: workflowRun.template,
            created_at: workflowRun.created_at,
            updated_at: workflowRun.updated_at
        } : null;
    }

    async getWorkflowLogs(workflowRunId: string, limit: number = 50): Promise<WorkflowLog[]> {
        return await this.workflowLogRepo.find({
            where: { workflow_run: { id: workflowRunId } },
            order: { created_at: 'DESC' },
            take: limit
        });
    }

    async getRunningWorkflows(): Promise<string[]> {
        return Array.from(this.runningWorkflows.keys());
    }

    async getWaitingWorkflows(): Promise<Array<{ workflowRunId: string; resumeAt: Date; reason: string }>> {
        return Array.from(this.waitingWorkflows.entries()).map(([workflowRunId, waiting]) => ({
            workflowRunId,
            resumeAt: waiting.resumeAt,
            reason: waiting.reason
        }));
    }

    // 🔧 Manual workflow operations
    async pauseWorkflowManually(workflowRunId: string, reason: string, resumeAt?: Date): Promise<void> {
        const context = this.runningWorkflows.get(workflowRunId);
        if (context) {
            const pauseUntil = resumeAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default: 1 year (manual)
            await this.pauseWorkflow(context, pauseUntil, reason);
        } else {
            throw new Error(`Workflow ${workflowRunId} is not currently running`);
        }
    }

    async resumeWorkflowManually(workflowRunId: string, resumeData?: any): Promise<void> {
        const waiting = this.waitingWorkflows.get(workflowRunId);
        if (!waiting) {
            throw new Error(`Workflow ${workflowRunId} is not in waiting state`);
        }
        await this.resumeWorkflow(workflowRunId, resumeData);
    }

    async cancelWorkflow(workflowRunId: string, reason: string): Promise<void> {
        const context = this.runningWorkflows.get(workflowRunId) || this.waitingWorkflows.get(workflowRunId)?.context;
        if (!context) {
            throw new Error(`Workflow ${workflowRunId} not found`);
        }
        
        await this.logWorkflowStep(workflowRunId, 'trigger_failed', `Workflow cancelled: ${reason}`, { reason });
        await this.completeWorkflow(context, 'cancelled');
    }

    async skipWorkflowStep(workflowRunId: string, stepId: string, reason: string): Promise<void> {
        const context = this.runningWorkflows.get(workflowRunId);
        if (!context) {
            throw new Error(`Workflow ${workflowRunId} is not currently running`);
        }

        if (context.currentStepId !== stepId) {
            throw new Error(`Step ${stepId} is not the current step`);
        }

        const workflowRun = await this.workflowRunRepo.findOne({
            where: { id: workflowRunId }
        });

        if (!workflowRun) {
            throw new Error(`Workflow run ${workflowRunId} not found`);
        }

        const definition = workflowRun.context.definition;
        const step = definition.steps.find(s => s.id === stepId);

        if (!step) {
            throw new Error(`Step ${stepId} not found in workflow definition`);
        }

        // Mark step as skipped
        context.history.push({
            stepId: step.id,
            status: 'skipped',
            timestamp: new Date(),
            result: { reason, skippedManually: true }
        });

        await this.logWorkflowStep(workflowRunId, 'skipped', `Step ${step.name} skipped: ${reason}`, {
            stepId: step.id,
            stepName: step.name,
            reason,
            skippedManually: true
        });

        // Move to next step
        const nextStepId = step.nextSteps?.[0];
        if (nextStepId) {
            context.currentStepId = nextStepId;
            await this.executeNextStep(context, definition);
        } else {
            await this.completeWorkflow(context, 'completed');
        }
    }

    // 📈 Get workflow statistics
    async getWorkflowStats(): Promise<any> {
        const now = new Date();
        
        // Get database stats
        const totalWorkflows = await this.workflowRunRepo.count();
        const runningInDb = await this.workflowRunRepo.count({ where: { status: 'running' } });
        const pausedInDb = await this.workflowRunRepo.count({ where: { status: 'paused' } });
        const completedInDb = await this.workflowRunRepo.count({ where: { status: 'completed' } });
        const failedInDb = await this.workflowRunRepo.count({ where: { status: 'failed' } });

        // Get in-memory stats
        const nextResumeTime = this.getNextResumeTime();
        const overdueTasks = Array.from(this.waitingWorkflows.values())
            .filter(waiting => waiting.resumeAt <= now).length;

        return {
            // In-memory statistics
            runningWorkflows: this.runningWorkflows.size,
            waitingWorkflows: this.waitingWorkflows.size,
            runningWorkflowIds: Array.from(this.runningWorkflows.keys()),
            waitingWorkflowIds: Array.from(this.waitingWorkflows.keys()),
            nextResumeTime,
            overdueTasks,
            
            // Database statistics
            totalWorkflows,
            runningInDb,
            pausedInDb,
            completedInDb,
            failedInDb,
            
            // Health metrics
            memoryDbSync: runningInDb === this.runningWorkflows.size,
            timestamp: now.toISOString()
        };
    }

    private getNextResumeTime(): Date | null {
        let nextResume: Date | null = null;
        this.waitingWorkflows.forEach(waiting => {
            if (!nextResume || waiting.resumeAt < nextResume) {
                nextResume = waiting.resumeAt;
            }
        });
        return nextResume;
    }

    // 🔄 Workflow recovery and cleanup methods
    async recoverWorkflows(): Promise<{ recovered: number; errors: string[] }> {
        this.logger.log('🔄 Starting workflow recovery process...');
        
        let recovered = 0;
        const errors: string[] = [];

        try {
            // Find workflows that should be running but aren't in memory
            const runningWorkflows = await this.workflowRunRepo.find({
                where: { status: 'running' }
            });

            for (const workflowRun of runningWorkflows) {
                if (!this.runningWorkflows.has(workflowRun.id)) {
                    try {
                        // Restore workflow context
                        const context: WorkflowContext = {
                            workflowRunId: workflowRun.id,
                            currentStepId: workflowRun.context.currentStepId || workflowRun.context.definition.startStep,
                            data: workflowRun.context.initialData || {},
                            variables: workflowRun.context.variables || {},
                            history: workflowRun.context.history || []
                        };

                        this.runningWorkflows.set(workflowRun.id, context);
                        
                        // Resume execution
                        const definition = workflowRun.context.definition;
                        await this.executeNextStep(context, definition);
                        
                        recovered++;
                        this.logger.log(`✅ Recovered workflow: ${workflowRun.id}`);
                    } catch (error) {
                        const errorMsg = `Failed to recover workflow ${workflowRun.id}: ${error.message}`;
                        errors.push(errorMsg);
                        this.logger.error(errorMsg);
                    }
                }
            }

            // Find workflows that should be waiting but aren't in memory
            const pausedWorkflows = await this.workflowRunRepo.find({
                where: { status: 'paused' }
            });

            for (const workflowRun of pausedWorkflows) {
                if (!this.waitingWorkflows.has(workflowRun.id)) {
                    try {
                        const context: WorkflowContext = {
                            workflowRunId: workflowRun.id,
                            currentStepId: workflowRun.context.currentStepId || workflowRun.context.definition.startStep,
                            data: workflowRun.context.initialData || {},
                            variables: workflowRun.context.variables || {},
                            history: workflowRun.context.history || []
                        };

                        const resumeAt = new Date(workflowRun.context.resumeAt);
                        const reason = workflowRun.context.pauseReason || 'Recovered from database';

                        this.waitingWorkflows.set(workflowRun.id, {
                            context,
                            resumeAt,
                            reason
                        });

                        recovered++;
                        this.logger.log(`✅ Recovered paused workflow: ${workflowRun.id}`);
                    } catch (error) {
                        const errorMsg = `Failed to recover paused workflow ${workflowRun.id}: ${error.message}`;
                        errors.push(errorMsg);
                        this.logger.error(errorMsg);
                    }
                }
            }

        } catch (error) {
            const errorMsg = `Recovery process failed: ${error.message}`;
            errors.push(errorMsg);
            this.logger.error(errorMsg);
        }

        this.logger.log(`🔄 Recovery complete. Recovered: ${recovered}, Errors: ${errors.length}`);
        return { recovered, errors };
    }

    async cleanupStaleWorkflows(olderThanDays: number = 30): Promise<{ cleaned: number; errors: string[] }> {
        this.logger.log(`🧹 Starting cleanup of workflows older than ${olderThanDays} days...`);
        
        let cleaned = 0;
        const errors: string[] = [];
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

        try {
            // Find old completed/failed workflows
            const staleWorkflows = await this.workflowRunRepo.find({
                where: [
                    { status: 'completed', updated_at: { $lt: cutoffDate } as any },
                    { status: 'failed', updated_at: { $lt: cutoffDate } as any },
                    { status: 'cancelled', updated_at: { $lt: cutoffDate } as any }
                ]
            });

            for (const workflowRun of staleWorkflows) {
                try {
                    // Delete associated logs first
                    await this.workflowLogRepo.delete({ workflow_run: { id: workflowRun.id } });
                    
                    // Delete workflow run
                    await this.workflowRunRepo.delete(workflowRun.id);
                    
                    cleaned++;
                    this.logger.debug(`🗑️ Cleaned up workflow: ${workflowRun.id}`);
                } catch (error) {
                    const errorMsg = `Failed to cleanup workflow ${workflowRun.id}: ${error.message}`;
                    errors.push(errorMsg);
                    this.logger.error(errorMsg);
                }
            }

        } catch (error) {
            const errorMsg = `Cleanup process failed: ${error.message}`;
            errors.push(errorMsg);
            this.logger.error(errorMsg);
        }

        this.logger.log(`🧹 Cleanup complete. Cleaned: ${cleaned}, Errors: ${errors.length}`);
        return { cleaned, errors };
    }

    // 🧪 Testing and debugging methods
    async debugWorkflow(workflowRunId: string): Promise<any> {
        const running = this.runningWorkflows.get(workflowRunId);
        const waiting = this.waitingWorkflows.get(workflowRunId);
        const workflowRun = await this.workflowRunRepo.findOne({
            where: { id: workflowRunId },
            relations: ['template']
        });
        const logs = await this.getWorkflowLogs(workflowRunId, 20);

        return {
            workflowRunId,
            inMemoryStatus: {
                running: !!running,
                waiting: !!waiting,
                runningContext: running,
                waitingInfo: waiting
            },
            databaseRecord: workflowRun,
            recentLogs: logs,
            definition: workflowRun?.context?.definition,
            currentStep: workflowRun?.context?.currentStepId || running?.currentStepId || waiting?.context?.currentStepId,
            progress: workflowRun?.context?.progress,
            lastActivity: workflowRun?.updated_at
        };
    }

    async testWorkflowStep(workflowRunId: string, stepId: string, mockResult: any): Promise<void> {
        const context = this.runningWorkflows.get(workflowRunId);
        if (!context) {
            throw new Error(`Workflow ${workflowRunId} is not currently running`);
        }

        // Simulate step completion
        await EventBus.emit('workflow.step.completed', {
            id: this.generateEventId(),
            type: 'workflow.step.completed',
            timestamp: new Date().toISOString(),
            source: 'workflow-orchestrator-test',
            payload: {
                workflowRunId,
                stepId,
                result: mockResult
            }
        });
    }

    // 🏥 Health check method
    async healthCheck(): Promise<{ 
        status: 'healthy' | 'degraded' | 'unhealthy'; 
        details: any;
        recommendations?: string[];
    }> {
        const stats = await this.getWorkflowStats();
        const recommendations: string[] = [];
        let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

        // Check for memory/database sync issues
        if (!stats.memoryDbSync) {
            status = 'degraded';
            recommendations.push('Run workflow recovery to sync in-memory state with database');
        }

        // Check for overdue tasks
        if (stats.overdueTasks > 0) {
            if (stats.overdueTasks > 10) {
                status = 'unhealthy';
            } else if (status === 'healthy') {
                status = 'degraded';
            }
            recommendations.push(`${stats.overdueTasks} workflows are overdue for resume`);
        }

        // Check for high number of failed workflows
        const failureRate = stats.totalWorkflows > 0 ? (stats.failedInDb / stats.totalWorkflows) * 100 : 0;
        if (failureRate > 20) {
            status = 'unhealthy';
            recommendations.push('High workflow failure rate detected - investigate common failure causes');
        } else if (failureRate > 10 && status === 'healthy') {
            status = 'degraded';
            recommendations.push('Elevated workflow failure rate - monitor closely');
        }

        return {
            status,
            details: {
                ...stats,
                failureRate: Math.round(failureRate * 100) / 100,
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage()
            },
            recommendations: recommendations.length > 0 ? recommendations : undefined
        };
    }
}