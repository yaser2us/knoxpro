// src/zoi/services/zoi-workflow-trigger.service.ts (UPDATED)
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowTemplate } from '../entity/workflow.template.entity';
import { WorkflowRun } from '../entity/workflow.run.entity';
import { WorkflowLog } from '../entity/workflow.log.entity';
import { EventBus } from '../events/event-bus';

@Injectable()
export class ZoiWorkflowTriggerService implements OnModuleInit {
    private readonly logger = new Logger(ZoiWorkflowTriggerService.name);
    private triggerCache = new Map<string, WorkflowTemplate[]>();
    private executionCounts = new Map<string, number>();
    private lastExecutionTimes = new Map<string, Date>();

    constructor(
        @InjectRepository(WorkflowTemplate)
        private readonly templateRepo: Repository<WorkflowTemplate>,
        @InjectRepository(WorkflowRun)
        private readonly runRepo: Repository<WorkflowRun>,
        @InjectRepository(WorkflowLog)
        private readonly logRepo: Repository<WorkflowLog>
    ) { }

    onModuleInit() {
        // 🔄 Listen for document lifecycle events (FROM modules like Pulse)
        EventBus.on('document.lifecycle', this.handleDocumentEvent.bind(this));

        // 🔄 Listen for custom trigger events
        EventBus.on('workflow.trigger.custom', this.handleCustomTrigger.bind(this));

        // 🔄 Listen for workflow completion to handle follow-up workflows
        EventBus.on('workflow.completed', this.handleWorkflowCompletion.bind(this));

        // 🔄 Initialize trigger cache
        this.refreshTriggerCache();

        this.logger.log('🎯 ZoiWorkflowTriggerService initialized and listening for events');
    }

    // 🔍 MAIN DECISION MAKER: Should workflow start?
    async handleDocumentEvent(event: any) {
        const startTime = Date.now();
        const { type: eventType, payload } = event;

        // Handle both old and new event formats
        let document, user, metadata, method;

        if (payload && payload.payload) {
            // New nested format from module listeners
            ({ document, user, metadata, method } = payload.payload);
        } else if (payload) {
            // Original format
            ({ document, user, metadata, method } = payload);
        }

        this.logger.debug(`📥 [trigger] Processing document event: ${eventType} for document ${document?.id}`);

        try {
            if (!document?.id) {
                this.logger.warn('⚠️ [trigger] Document event missing document.id, skipping');
                return;
            }

            // 🔍 CORE LOGIC: Find matching workflow templates
            const matchingTemplates = await this.findMatchingTemplates(eventType, document, user);

            if (matchingTemplates.length === 0) {
                this.logger.debug(`ℹ️ [trigger] No matching workflows found for ${eventType} on ${document.type}:${document.id}`);
                return;
            }

            this.logger.log(`🎯 [trigger] Found ${matchingTemplates.length} matching templates for ${eventType}`);

            // 📋 Sort by priority (higher priority first)
            const sortedTemplates = matchingTemplates.sort((a, b) => (b.priority || 0) - (a.priority || 0));

            // 🚀 HAND OFF TO ORCHESTRATOR: Process each matching template
            for (const template of sortedTemplates) {
                await this.triggerWorkflow(template, document, user, event);
            }

            const processingTime = Date.now() - startTime;
            this.logger.debug(`⚡ [trigger] Processed ${matchingTemplates.length} triggers in ${processingTime}ms`);

        } catch (error) {
            this.logger.error(`❌ [trigger] Error handling document event ${eventType}:`, error);
            await this.logTriggerEvent('trigger_error', {
                eventType,
                documentId: document?.id,
                error: error.message,
                stack: error.stack
            });
        }
    }

    // 🎯 CORE TRIGGER LOGIC: Should this template start?
    private async triggerWorkflow(template: WorkflowTemplate, document: any, user: any, originalEvent: any): Promise<void> {
        try {
            const eventType = originalEvent.type;

            // 🔍 DECISION POINT: Should workflow start?
            const shouldTrigger = await this.shouldTriggerWorkflow(template, eventType, document, user);

            if (!shouldTrigger) {
                this.logger.debug(`⏸️ [trigger] Template '${template.name}' conditions not met for ${document.id}`);
                return;
            }

            this.logger.log(`🚀 [trigger] Triggering workflow '${template.name}' for document ${document.id}`);

            // 📊 Update execution tracking
            this.updateExecutionTracking(template.id);

            // 📝 Log trigger event
            await this.logTriggerEvent('workflow_triggered', {
                templateId: template.id,
                templateName: template.name,
                documentId: document.id,
                documentType: document.type,
                eventType,
                userId: user?.id
            });

            // 🚀 HAND OFF TO ORCHESTRATOR: Emit workflow.start event
            await this.startWorkflow(template, document, user, {
                trigger: originalEvent,
                triggeredAt: new Date().toISOString(),
                triggerService: 'ZoiWorkflowTriggerService'
            });

        } catch (error) {
            this.logger.error(`❌ [trigger] Error processing trigger for '${template.name}':`, error);
            await this.logTriggerEvent('trigger_failed', {
                templateId: template.id,
                templateName: template.name,
                documentId: document.id,
                error: error.message
            });
        }
    }

    // 🚀 ORCHESTRATOR HANDOFF: Convert template to workflow and start
    private async startWorkflow(
        template: WorkflowTemplate,
        document: any,
        user: any,
        context: any
    ): Promise<void> {
        try {
            // 🔧 CRITICAL: Parse and validate the template DSL
            // const d = {"name":"Trainer Signature Flow","version":"1.0.0","startStep":"grant_access","steps":[{"id":"grant_access","type":"module_task","name":"Grant Trainer Access","module":"knox","config":{"taskType":"grant_access","to":"trainer","permissions":["view","sign"]},"nextSteps":["wait_for_signature"]},{"id":"wait_for_signature","type":"approval","name":"Wait for Trainer Signature","config":{"approvers":["trainer"],"requiredApprovals":1,"timeout":432000,"message":"Please review and sign the document"},"nextSteps":["send_confirmation"]},{"id":"send_confirmation","type":"notification","name":"Send Confirmation Email","config":{"recipients":["trainer.email"],"subject":"Document Signed Successfully","template":"signed_confirmation"},"nextSteps":["log_completion"]},{"id":"log_completion","type":"module_task","name":"Log Signature Completion","module":"pulse","config":{"taskType":"log_event","message":"Signature completed and email sent."}}]}
            let parsedDSL// = d;
            try {
                parsedDSL = typeof template.dsl === 'string' ? JSON.parse(template.dsl) : template.dsl;
            } catch (parseError) {
                console.log(parseError);
                console.log(template.dsl);
                this.logger.error(`❌ [trigger] Failed to parse DSL for template ${template.name}:`, parseError);
                throw new Error(`Invalid DSL format in template ${template.name}`);
            }

            // 🎯 WORKFLOW START EVENT: This is what WorkflowOrchestrator listens for
            const workflowStartEvent = {
                id: this.generateEventId(),
                type: 'workflow.start',
                timestamp: new Date().toISOString(),
                source: 'zoi-workflow-trigger-service',
                payload: {
                    template: {
                        id: template.id,
                        name: template.name,
                        version: template.version || '1.0',
                        dsl: parsedDSL // Parsed DSL with steps array
                    },
                    document,
                    user,
                    context
                }
            };


            this.logger.log(`📤 [trigger] Emitting workflow.start for '${template.name}' → Orchestrator will take over`);
            this.logger.debug(`📋 [trigger] Workflow definition:`, {
                templateId: template.id,
                templateName: template.name,
                stepsCount: parsedDSL.steps?.length || 0,
                startStep: parsedDSL.startStep
            });

            // 🚀 HAND OFF: Emit to EventBus - WorkflowOrchestrator will pick this up
            await EventBus.emit('workflow.start', workflowStartEvent);

            this.logger.log(`✅ [trigger] Workflow start event emitted for '${template.name}' on document ${document.id}`);

        } catch (error) {
            this.logger.error(`❌ [trigger] Failed to start workflow for template ${template.name}:`, error);
            throw error;
        }
    }

    // 🔄 Handle custom trigger events (manual triggers)
    async handleCustomTrigger(event: any) {
        const { templateId, documentId, context, user } = event.payload;
        this.logger.log(`🎯 [trigger] Processing custom trigger for template ${templateId}`);

        try {
            const template = await this.templateRepo.findOne({
                where: { id: templateId, is_active: true }
            });

            if (!template) {
                this.logger.warn(`⚠️ [trigger] Template ${templateId} not found or inactive`);
                return;
            }

            // For custom triggers, we bypass normal conditions
            const document = { id: documentId };
            await this.startWorkflow(template, document, user, {
                customTrigger: true,
                originalEvent: event,
                context
            });

        } catch (error) {
            this.logger.error(`❌ [trigger] Error handling custom trigger:`, error);
        }
    }

    // 🔄 Handle workflow completion (for follow-up workflows)
    async handleWorkflowCompletion(event: any) {
        const { workflowRun, status, finalData } = event.payload;
        this.logger.debug(`📥 [trigger] Workflow completed: ${workflowRun.id} with status: ${status}`);

        // Only trigger follow-up workflows for successful completions
        if (status !== 'completed') {
            return;
        }

        try {
            // Find templates that should trigger on workflow completion
            const followUpTemplates = await this.findFollowUpWorkflows(workflowRun);

            for (const template of followUpTemplates) {
                this.logger.log(`🔄 [trigger] Triggering follow-up workflow: ${template.name}`);

                // Create a synthetic document event for the follow-up
                const syntheticEvent = {
                    id: this.generateEventId(),
                    type: `workflow.${workflowRun.template.id}.completed`,
                    timestamp: new Date().toISOString(),
                    source: 'workflow-completion',
                    payload: {
                        document: {
                            id: workflowRun.document_id,
                            type: 'workflow_completion',
                            originalWorkflowId: workflowRun.id,
                            finalData
                        },
                        user: { id: 'system' },
                        metadata: {
                            source: 'workflow_completion',
                            originalWorkflowId: workflowRun.id,
                            completedWorkflowTemplate: workflowRun.template.id
                        }
                    }
                };

                await this.triggerWorkflow(template, syntheticEvent.payload.document, syntheticEvent.payload.user, syntheticEvent);
            }
        } catch (error) {
            console.log(error);
            this.logger.error(`❌ [trigger] Error handling workflow completion:`, error);
        }
    }

    // 🔍 DECISION ENGINE: Should workflow trigger?
    private async shouldTriggerWorkflow(
        template: WorkflowTemplate,
        eventType: string,
        document: any,
        user: any
    ): Promise<boolean> {
        try {
            const triggers = this.parseTriggers(template.triggers);

            for (const trigger of triggers) {
                // 🔧 Get events array, handling both formats
                const events = this.getEventsFromTrigger(trigger);

                // ✅ Check 1: Event type matches?
                if (!this.matchesEventType(eventType, events)) {
                    this.logger.debug(`❌ [decision] Event type mismatch: ${eventType} not in [${events.join(', ')}]`);
                    continue;
                }

                // ✅ Check 2: Document type matches?
                if (trigger.entityTypes && !trigger.entityTypes.includes(document.type)) {
                    this.logger.debug(`❌ [decision] Entity type mismatch: ${document.type} not in [${trigger.entityTypes.join(', ')}]`);
                    continue;
                }

                // ✅ Check 3: Conditions met?
                if (!this.evaluateConditions(trigger.conditions, document, user)) {
                    this.logger.debug(`❌ [decision] Conditions not met for template ${template.name}`);
                    continue;
                }

                // ✅ Check 4: Not in cooldown?
                if (!this.checkCooldown(template.id, trigger.cooldownSeconds)) {
                    this.logger.debug(`⏰ [decision] Template ${template.name} in cooldown period`);
                    continue;
                }

                // ✅ Check 5: Execution limit not exceeded?
                if (!this.checkExecutionLimit(template.id, trigger.maxExecutions)) {
                    this.logger.debug(`🚫 [decision] Template ${template.name} exceeded max executions`);
                    continue;
                }

                // ✅ Check 6: No duplicate running workflow?
                if (await this.hasDuplicateRunningWorkflow(template.id, document.id)) {
                    this.logger.debug(`🔄 [decision] Template ${template.name} already running for document ${document.id}`);
                    continue;
                }

                // 🎯 All checks passed!
                this.logger.log(`✅ [decision] All conditions met for template ${template.name}`);
                return true;
            }

            return false;

        } catch (error) {
            console.log(error)
            this.logger.error(`❌ [decision] Error evaluating workflow trigger for '${template.name}':`, error);
            return false;
        }
    }

    // 🔍 Find templates that match the event
    private async findMatchingTemplates(eventType: string, document: any, user: any): Promise<WorkflowTemplate[]> {
        const cacheKey = `${eventType}_${document.type || 'unknown'}`;
        let templates = this.triggerCache.get(cacheKey);

        if (!templates) {
            // Cache miss - load from database
            templates = await this.templateRepo.find({
                where: { is_active: true },
                order: { priority: 'DESC' }
            });
            this.triggerCache.set(cacheKey, templates);
            this.logger.debug(`📋 [cache] Loaded ${templates.length} templates for ${cacheKey}`);
        }

        const matchingTemplates: WorkflowTemplate[] = [];
        for (const template of templates) {
            if (await this.shouldTriggerWorkflow(template, eventType, document, user)) {
                matchingTemplates.push(template);
            }
        }

        return matchingTemplates;
    }

    // 🔄 Find follow-up workflows
    // private async findFollowUpWorkflows(completedWorkflowRun: any): Promise<WorkflowTemplate[]> {
    //     const followUpTemplates = await this.templateRepo.find({
    //         where: { is_active: true }
    //     });

    //     return followUpTemplates.filter(template => {
    //         const triggers = this.parseTriggers(template.triggers);
    //         return triggers.some(trigger => {
    //             const events = this.getEventsFromTrigger(trigger);
    //             return events.includes('workflow.completed') ||
    //                 events.includes(`workflow.${completedWorkflowRun.template.id}.completed`);
    //         });
    //     });
    // }

    async findFollowUpWorkflows(completedTemplateId: string): Promise<WorkflowTemplate[]> {
        try {
            this.logger.debug(`🔍 [followup] Finding follow-up workflows for template: ${completedTemplateId}`);

            const allTemplates = await this.templateRepo.find();
            this.logger.debug(`📋 [followup] Found ${allTemplates.length} total templates to check`);

            const followUpTemplates = allTemplates.filter(template => {
                // 🔧 FIX: Add null safety checks
                if (!template) {
                    this.logger.warn(`⚠️ [followup] Found null/undefined template, skipping`);
                    return false;
                }

                if (!template.triggers || !Array.isArray(template.triggers)) {
                    this.logger.debug(`📋 [followup] Template '${template.name}' has no triggers, skipping`);
                    return false;
                }

                if (template.triggers.length === 0) {
                    this.logger.debug(`📋 [followup] Template '${template.name}' has empty triggers array, skipping`);
                    return false;
                }

                // 🔧 FIX: Check each trigger safely
                const hasFollowUpTrigger = template.triggers.some(trigger => {
                    if (!trigger) {
                        this.logger.warn(`⚠️ [followup] Found null/undefined trigger in template '${template.name}', skipping`);
                        return false;
                    }

                    // 🔧 FIX: Check trigger structure - could be trigger.type or trigger.eventType
                    const triggerType = trigger.type || trigger.eventType || trigger.event || trigger.id;

                    if (!triggerType) {
                        this.logger.warn(`⚠️ [followup] Trigger missing type/eventType/event/id in template '${template.name}':`, trigger);
                        return false;
                    }

                    const expectedEvent = `workflow.${completedTemplateId}.completed`;
                    const matches = triggerType === expectedEvent;

                    if (matches) {
                        this.logger.debug(`✅ [followup] Found matching trigger: ${triggerType} in template '${template.name}'`);
                    }

                    return matches;
                });

                return hasFollowUpTrigger;
            });

            this.logger.log(`🎯 [followup] Found ${followUpTemplates.length} follow-up workflows for '${completedTemplateId}'`);

            return followUpTemplates;

        } catch (error) {
            this.logger.error(`❌ [followup] Error finding follow-up workflows for '${completedTemplateId}':`, error);
            return []; // Return empty array on error to prevent cascade failures
        }
    }


    // 🔧 Helper methods for trigger evaluation
    private getEventsFromTrigger(trigger: any): string[] {
        if (trigger.events && Array.isArray(trigger.events)) {
            return trigger.events;
        }

        if (trigger.event && typeof trigger.event === 'string') {
            return [trigger.event];
        }

        return [];
    }

    private matchesEventType(eventType: string, allowedEvents: string[]): boolean {
        if (!allowedEvents || !Array.isArray(allowedEvents) || allowedEvents.length === 0) {
            return false;
        }

        return allowedEvents.some(pattern => {
            if (!pattern || typeof pattern !== 'string') {
                return false;
            }

            // Handle wildcard patterns
            if (pattern.includes('*')) {
                const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
                return regex.test(eventType);
            }
            return pattern === eventType;
        });
    }

    private parseTriggers(triggers: any): any[] {
        if (!triggers) return [];

        let parsedTriggers: any[];
        if (Array.isArray(triggers)) {
            parsedTriggers = triggers;
        } else if (typeof triggers === 'string') {
            try {
                parsedTriggers = JSON.parse(triggers);
            } catch (error) {
                this.logger.error('❌ [parse] Failed to parse triggers JSON:', error);
                return [];
            }
        } else {
            parsedTriggers = [triggers];
        }

        return parsedTriggers.map(trigger => this.normalizeTrigger(trigger));
    }

    private normalizeTrigger(trigger: any): any {
        const normalized: any = { ...trigger };

        // Convert single event to events array
        if (trigger.event && !trigger.events) {
            normalized.events = [trigger.event];
            delete normalized.event;
        }

        // Ensure events is an array
        if (normalized.events && !Array.isArray(normalized.events)) {
            normalized.events = [normalized.events];
        }

        // Convert object conditions to array format
        if (trigger.conditions && !Array.isArray(trigger.conditions)) {
            const conditionsArray: any[] = [];
            for (const [field, value] of Object.entries(trigger.conditions)) {
                conditionsArray.push({
                    field,
                    operator: 'equals',
                    value
                });
            }
            normalized.conditions = conditionsArray;
        }

        return normalized;
    }

    private evaluateConditions(conditions: any[] = [], document: any, user: any): boolean {
        if (!conditions || conditions.length === 0) return true;

        const context = { document, user };
        return conditions.every(condition => {
            try {
                const fieldValue = this.getFieldValue(context, condition.field);
                const result = this.evaluateCondition(condition, fieldValue);
                this.logger.debug(`🔍 [condition] ${condition.field} ${condition.operator} ${condition.value} = ${result} (actual: ${fieldValue})`);
                return result;
            } catch (error) {
                this.logger.error(`❌ [condition] Error evaluating condition:`, error);
                return false;
            }
        });
    }

    private getFieldValue(context: any, fieldPath: string): any {
        return fieldPath.split('.').reduce((obj, key) => obj?.[key], context);
    }

    private evaluateCondition(condition: any, fieldValue: any): boolean {
        const { operator, value } = condition;

        switch (operator) {
            case 'equals': return fieldValue === value;
            case 'not_equals': return fieldValue !== value;
            case 'contains': return String(fieldValue || '').includes(String(value));
            case 'not_contains': return !String(fieldValue || '').includes(String(value));
            case 'greater_than': return Number(fieldValue) > Number(value);
            case 'less_than': return Number(fieldValue) < Number(value);
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
                this.logger.warn(`⚠️ [condition] Unknown condition operator: ${operator}`);
                return true;
        }
    }

    private checkCooldown(templateId: string, cooldownSeconds?: number): boolean {
        if (!cooldownSeconds) return true;

        const lastExecution = this.lastExecutionTimes.get(templateId);
        if (!lastExecution) return true;

        const timeSinceLastExecution = (Date.now() - lastExecution.getTime()) / 1000;
        return timeSinceLastExecution >= cooldownSeconds;
    }

    private checkExecutionLimit(templateId: string, maxExecutions?: number): boolean {
        if (!maxExecutions) return true;

        const executionCount = this.executionCounts.get(templateId) || 0;
        return executionCount < maxExecutions;
    }

    private async hasDuplicateRunningWorkflow(templateId: string, documentId: string): Promise<boolean> {
        const runningWorkflow = await this.runRepo.findOne({
            where: {
                template: { id: templateId },
                document_id: documentId,
                status: 'running'
            }
        });

        return !!runningWorkflow;
    }

    private updateExecutionTracking(templateId: string): void {
        const currentCount = this.executionCounts.get(templateId) || 0;
        this.executionCounts.set(templateId, currentCount + 1);
        this.lastExecutionTimes.set(templateId, new Date());
    }

    private async logTriggerEvent(type: string, metadata: any): Promise<void> {
        try {
            const log = new WorkflowLog();
            log.workflow_run = null; // Trigger-level log
            log.type = type as any;
            log.message = `Trigger ${type}`;
            log.metadata = metadata;
            log.step_index = null;
            log.actor_user_id = metadata.userId || null;
            log.actor_workspace_id = metadata.workspaceId || null;

            await this.logRepo.save(log);
        } catch (error) {
            this.logger.error('❌ [log] Failed to log trigger event:', error);
        }
    }

    // 🔄 Cache management
    async refreshTriggerCache(): Promise<void> {
        this.logger.log('🔄 [cache] Refreshing workflow trigger cache...');
        this.triggerCache.clear();

        const templates = await this.templateRepo.find({
            where: { is_active: true }
        });

        this.logger.log(`📋 [cache] Loaded ${templates.length} active workflow templates`);
    }

    // 🔧 Utility methods
    private generateEventId(): string {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // 🔄 Public API methods (keep existing)
    getAllEventTypes(): string[] {
        return EventBus.getAllEventTypes();
    }

    // 🧪 Test methods for integration
    async testTriggerConditions(
        templateId: string,
        document: any,
        user: any,
        eventType: string
    ): Promise<boolean> {
        const template = await this.templateRepo.findOne({
            where: { id: templateId }
        });

        if (!template) {
            throw new Error(`Template ${templateId} not found`);
        }

        return await this.shouldTriggerWorkflow(template, eventType, document, user);
    }

    async debugEventStructure(event: any): Promise<void> {
        this.logger.log('🧪 [debug] Event structure analysis:');
        this.logger.log(`📋 [debug] Event type: ${event.type}`);
        this.logger.log(`📋 [debug] Event source: ${event.source}`);
        this.logger.log(`📋 [debug] Event payload:`, JSON.stringify(event.payload, null, 2));

        // Test trigger matching
        const { document, user } = event.payload;
        if (document) {
            const matchingTemplates = await this.findMatchingTemplates(event.type, document, user);
            this.logger.log(`📋 [debug] Matching templates: ${matchingTemplates.length}`);
            matchingTemplates.forEach(template => {
                this.logger.log(`  📌 [debug] ${template.name} (${template.id})`);
            });
        }
    }

    async getExecutionStats(): Promise<{
        templateExecutions: Record<string, number>;
        lastExecutions: Record<string, string>;
        cacheSize: number;
    }> {
        return {
            templateExecutions: Object.fromEntries(this.executionCounts),
            lastExecutions: Object.fromEntries(
                Array.from(this.lastExecutionTimes.entries()).map(([id, date]) => [id, date.toISOString()])
            ),
            cacheSize: this.triggerCache.size
        };
    }

    // 📊 Statistics
    async getTriggerStats(): Promise<any> {
        const totalTemplates = await this.templateRepo.count({ where: { is_active: true } });
        const recentExecutions = this.executionCounts.size;
        const cacheSize = this.triggerCache.size;

        return {
            totalActiveTemplates: totalTemplates,
            templatesWithRecentExecutions: recentExecutions,
            cacheSize,
            executionCounts: Object.fromEntries(this.executionCounts),
            lastExecutionTimes: Object.fromEntries(
                Array.from(this.lastExecutionTimes.entries()).map(([key, date]) => [key, date.toISOString()])
            )
        };
    }

    // 🧪 Add this test method to manually create and test events:
    async testDocumentEventFlow(): Promise<void> {
        this.logger.log('🧪 Testing document event flow...');

        // Create a test event that should work
        const testEvent = {
            id: 'test-event-123',
            type: 'document.contract.created',
            timestamp: new Date().toISOString(),
            source: 'test',
            payload: {
                document: {
                    id: 'test-doc-123',
                    type: 'contract',
                    title: 'Test Contract',
                    status: 'draft',
                    metadata: { requiresApproval: true }
                },
                user: {
                    id: 'test-user-456',
                    name: 'Test User',
                    role: 'employee'
                },
                method: 'POST',
                metadata: {
                    userAgent: 'test-agent',
                    ip: '127.0.0.1'
                }
            }
        };

        this.logger.log('🚀 Emitting test event...');
        EventBus.emit('document.lifecycle', testEvent);

        // Wait a bit and check if it was processed
        setTimeout(() => {
            this.logger.log('✅ Test event flow completed');
        }, 1000);
    }
}

// 🎯 WORKFLOW TEMPLATE DSL EXAMPLES
export const WorkflowTemplateDSLExamples = {
    // Employee onboarding template DSL
    employeeOnboardingDSL: {
        name: 'Employee Onboarding Process',
        version: '1.0',
        startStep: 'notify_hr',
        steps: [
            {
                id: 'notify_hr',
                type: 'module_task',
                name: 'Notify HR Team',
                module: 'pulse',
                config: {
                    taskType: 'notify_hr_team',
                    outputVariable: 'hrNotified'
                },
                nextSteps: ['create_tasks']
            },
            {
                id: 'create_tasks',
                type: 'module_task',
                name: 'Create Onboarding Tasks',
                module: 'pulse',
                config: {
                    taskType: 'create_onboarding_tasks'
                },
                timeout: 300,
                retryCount: 2,
                nextSteps: ['await_approval']
            },
            {
                id: 'await_approval',
                type: 'approval',
                name: 'HR Manager Approval',
                config: {
                    approvers: ['hr_manager'],
                    requiredApprovals: 1,
                    timeout: 172800, // 2 days
                    message: 'Please approve onboarding for {{data.document.employeeId}}',
                    timeoutAction: 'fail'
                },
                nextSteps: ['wait_for_start_date']
            },
            {
                id: 'wait_for_start_date',
                type: 'delay',
                name: 'Wait for Employee Start Date',
                config: {
                    delayUntil: '{{data.document.metadata.startDate}}' // Dynamic delay
                },
                nextSteps: ['setup_accounts']
            },
            {
                id: 'setup_accounts',
                type: 'module_task',
                name: 'Setup Employee Accounts',
                module: 'pulse',
                config: {
                    taskType: 'setup_employee_accounts'
                },
                nextSteps: ['send_welcome']
            },
            {
                id: 'send_welcome',
                type: 'notification',
                name: 'Send Welcome Message',
                config: {
                    recipients: ['{{data.document.employeeId}}', 'hr_team'],
                    subject: 'Welcome to the Company!',
                    message: 'Your onboarding process is complete. Welcome aboard!'
                }
            }
        ]
    },

    // Contract workflow template DSL
    contractWorkflowDSL: {
        name: 'Contract Processing Workflow',
        version: '1.0',
        startStep: 'legal_review',
        steps: [
            {
                id: 'legal_review',
                type: 'module_task',
                name: 'Legal Review',
                module: 'knox',
                config: {
                    taskType: 'initiate_legal_review',
                    outputVariable: 'legalReview'
                },
                timeout: 86400, // 24 hours
                nextSteps: ['check_review_result']
            },
            {
                id: 'check_review_result',
                type: 'condition',
                name: 'Check Legal Review Result',
                conditions: [
                    {
                        field: 'variables.legalReview.approved',
                        operator: 'equals',
                        value: true,
                        nextStep: 'setup_signatures'
                    }
                ],
                nextSteps: ['rejected_notification'] // Default: rejected
            },
            {
                id: 'setup_signatures',
                type: 'module_task',
                name: 'Setup Signature Workflow',
                module: 'knox',
                config: {
                    taskType: 'setup_signature_workflow'
                },
                nextSteps: ['await_signatures']
            },
            {
                id: 'await_signatures',
                type: 'approval',
                name: 'Await Contract Signatures',
                config: {
                    approvers: ['{{data.document.metadata.signers}}'],
                    requiredApprovals: 2,
                    timeout: 604800, // 1 week
                    message: 'Please review and sign the contract'
                },
                nextSteps: ['contract_complete']
            },
            {
                id: 'contract_complete',
                type: 'notification',
                name: 'Contract Complete',
                config: {
                    recipients: ['legal_team', '{{data.user.id}}'],
                    subject: 'Contract Fully Executed',
                    message: 'Contract {{data.document.title}} has been fully executed'
                }
            },
            {
                id: 'rejected_notification',
                type: 'notification',
                name: 'Legal Review Rejected',
                config: {
                    recipients: ['{{data.user.id}}'],
                    subject: 'Contract Review Rejected',
                    message: 'The contract requires revision before proceeding'
                }
            }
        ]
    }
};

// 🎯 INTEGRATION EXAMPLE
export class TriggerOrchestratorIntegration {
    /*
    FLOW EXAMPLE:
    
    1. 📄 Document Created (Pulse emits 'document.lifecycle')
       ↓
    2. 🔍 ZoiWorkflowTriggerService.handleDocumentEvent()
       ├─ Finds matching templates
       ├─ Evaluates conditions, cooldowns, limits
       ├─ Decision: "Should Employee Onboarding workflow start?"
       └─ YES → Emits 'workflow.start' event
       ↓
    3. 🎭 WorkflowOrchestrator.handleWorkflowStart()
       ├─ Receives 'workflow.start' event
       ├─ Creates WorkflowRun record
       ├─ Starts executing steps:
       │  ├─ Step 1: Pulse.notifyHRTeam() → 'pulse.task.execute'
       │  ├─ Step 2: Pulse.createOnboardingTasks() → 'pulse.task.execute'
       │  ├─ Step 3: Wait for approval → 'approval.request'
       │  ├─ Step 4: Delay until start date → pause workflow
       │  └─ Step 5: Setup accounts → 'pulse.task.execute'
       └─ Manages entire 2-week workflow
    
    🎯 KEY HANDOFF POINT:
    ZoiWorkflowTriggerService → EventBus.emit('workflow.start') → WorkflowOrchestrator
    */

    // Example of the critical handoff
    static demonstrateHandoff() {
        // 1. TriggerService receives document event
        const documentEvent = {
            type: 'document.employee_onboarding.created',
            payload: {
                document: { id: 'emp_001', type: 'employee_onboarding' },
                user: { id: 'hr_manager' }
            }
        };

        // 2. TriggerService decides to start workflow and emits:
        const workflowStartEvent = {
            type: 'workflow.start',
            payload: {
                template: {
                    id: 'onboarding_template_v1',
                    name: 'Employee Onboarding',
                    version: '1.0',
                    dsl: {
                        startStep: 'notify_hr',
                        steps: [
                            {
                                id: 'notify_hr',
                                type: 'module_task',
                                name: 'Notify HR Team',
                                module: 'pulse',
                                config: { taskType: 'notify_hr_team' },
                                nextSteps: ['create_tasks']
                            },
                            // ... more steps
                        ]
                    }
                },
                document: documentEvent.payload.document,
                user: documentEvent.payload.user
            }
        };

        // 3. Orchestrator receives and starts managing the workflow
        console.log('🔄 Handoff complete: TriggerService → Orchestrator');
    }
}

// 🧪 TESTING INTEGRATION
export class IntegrationTesting {
    constructor(
        private triggerService: ZoiWorkflowTriggerService
    ) { }

    // Test the trigger-orchestrator handoff
    async testTriggerToOrchestrator(): Promise<void> {
        console.log('🧪 Testing Trigger → Orchestrator integration...');

        // 1. Create a test document event
        const testEvent = {
            id: 'test_integration_001',
            type: 'document.employee_onboarding.created',
            timestamp: new Date().toISOString(),
            source: 'integration-test',
            payload: {
                document: {
                    id: 'test_emp_doc_123',
                    type: 'employee_onboarding',
                    employeeId: 'emp_test_456',
                    title: 'Test Employee Onboarding',
                    metadata: {
                        startDate: '2025-07-01T09:00:00Z',
                        department: 'engineering',
                        position: 'Software Engineer'
                    }
                },
                user: {
                    id: 'hr_manager_test',
                    name: 'Test HR Manager'
                },
                metadata: {
                    source: 'integration_test'
                }
            }
        };

        // 2. Emit the event that TriggerService listens for
        console.log('📤 Emitting document.lifecycle event...');
        await EventBus.emit('document.lifecycle', testEvent);

        // 3. TriggerService should process and emit workflow.start
        // 4. Orchestrator should pick up and start managing workflow

        console.log('✅ Integration test triggered - check logs for workflow.start emission');
    }

    // Test custom trigger
    async testCustomTrigger(): Promise<void> {
        const customTriggerEvent = {
            id: 'custom_test_001',
            type: 'workflow.trigger.custom',
            timestamp: new Date().toISOString(),
            source: 'integration-test',
            payload: {
                templateId: 'onboarding_template_v1',
                documentId: 'test_doc_789',
                context: {
                    manual: true,
                    reason: 'Integration testing'
                },
                user: {
                    id: 'admin_test',
                    name: 'Test Admin'
                }
            }
        };

        console.log('📤 Testing custom trigger...');
        await EventBus.emit('workflow.trigger.custom', customTriggerEvent);
        console.log('✅ Custom trigger test completed');
    }

    // Debug trigger conditions
    async debugTriggerConditions(templateId: string): Promise<void> {
        const testDocument = {
            id: 'debug_doc_001',
            type: 'employee_onboarding',
            employeeId: 'debug_emp_001',
            metadata: {
                department: 'engineering',
                priority: 'high'
            }
        };

        const testUser = {
            id: 'debug_user_001',
            department: 'hr'
        };

        const result = await this.triggerService.testTriggerConditions(
            templateId,
            testDocument,
            testUser,
            'document.employee_onboarding.created'
        );

        console.log('🔍 Trigger condition test result:', result);

        if (result) {
            console.log('✅ Conditions met - workflow would trigger');
        } else {
            console.log('❌ Conditions not met - workflow would not trigger');
        }
    }
}

// 📋 EXAMPLE WORKFLOW TEMPLATE RECORDS
export const ExampleTemplateRecords = {
    // What goes in your workflow_template table
    employeeOnboardingTemplate: {
        id: 'emp_onboarding_v1',
        name: 'Employee Onboarding Process',
        description: 'Complete employee onboarding workflow with approvals and delays',
        version: '1.0',
        is_active: true,
        priority: 100,
        // 🔧 CRITICAL: This DSL format is what TriggerService expects
        dsl: JSON.stringify(WorkflowTemplateDSLExamples.employeeOnboardingDSL),
        // 🔧 CRITICAL: This triggers format is what TriggerService evaluates
        triggers: JSON.stringify([
            {
                events: ['document.employee_onboarding.created'],
                entityTypes: ['employee_onboarding'],
                conditions: [
                    {
                        field: 'document.metadata.department',
                        operator: 'in',
                        value: ['engineering', 'sales', 'marketing']
                    },
                    {
                        field: 'user.department',
                        operator: 'equals',
                        value: 'hr'
                    }
                ],
                cooldownSeconds: 3600, // 1 hour between triggers for same template
                maxExecutions: 5 // Max 5 executions per template
            }
        ]),
        created_at: new Date(),
        updated_at: new Date()
    },

    contractProcessingTemplate: {
        id: 'contract_proc_v1',
        name: 'Contract Processing Workflow',
        description: 'Legal review and signature workflow for contracts',
        version: '1.0',
        is_active: true,
        priority: 90,
        dsl: JSON.stringify(WorkflowTemplateDSLExamples.contractWorkflowDSL),
        triggers: JSON.stringify([
            {
                events: ['document.contract.created', 'document.legal_document.created'],
                entityTypes: ['contract', 'legal_document'],
                conditions: [
                    {
                        field: 'document.metadata.value',
                        operator: 'greater_than',
                        value: 10000 // Only for contracts > $10k
                    }
                ],
                cooldownSeconds: 0, // No cooldown for contracts
                maxExecutions: null // No limit
            }
        ]),
        created_at: new Date(),
        updated_at: new Date()
    },

    // Follow-up workflow template
    postOnboardingFollowUp: {
        id: 'post_onboarding_v1',
        name: 'Post-Onboarding Follow-up',
        description: '30-day follow-up after onboarding completion',
        version: '1.0',
        is_active: true,
        priority: 50,
        dsl: JSON.stringify({
            name: 'Post-Onboarding Follow-up',
            version: '1.0',
            startStep: 'delay_30_days',
            steps: [
                {
                    id: 'delay_30_days',
                    type: 'delay',
                    name: 'Wait 30 Days',
                    config: {
                        delaySeconds: 2592000 // 30 days
                    },
                    nextSteps: ['follow_up_survey']
                },
                {
                    id: 'follow_up_survey',
                    type: 'notification',
                    name: 'Send Follow-up Survey',
                    config: {
                        recipients: ['{{data.document.employeeId}}', 'hr_team'],
                        subject: '30-Day Onboarding Follow-up',
                        message: 'How has your first month been? Please complete our follow-up survey.'
                    }
                }
            ]
        }),
        // 🔄 This triggers when onboarding workflow completes
        triggers: JSON.stringify([
            {
                events: ['workflow.emp_onboarding_v1.completed'],
                conditions: [
                    {
                        field: 'finalData.onboardingCompleted',
                        operator: 'equals',
                        value: true
                    }
                ]
            }
        ]),
        created_at: new Date(),
        updated_at: new Date()
    }
};

// 🎯 SETUP GUIDE
export class SetupGuide {
    /*
    📋 SETUP STEPS:

    1. DATABASE SETUP:
       - Insert example templates into workflow_template table
       - Templates must have proper DSL and triggers JSON

    2. MODULE INTEGRATION:
       - Add WorkflowOrchestrator to ZoiModule providers
       - Both services should be in the same module
       - EventBus handles communication between them

    3. TESTING:
       - Use IntegrationTesting class to test the flow
       - Emit document.lifecycle events to trigger workflows
       - Check logs for workflow.start emissions

    4. VERIFICATION:
       - TriggerService should log: "Emitting workflow.start"
       - Orchestrator should log: "Starting workflow"
       - Database should show new workflow_run records

    🔧 KEY INTEGRATION POINTS:
    - TriggerService listens: 'document.lifecycle'
    - TriggerService emits: 'workflow.start'
    - Orchestrator listens: 'workflow.start'
    - Orchestrator emits: 'workflow.completed'
    - TriggerService listens: 'workflow.completed' (for follow-ups)
    */

    // static async insertExampleTemplates(templateRepo: Repository<WorkflowTemplate>) {
    //     const templates = [
    //         ExampleTemplateRecords.employeeOnboardingTemplate,
    //         ExampleTemplateRecords.contractProcessingTemplate,
    //         ExampleTemplateRecords.postOnboardingFollowUp
    //     ];

    //     for (const templateData of templates) {
    //         const existing = await templateRepo.findOne({ where: { id: templateData.id } });
    //         if (!existing) {
    //             const template = templateRepo.create(templateData);
    //             await templateRepo.save(template);
    //             console.log(`✅ Inserted template: ${template.name}`);
    //         } else {
    //             console.log(`⏭️ Template already exists: ${templateData.name}`);
    //         }
    //     }
    // }
}

// 🔧 MODULE INTEGRATION EXAMPLE
/*
// src/zoi/zoi.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowTemplate } from './entity/workflow.template.entity';
import { WorkflowRun } from './entity/workflow.run.entity';
import { WorkflowLog } from './entity/workflow.log.entity';
import { ZoiWorkflowTriggerService } from './services/zoi-workflow-trigger.service';
import { WorkflowOrchestrator } from './services/workflow-orchestrator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkflowTemplate, WorkflowRun, WorkflowLog])
  ],
  providers: [
    ZoiWorkflowTriggerService,    // 🔍 The "Bouncer" - decides when to start
    WorkflowOrchestrator          // 🎭 The "Project Manager" - manages execution
  ],
  exports: [
    ZoiWorkflowTriggerService,
    WorkflowOrchestrator
  ]
})
export class ZoiModule {}
*/