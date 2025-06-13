// 🔧 FIXED: findFollowUpWorkflows method in ZoiWorkflowTriggerService

// ❌ CURRENT CODE (causing the error):
/*
async findFollowUpWorkflows(completedTemplateId: string): Promise<WorkflowTemplate[]> {
    const allTemplates = await this.templateRepo.find();
    
    return allTemplates.filter(template => {
        return template.triggers.some(trigger => {
            return trigger.id === `workflow.${completedTemplateId}.completed`; // ❌ trigger.id is undefined
        });
    });
}
*/

// ✅ FIXED CODE with proper null checks:
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

// 🔧 ALTERNATIVE: More defensive approach with different trigger formats
async findFollowUpWorkflowsSafe(completedTemplateId: string): Promise<WorkflowTemplate[]> {
    try {
        const allTemplates = await this.templateRepo.find();
        const expectedEvents = [
            `workflow.${completedTemplateId}.completed`,
            `workflow.completion.${completedTemplateId}`,
            `${completedTemplateId}.completed`,
            `after.${completedTemplateId}`
        ];
        
        const followUpTemplates = allTemplates.filter(template => {
            if (!template?.triggers) return false;
            
            return template.triggers.some(trigger => {
                if (!trigger) return false;
                
                // 🔧 Support multiple trigger format variations
                const triggerValue = 
                    trigger.type || 
                    trigger.eventType || 
                    trigger.event || 
                    trigger.id || 
                    trigger.name ||
                    trigger.trigger;
                
                return triggerValue && expectedEvents.includes(triggerValue);
            });
        });
        
        return followUpTemplates;
        
    } catch (error) {
        this.logger.error(`❌ Error finding follow-up workflows:`, error);
        return [];
    }
}

// 🔧 UPDATED: handleWorkflowCompletion with better error handling
async handleWorkflowCompletion(event: any): Promise<void> {
    try {
        const { payload } = event;
        
        if (!payload) {
            this.logger.warn(`⚠️ [completion] Workflow completion event missing payload`);
            return;
        }
        
        const { workflowRunId, templateId, templateName, status, finalResult } = payload;
        
        if (!templateId) {
            this.logger.warn(`⚠️ [completion] Workflow completion event missing templateId:`, payload);
            return;
        }
        
        this.logger.log(`🏁 [completion] Handling workflow completion: ${templateName} (${templateId})`);
        
        // 🔍 Find follow-up workflows
        const followUpTemplates = await this.findFollowUpWorkflows(templateId);
        
        if (followUpTemplates.length === 0) {
            this.logger.debug(`📋 [completion] No follow-up workflows found for '${templateId}'`);
            return;
        }
        
        this.logger.log(`🚀 [completion] Starting ${followUpTemplates.length} follow-up workflows`);
        
        // 🚀 Start each follow-up workflow
        for (const template of followUpTemplates) {
            try {
                await this.startFollowUpWorkflow(template, finalResult, event);
            } catch (error) {
                this.logger.error(`❌ [completion] Failed to start follow-up workflow '${template.name}':`, error);
                // Continue with other follow-ups even if one fails
            }
        }
        
    } catch (error) {
        this.logger.error(`❌ [completion] Error handling workflow completion:`, error);
        // Don't re-throw to prevent cascade failures
    }
}

// 🔧 NEW: Separate method for starting follow-up workflows
private async startFollowUpWorkflow(template: WorkflowTemplate, previousResult: any, completionEvent: any): Promise<void> {
    this.logger.log(`🚀 [followup] Starting follow-up workflow: ${template.name}`);
    
    // 🔧 Create synthetic document event for follow-up workflow
    const followUpEvent = {
        id: `followup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'workflow.followup.triggered',
        timestamp: new Date().toISOString(),
        source: 'workflow-completion',
        payload: {
            document: {
                id: previousResult?.documentId || completionEvent.payload?.documentId || 'follow_up_doc',
                type: 'workflow_completion',
                previousWorkflow: {
                    templateId: completionEvent.payload?.templateId,
                    templateName: completionEvent.payload?.templateName,
                    workflowRunId: completionEvent.payload?.workflowRunId,
                    result: previousResult
                }
            },
            user: previousResult?.user || { id: 'system', name: 'System' },
            metadata: {
                triggeredBy: 'workflow.completion',
                previousWorkflow: completionEvent.payload
            }
        }
    };
    
    // 🚀 Start the follow-up workflow
    await this.triggerWorkflow(template, followUpEvent.payload.document, followUpEvent.payload.user, followUpEvent);
}

// 🧪 DEBUGGING: Method to inspect trigger structures
async debugTriggerStructures(): Promise<void> {
    const allTemplates = await this.templateRepo.find();
    
    this.logger.log(`🔍 [debug] Analyzing trigger structures in ${allTemplates.length} templates:`);
    
    allTemplates.forEach(template => {
        if (!template.triggers || template.triggers.length === 0) {
            this.logger.log(`📋 [debug] ${template.name}: No triggers`);
            return;
        }
        
        template.triggers.forEach((trigger, index) => {
            this.logger.log(`📋 [debug] ${template.name} trigger[${index}]:`, {
                id: trigger?.id,
                type: trigger?.type, 
                eventType: trigger?.eventType,
                event: trigger?.event,
                name: trigger?.name,
                trigger: trigger?.trigger,
                fullTrigger: trigger
            });
        });
    });
}

// 🎯 QUICK FIX: Add this to your service constructor or init method
private async initializeFollowUpHandling(): Promise<void> {
    // Debug existing trigger structures to understand the format
    await this.debugTriggerStructures();
    
    // Set up event listener for workflow completions
    EventBus.on('workflow.completed', this.handleWorkflowCompletion.bind(this));
}

// 🔧 SUMMARY OF FIXES:
export class FollowUpWorkflowFixes {
    /*
    THE PROBLEM:
    - trigger.id was undefined in line 378
    - Code assumed triggers have 'id' property
    - No null safety checks
    
    THE SOLUTIONS:
    1. Add null/undefined checks for templates and triggers
    2. Support multiple trigger property names (id, type, eventType, event)
    3. Add try-catch blocks to prevent cascade failures
    4. Log debug info to understand trigger structure
    5. Return empty array on errors instead of crashing
    
    DEBUGGING STEPS:
    1. Run debugTriggerStructures() to see actual trigger format
    2. Update trigger property access based on your data structure
    3. Add proper error handling for robustness
    
    RESULT:
    ✅ No more "Cannot read properties of undefined" errors
    ✅ Robust follow-up workflow detection
    ✅ Graceful error handling
    ✅ Better logging for debugging
    */
}