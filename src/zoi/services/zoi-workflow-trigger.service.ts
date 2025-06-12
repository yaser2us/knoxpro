// src/zoi/services/zoi-workflow-trigger.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowTemplate } from '../entity/workflow.template.entity';
import { WorkflowRun } from '../entity/workflow.run.entity';
import { WorkflowLog } from '../entity/workflow.log.entity';
import { EventBus } from '../events/event-bus';

// export interface TriggerCondition {
//     field: string;
//     operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists' | 'in' | 'not_in' | 'regex';
//     value: any;
// }

// export interface WorkflowTrigger {
//     events: string[];
//     entityTypes?: string[];
//     conditions?: TriggerCondition[];
//     cooldownSeconds?: number;
//     maxExecutions?: number;
//     priority?: number;
// }

// Fixed version of the ZoiWorkflowTriggerService
// Key changes marked with 🔧 FIX comments

export interface TriggerCondition {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists' | 'in' | 'not_in' | 'regex';
    value: any;
}

// 🔧 FIX: Updated interface to handle both formats
export interface WorkflowTrigger {
    // Support both singular and plural event formats
    events?: string[];
    event?: string;
    entityTypes?: string[];
    conditions?: TriggerCondition[];
    cooldownSeconds?: number;
    maxExecutions?: number;
    priority?: number;
}

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
        // 🔄 Listen for document lifecycle events
        EventBus.on('document.lifecycle', this.handleDocumentEvent.bind(this));

        // 🔄 Listen for custom trigger events
        EventBus.on('workflow.trigger.custom', this.handleCustomTrigger.bind(this));

        // 🔄 Listen for workflow completion to handle follow-up workflows
        EventBus.on('workflow.completed', this.handleWorkflowCompletion.bind(this));

        // 🔄 Initialize trigger cache
        this.refreshTriggerCache();

        this.logger.log('🎯 ZoiWorkflowTriggerService initialized and listening for events');
    }

    async handleDocumentEvent(event: any) {
        const startTime = Date.now();
        const { type: eventType, payload } = event;
        const { payload: { document, user, metadata, method } } = payload;

        console.log(`📥 hehehehe`, document, metadata, event, payload, method )

        this.logger.debug(`📥 Processing document event: ${eventType} for document ${document?.id}`);

        try {
            if (!document?.id) {
                this.logger.warn('⚠️ Document event missing document.id, skipping');
                return;
            }

            // 🔍 Find matching workflow templates
            const matchingTemplates = await this.findMatchingTemplates(eventType, document, user);

            if (matchingTemplates.length === 0) {
                this.logger.debug(`ℹ️ No matching workflows found for ${eventType} on ${document.type}:${document.id}`);
                return;
            }

            // 📋 Sort by priority (higher priority first)
            const sortedTemplates = matchingTemplates.sort((a, b) => (b.priority || 0) - (a.priority || 0));

            // 🚀 Process each matching template
            for (const template of sortedTemplates) {
                await this.processTrigger(template, document, user, event);
            }

            const processingTime = Date.now() - startTime;
            this.logger.debug(`⚡ Processed ${matchingTemplates.length} triggers in ${processingTime}ms`);

        } catch (error) {
            this.logger.error(`❌ Error handling document event ${eventType}:`, error);

            // 📝 Log the error for debugging
            await this.logTriggerEvent('trigger_error', {
                eventType,
                documentId: document?.id,
                error: error.message,
                stack: error.stack
            });
        }
    }

    async handleCustomTrigger(event: any) {
        const { templateId, documentId, context, user } = event.payload;

        this.logger.log(`🎯 Processing custom trigger for template ${templateId}`);

        try {
            const template = await this.templateRepo.findOne({
                where: { id: templateId, is_active: true }
            });

            if (!template) {
                this.logger.warn(`⚠️ Template ${templateId} not found or inactive`);
                return;
            }

            // Get document (you might need to fetch from your document service)
            const document = { id: documentId }; // Simplified - you'd fetch full document

            await this.startWorkflow(template, document, user, {
                customTrigger: true,
                originalEvent: event,
                context
            });

        } catch (error) {
            this.logger.error(`❌ Error handling custom trigger:`, error);
        }
    }

    async handleWorkflowCompletion(event: any) {
        const { workflowRun } = event.payload;

        this.logger.debug(`✅ Workflow completed: ${workflowRun.id}`);

        // 🔄 Check for follow-up workflows
        const followUpTemplates = await this.findFollowUpWorkflows(workflowRun);

        for (const template of followUpTemplates) {
            await this.processTrigger(template, { id: workflowRun.document_id }, null, event);
        }
    }

    private async findMatchingTemplates(eventType: string, document: any, user: any): Promise<WorkflowTemplate[]> {
        // 🚀 Use cache for performance
        const cacheKey = `${eventType}_${document.type || 'unknown'}`;
        let templates = this.triggerCache.get(cacheKey);

        if (!templates) {
            // 🔍 Query database and cache results
            templates = await this.templateRepo.find({
                where: { is_active: true }
            });
            this.triggerCache.set(cacheKey, templates);
        }

        const matchingTemplates: WorkflowTemplate[] = [];

        for (const template of templates) {
            if (await this.shouldTriggerWorkflow(template, eventType, document, user)) {
                matchingTemplates.push(template);
            }
        }

        return matchingTemplates;
    }

    // private async shouldTriggerWorkflow(
    //     template: WorkflowTemplate,
    //     eventType: string,
    //     document: any,
    //     user: any
    // ): Promise<boolean> {
    //     try {
    //         const triggers = this.parseTriggers(template.triggers);

    //         for (const trigger of triggers) {
    //             console.log('🔍 trigger of triggers', trigger, triggers)
    //             // ✅ Check event type match
    //             if (!this.matchesEventType(eventType, trigger.events)) {
    //                 continue;
    //             }

    //             // ✅ Check entity type match (if specified)
    //             if (trigger.entityTypes && !trigger.entityTypes.includes(document.type)) {
    //                 continue;
    //             }

    //             // ✅ Check conditions
    //             if (!this.evaluateConditions(trigger.conditions, document, user)) {
    //                 continue;
    //             }

    //             // ✅ Check cooldown
    //             if (!this.checkCooldown(template.id, trigger.cooldownSeconds)) {
    //                 this.logger.debug(`⏰ Template ${template.name} in cooldown period`);
    //                 continue;
    //             }

    //             // ✅ Check execution limits
    //             if (!this.checkExecutionLimit(template.id, trigger.maxExecutions)) {
    //                 this.logger.debug(`🚫 Template ${template.name} exceeded max executions`);
    //                 continue;
    //             }

    //             // ✅ Check for duplicate running workflows
    //             if (await this.hasDuplicateRunningWorkflow(template.id, document.id)) {
    //                 this.logger.debug(`🔄 Template ${template.name} already running for document ${document.id}`);
    //                 continue;
    //             }

    //             return true;
    //         }

    //         return false;

    //     } catch (error) {
    //         console.log(`❌ Error evaluating workflow trigger for '${template.name}':`, error);
    //         this.logger.error(`❌ Error evaluating workflow trigger for '${template.name}':`, error);
    //         return false;
    //     }
    // }

    // private parseTriggers(triggers: any): WorkflowTrigger[] {
    //     if (!triggers) return [];

    //     if (Array.isArray(triggers)) {
    //         return triggers;
    //     }

    //     if (typeof triggers === 'string') {
    //         try {
    //             return JSON.parse(triggers);
    //         } catch {
    //             return [];
    //         }
    //     }

    //     return [triggers];
    // }

    // private matchesEventType(eventType: string, allowedEvents: string[]): boolean {
    //     console.log(`🔍 matchesEventType`,eventType, allowedEvents) 
    //     return allowedEvents.some(pattern => {
    //         if (pattern.includes('*')) {
    //             const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    //             return regex.test(eventType);
    //         }
    //         return pattern === eventType;
    //     });
    // }

    // private evaluateConditions(conditions: TriggerCondition[] = [], document: any, user: any): boolean {
    //     if (!conditions || conditions.length === 0) return true;

    //     const context = { document, user };

    //     return conditions.every(condition => {
    //         const fieldValue = this.getFieldValue(context, condition.field);
    //         return this.evaluateCondition(condition, fieldValue);
    //     });
    // }

    private getFieldValue(context: any, fieldPath: string): any {
        return fieldPath.split('.').reduce((obj, key) => obj?.[key], context);
    }

    private evaluateCondition(condition: TriggerCondition, fieldValue: any): boolean {
        const { operator, value } = condition;

        switch (operator) {
            case 'equals':
                return fieldValue === value;

            case 'not_equals':
                return fieldValue !== value;

            case 'contains':
                return String(fieldValue || '').includes(String(value));

            case 'not_contains':
                return !String(fieldValue || '').includes(String(value));

            case 'greater_than':
                return Number(fieldValue) > Number(value);

            case 'less_than':
                return Number(fieldValue) < Number(value);

            case 'exists':
                return fieldValue !== undefined && fieldValue !== null;

            case 'not_exists':
                return fieldValue === undefined || fieldValue === null;

            case 'in':
                return Array.isArray(value) && value.includes(fieldValue);

            case 'not_in':
                return Array.isArray(value) && !value.includes(fieldValue);

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

    private async processTrigger(
        template: WorkflowTemplate,
        document: any,
        user: any,
        originalEvent: any
    ): Promise<void> {
        try {
            this.logger.log(`🚀 Triggering workflow '${template.name}' for document ${document.id}`);

            // 📊 Update execution tracking
            this.updateExecutionTracking(template.id);

            // 📝 Log trigger event
            await this.logTriggerEvent('workflow_triggered', {
                templateId: template.id,
                templateName: template.name,
                documentId: document.id,
                documentType: document.type,
                eventType: originalEvent.type,
                userId: user?.id
            });

            // 🎯 Start the workflow
            await this.startWorkflow(template, document, user, {
                trigger: originalEvent,
                triggeredAt: new Date().toISOString(),
                triggerService: 'ZoiWorkflowTriggerService'
            });

        } catch (error) {
            this.logger.error(`❌ Error processing trigger for '${template.name}':`, error);

            await this.logTriggerEvent('trigger_failed', {
                templateId: template.id,
                templateName: template.name,
                documentId: document.id,
                error: error.message
            });
        }
    }

    private async startWorkflow(
        template: WorkflowTemplate,
        document: any,
        user: any,
        context: any
    ): Promise<void> {
        const workflowStartEvent = {
            id: this.generateEventId(),
            type: 'workflow.start',
            timestamp: new Date().toISOString(),
            source: 'zoi-workflow-trigger-service',
            payload: {
                template,
                document,
                user,
                context
            }
        };

        // 🚀 Emit workflow start event
        EventBus.emit('workflow.start', workflowStartEvent);

        this.logger.log(`✅ Workflow start event emitted for '${template.name}' on document ${document.id}`);
    }

    // private async findFollowUpWorkflows(completedWorkflowRun: any): Promise<WorkflowTemplate[]> {
    //     // 🔍 Find templates that trigger on workflow completion
    //     const followUpTemplates = await this.templateRepo.find({
    //         where: { is_active: true }
    //     });

    //     return followUpTemplates.filter(template => {
    //         const triggers = this.parseTriggers(template.triggers);
    //         return triggers.some(trigger =>
    //             trigger.events.includes('workflow.completed') ||
    //             trigger.events.includes(`workflow.${completedWorkflowRun.template.id}.completed`)
    //         );
    //     });
    // }

    private updateExecutionTracking(templateId: string): void {
        // Update execution count
        const currentCount = this.executionCounts.get(templateId) || 0;
        this.executionCounts.set(templateId, currentCount + 1);

        // Update last execution time
        this.lastExecutionTimes.set(templateId, new Date());
    }

    private async logTriggerEvent(type: 'triggered' | 'workflow_triggered' | 'trigger_error' | 'resumed' | 'failed' | 'skipped' | 'completed' | 'manual_edit' | 'trigger_failed', metadata: any): Promise<void> {
        try {
            await this.logRepo.save({
                workflow_run_id: null, // This is a trigger event, not tied to a specific run
                type,
                message: `Trigger ${type}`,
                metadata,
                actor_user_id: metadata.userId || null,
                actor_workspace_id: metadata.workspaceId || null,
                step_index: null
            });
        } catch (error) {
            this.logger.error('❌ Failed to log trigger event:', error);
        }
    }

    // 🔄 Public methods for external use

    async refreshTriggerCache(): Promise<void> {
        this.logger.log('🔄 Refreshing workflow trigger cache...');
        this.triggerCache.clear();

        const templates = await this.templateRepo.find({
            where: { is_active: true }
        });

        this.logger.log(`📋 Loaded ${templates.length} active workflow templates`);
    }

    async triggerWorkflowManually(templateId: string, documentId: string, context?: any): Promise<void> {
        EventBus.emit('workflow.trigger.custom', {
            payload: {
                templateId,
                documentId,
                context,
                user: null,
                manual: true
            }
        });
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

    async resetExecutionStats(): Promise<void> {
        this.executionCounts.clear();
        this.lastExecutionTimes.clear();
        this.logger.log('🧹 Execution stats reset');
    }

    // 🔍 Testing and debugging methods

    // async testTriggerConditions(
    //     templateId: string,
    //     mockDocument: any,
    //     mockUser?: any,
    //     eventType = 'document.test.created'
    // ): Promise<{
    //     shouldTrigger: boolean;
    //     evaluationDetails: any[];
    // }> {
    //     const template = await this.templateRepo.findOne({
    //         where: { id: templateId }
    //     });

    //     if (!template) {
    //         throw new Error(`Template ${templateId} not found`);
    //     }

    //     const triggers = this.parseTriggers(template.triggers);
    //     const evaluationDetails: any[] = [];

    //     for (const trigger of triggers) {
    //         const eventMatch = this.matchesEventType(eventType, trigger.events);
    //         const conditionsMatch = this.evaluateConditions(trigger.conditions, mockDocument, mockUser);

    //         evaluationDetails.push({
    //             trigger,
    //             eventMatch,
    //             conditionsMatch,
    //             result: eventMatch && conditionsMatch
    //         });
    //     }

    //     const shouldTrigger = evaluationDetails.some(detail => detail.result);

    //     return { shouldTrigger, evaluationDetails };
    // }

    private generateEventId(): string {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // src/zoi/services/zoi-workflow-trigger.service.ts (Improved debugging version)

    // Add this method to your existing ZoiWorkflowTriggerService class:
    async handleDocumentEventV1(event: any) {
        const startTime = Date.now();

        // 🔍 Enhanced debugging for the event structure
        this.logger.debug(`📥 Raw document event received:`, JSON.stringify(event, null, 2));

        const { type: eventType, payload } = event || {};

        if (!payload) {
            this.logger.warn('⚠️ Document event missing payload entirely', { event });
            return;
        }

        const { document, user, metadata } = payload;

        // 🔍 Detailed logging of what we received
        this.logger.debug(`📋 Event breakdown:`, {
            eventType,
            hasPayload: !!payload,
            hasDocument: !!document,
            documentId: document?.id,
            documentType: document?.type,
            documentKeys: document ? Object.keys(document) : 'no document',
            hasUser: !!user,
            userId: user?.id,
            hasMetadata: !!metadata
        });

        try {
            // 🔍 More specific error messages
            if (!document) {
                this.logger.warn('⚠️ Document event payload missing document object', {
                    eventType,
                    payloadKeys: Object.keys(payload || {}),
                    payload
                });
                return;
            }

            if (!document.id) {
                this.logger.warn('⚠️ Document object missing id field', {
                    eventType,
                    document,
                    documentKeys: Object.keys(document),
                    documentStringified: JSON.stringify(document)
                });
                return;
            }

            // 🎯 Continue with the rest of your existing logic...
            this.logger.debug(`📥 Processing document event: ${eventType} for document ${document.id}`);

            // 🔍 Find matching workflow templates
            const matchingTemplates = await this.findMatchingTemplates(eventType, document, user);

            if (matchingTemplates.length === 0) {
                this.logger.debug(`ℹ️ No matching workflows found for ${eventType} on ${document.type}:${document.id}`);
                return;
            }

            this.logger.log(`🎯 Found ${matchingTemplates.length} matching templates for ${eventType} on ${document.type}:${document.id}`);

            // ... rest of your existing logic

        } catch (error) {
            this.logger.error(`❌ Error handling document event ${eventType}:`, {
                error: error.message,
                stack: error.stack,
                event,
                documentId: document?.id
            });

            // 📝 Log the error for debugging
            await this.logTriggerEvent('failed', {
                eventType,
                documentId: document?.id,
                error: error.message,
                errorStack: error.stack,
                fullEvent: event
            });
        }
    }

    // 🎯 Add this debugging method to your service class:
    async debugEventStructure(sampleEvent: any): Promise<void> {
        this.logger.log('🔍 Debugging event structure...');

        const analysis = {
            eventExists: !!sampleEvent,
            eventType: typeof sampleEvent,
            eventKeys: sampleEvent ? Object.keys(sampleEvent) : 'no event',

            hasType: !!sampleEvent?.type,
            eventTypeValue: sampleEvent?.type,

            hasPayload: !!sampleEvent?.payload,
            payloadType: typeof sampleEvent?.payload,
            payloadKeys: sampleEvent?.payload ? Object.keys(sampleEvent.payload) : 'no payload',

            hasDocument: !!sampleEvent?.payload?.document,
            documentType: typeof sampleEvent?.payload?.document,
            documentKeys: sampleEvent?.payload?.document ? Object.keys(sampleEvent.payload.document) : 'no document',

            documentId: sampleEvent?.payload?.document?.id,
            documentIdType: typeof sampleEvent?.payload?.document?.id,

            hasUser: !!sampleEvent?.payload?.user,
            userId: sampleEvent?.payload?.user?.id,

            fullEventJson: JSON.stringify(sampleEvent, null, 2)
        };

        this.logger.log('📊 Event Analysis:', analysis);

        // Test what would happen with this event
        if (sampleEvent) {
            try {
                await this.handleDocumentEvent(sampleEvent);
            } catch (error) {
                this.logger.error('❌ Test processing failed:', error);
            }
        }
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

    private async shouldTriggerWorkflow(
        template: WorkflowTemplate,
        eventType: string,
        document: any,
        user: any
    ): Promise<boolean> {
        try {
            const triggers = this.parseTriggers(template.triggers);
    
            for (const trigger of triggers) {
                console.log('🔍 trigger of triggers', trigger, triggers)
                
                // 🔧 FIX: Get events array, handling both formats
                const events = this.getEventsFromTrigger(trigger);
                
                // ✅ Check event type match
                if (!this.matchesEventType(eventType, events)) {
                    continue;
                }
    
                // ✅ Check entity type match (if specified)
                if (trigger.entityTypes && !trigger.entityTypes.includes(document.type)) {
                    continue;
                }
    
                // ✅ Check conditions
                if (!this.evaluateConditions(trigger.conditions, document, user)) {
                    continue;
                }
    
                // ✅ Check cooldown
                if (!this.checkCooldown(template.id, trigger.cooldownSeconds)) {
                    this.logger.debug(`⏰ Template ${template.name} in cooldown period`);
                    continue;
                }
    
                // ✅ Check execution limits
                if (!this.checkExecutionLimit(template.id, trigger.maxExecutions)) {
                    this.logger.debug(`🚫 Template ${template.name} exceeded max executions`);
                    continue;
                }
    
                // ✅ Check for duplicate running workflows
                if (await this.hasDuplicateRunningWorkflow(template.id, document.id)) {
                    this.logger.debug(`🔄 Template ${template.name} already running for document ${document.id}`);
                    continue;
                }
    
                return true;
            }
    
            return false;
    
        } catch (error) {
            console.log(`❌ Error evaluating workflow trigger for '${template.name}':`, error);
            this.logger.error(`❌ Error evaluating workflow trigger for '${template.name}':`, error);
            return false;
        }
    }
    
    // 🔧 FIX: New helper method to extract events from trigger
    private getEventsFromTrigger(trigger: WorkflowTrigger): string[] {
        // Handle plural events property
        if (trigger.events && Array.isArray(trigger.events)) {
            return trigger.events;
        }
        
        // Handle singular event property
        if (trigger.event && typeof trigger.event === 'string') {
            return [trigger.event];
        }
        
        // Fallback to empty array
        console.warn('⚠️ Trigger has no valid events property:', trigger);
        return [];
    }
    
    // 🔧 FIX: Updated matchesEventType to handle undefined/empty arrays
    private matchesEventType(eventType: string, allowedEvents: string[]): boolean {
        console.log(`🔍 matchesEventType`, eventType, allowedEvents);
        
        // 🔧 FIX: Guard against undefined or empty arrays
        if (!allowedEvents || !Array.isArray(allowedEvents) || allowedEvents.length === 0) {
            console.warn('⚠️ No allowed events found or invalid events array:', allowedEvents);
            return false;
        }
        
        return allowedEvents.some(pattern => {
            if (!pattern || typeof pattern !== 'string') {
                console.warn('⚠️ Invalid event pattern:', pattern);
                return false;
            }
            
            if (pattern.includes('*')) {
                const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
                return regex.test(eventType);
            }
            return pattern === eventType;
        });
    }
    
    // 🔧 FIX: Enhanced parseTriggers method to handle different formats
    private parseTriggers(triggers: any): WorkflowTrigger[] {
        if (!triggers) return [];
    
        let parsedTriggers: any[];
    
        if (Array.isArray(triggers)) {
            parsedTriggers = triggers;
        } else if (typeof triggers === 'string') {
            try {
                parsedTriggers = JSON.parse(triggers);
            } catch (error) {
                console.error('❌ Failed to parse triggers JSON:', error);
                return [];
            }
        } else {
            parsedTriggers = [triggers];
        }
    
        // 🔧 FIX: Normalize trigger format
        return parsedTriggers.map(trigger => this.normalizeTrigger(trigger));
    }
    
    // 🔧 FIX: New helper method to normalize trigger format
    private normalizeTrigger(trigger: any): WorkflowTrigger {
        const normalized: WorkflowTrigger = { ...trigger };
    
        // Convert singular 'event' to plural 'events'
        if (trigger.event && !trigger.events) {
            normalized.events = [trigger.event];
            delete normalized.event;
        }
    
        // Ensure events is always an array
        if (normalized.events && !Array.isArray(normalized.events)) {
            normalized.events = [normalized.events];
        }
    
        // Convert conditions object to array format if needed
        if (trigger.conditions && !Array.isArray(trigger.conditions)) {
            // Handle object format like {"document.name": "Ya ali"}
            const conditionsArray: TriggerCondition[] = [];
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
    
    // 🔧 FIX: Enhanced evaluateConditions to handle different formats
    private evaluateConditions(conditions: TriggerCondition[] = [], document: any, user: any): boolean {
        if (!conditions || conditions.length === 0) return true;
    
        const context = { document, user };
    
        return conditions.every(condition => {
            try {
                const fieldValue = this.getFieldValue(context, condition.field);
                const result = this.evaluateCondition(condition, fieldValue);
                
                console.log(`🔍 Condition evaluation:`, {
                    field: condition.field,
                    operator: condition.operator,
                    expectedValue: condition.value,
                    actualValue: fieldValue,
                    result
                });
                
                return result;
            } catch (error) {
                console.error(`❌ Error evaluating condition:`, condition, error);
                return false;
            }
        });
    }
    
    // 🔧 FIX: Enhanced debugging for follow-up workflows
    private async findFollowUpWorkflows(completedWorkflowRun: any): Promise<WorkflowTemplate[]> {
        const followUpTemplates = await this.templateRepo.find({
            where: { is_active: true }
        });
    
        return followUpTemplates.filter(template => {
            const triggers = this.parseTriggers(template.triggers);
            return triggers.some(trigger => {
                const events = this.getEventsFromTrigger(trigger);
                return events.includes('workflow.completed') ||
                       events.includes(`workflow.${completedWorkflowRun.template.id}.completed`);
            });
        });
    }
    
    // 🔧 FIX: Enhanced test method with better error handling
    async testTriggerConditions(
        templateId: string,
        mockDocument: any,
        mockUser?: any,
        eventType = 'document.test.created'
    ): Promise<{
        shouldTrigger: boolean;
        evaluationDetails: any[];
        errors?: string[];
    }> {
        const template = await this.templateRepo.findOne({
            where: { id: templateId }
        });
    
        if (!template) {
            throw new Error(`Template ${templateId} not found`);
        }
    
        const triggers = this.parseTriggers(template.triggers);
        const evaluationDetails: any[] = [];
        const errors: string[] = [];
    
        for (const trigger of triggers) {
            try {
                const events = this.getEventsFromTrigger(trigger);
                const eventMatch = this.matchesEventType(eventType, events);
                const conditionsMatch = this.evaluateConditions(trigger.conditions, mockDocument, mockUser);
    
                evaluationDetails.push({
                    trigger,
                    events,
                    eventMatch,
                    conditionsMatch,
                    result: eventMatch && conditionsMatch
                });
            } catch (error) {
                const errorMsg = `Error evaluating trigger: ${error.message}`;
                errors.push(errorMsg);
                console.error(errorMsg, trigger, error);
            }
        }
    
        const shouldTrigger = evaluationDetails.some(detail => detail.result);
    
        return { shouldTrigger, evaluationDetails, errors: errors.length > 0 ? errors : undefined };
    }
}

// 🎯 Extended Types for better type safety
export interface WorkflowTemplateWithTriggers {
    id: string;
    name: string;
    version: string;
    triggers: WorkflowTrigger[];
    dsl: any;
    is_active: boolean;
    created_by_user_id: string;
    created_at: Date;
    updated_at: Date;
    priority?: number; // Optional field not in base entity
}

export interface DocumentLifecycleEvent {
    id: string;
    type: string;
    timestamp: string;
    payload: {
        document: {
            id: string;
            type: string;
            [key: string]: any;
        };
        user?: {
            id: string;
            [key: string]: any;
        };
        metadata?: any;
    };
}

export interface WorkflowTriggerStats {
    templateId: string;
    templateName: string;
    executionCount: number;
    lastExecution?: Date;
    averageExecutionTime?: number;
    successRate?: number;
}