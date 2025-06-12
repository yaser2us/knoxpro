// src/pulse/listeners/pulse-workflow.listener.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ModuleEventListener } from '../../core/interfaces/event-listener.interface';
import { EventBus } from '../../zoi/events/event-bus';

@Injectable()
export class PulseWorkflowListener implements ModuleEventListener, OnModuleInit {
    readonly moduleName = 'Pulse';
    private readonly logger = new Logger(PulseWorkflowListener.name);

    async onModuleInit() {
        await this.initialize();
    }

    async initialize(): Promise<void> {
        this.logger.log('🔧 [init] Initializing Pulse workflow listener...');
        
        try {
            EventBus.registerListener(this);
            this.logger.log('✅ [init] Pulse workflow listener registered successfully');
            
            // Debug: Log what events we're subscribing to
            const subscribedEvents = this.getSubscribedEvents();
            this.logger.log(`📋 [init] Subscribed to ${subscribedEvents.length} event patterns:`);
            subscribedEvents.forEach(event => {
                this.logger.log(`  📌 [init] ${event}`);
            });
            
            // Debug: Check EventBus registration
            this.logEventBusState();
            
        } catch (error) {
            this.logger.error('❌ [init] Failed to initialize Pulse listener:', error);
        }
    }

    getSubscribedEvents(): string[] {
        return [
            'document.employee_onboarding.*',
            'document.performance_review.*',
            'document.incident_report.*',
            'document.training_certificate.*',
            'document.policy_update.*',
            'workflow.pulse.*',
            'user.pulse.*',
            'document.lifecycle'  // Exact match for this one
        ];
    }

    async handleEvent(event: any): Promise<void> {
        const { type: eventType, payload } = event;

        this.logger.log(`📥 [listen] 🎯 PULSE LISTENER TRIGGERED! Processing: ${eventType}`);
        this.logger.log(`📋 [listen] Full event:`, JSON.stringify(event, null, 2));

        try {
            // Route to appropriate internal function based on event type
            if (eventType === 'document.school.created') {
                this.logger.log(`🎯 [listen] Handling document.lifecycle event`);
                await this.handleDocumentLifecycleEvent(event);
            } else if (eventType.includes('employee_onboarding')) {
                this.logger.log(`👨‍💼 [listen] Handling employee onboarding event: ${eventType}`);
                await this.handleOnboardingEvent(event);
            } else if (eventType.includes('performance_review')) {
                this.logger.log(`📊 [listen] Handling performance review event: ${eventType}`);
                await this.handlePerformanceReviewEvent(event);
            } else if (eventType.includes('incident_report')) {
                this.logger.log(`🚨 [listen] Handling incident report event: ${eventType}`);
                await this.handleIncidentEvent(event);
            } else if (eventType.includes('training_certificate')) {
                this.logger.log(`🎓 [listen] Handling training certificate event: ${eventType}`);
                await this.handleTrainingEvent(event);
            } else if (eventType.includes('policy_update')) {
                this.logger.log(`📜 [listen] Handling policy update event: ${eventType}`);
                await this.handlePolicyEvent(event);
            } else if (eventType.startsWith('workflow.pulse')) {
                this.logger.log(`🔄 [listen] Handling workflow event: ${eventType}`);
                await this.handleWorkflowEvent(event);
            } else if (eventType.startsWith('user.pulse')) {
                this.logger.log(`👤 [listen] Handling user event: ${eventType}`);
                await this.handleUserEvent(event);
            } else {
                this.logger.warn(`🤷 [listen] No specific handler for event type: ${eventType}`);
                this.logger.debug(`📋 [listen] Available patterns:`, this.getSubscribedEvents());
            }
        } catch (error) {
            this.logger.error(`❌ [listen] Error handling ${eventType}:`, error);
        }
    }

    // 🎯 Event handlers
    private async handleDocumentLifecycleEvent(event: any): Promise<void> {
        const { payload } = event;
        this.logger.log(`📄 [lifecycle] Processing document lifecycle event`);
        
        // Extract the actual document event from the nested payload
        if (payload && payload.type) {
            this.logger.log(`📄 [lifecycle] Inner event type: ${payload.type}`);
            
            // Route based on the inner event type
            const innerEventType = payload.type;
            if (innerEventType.includes('employee_onboarding')) {
                await this.handleOnboardingEvent(payload);
            } else if (innerEventType.includes('performance_review')) {
                await this.handlePerformanceReviewEvent(payload);
            } else if (innerEventType.includes('incident_report')) {
                await this.handleIncidentEvent(payload);
            }
            // ... other routing logic
        } else {
            this.logger.warn(`⚠️ [lifecycle] No inner event type found in payload`);
        }
    }

    private async handleOnboardingEvent(event: any): Promise<void> {
        this.logger.log(`👨‍💼 [onboarding] Processing onboarding event`);
        // Implementation for onboarding logic
    }

    private async handlePerformanceReviewEvent(event: any): Promise<void> {
        this.logger.log(`📊 [performance] Processing performance review event`);
        // Implementation for performance review logic
    }

    private async handleIncidentEvent(event: any): Promise<void> {
        this.logger.log(`🚨 [incident] Processing incident event`);
        // Implementation for incident logic
    }

    private async handleTrainingEvent(event: any): Promise<void> {
        this.logger.log(`🎓 [training] Processing training event`);
        // Implementation for training logic
    }

    private async handlePolicyEvent(event: any): Promise<void> {
        this.logger.log(`📜 [policy] Processing policy event`);
        // Implementation for policy logic
    }

    private async handleWorkflowEvent(event: any): Promise<void> {
        this.logger.log(`🔄 [workflow] Processing workflow event`);
        // Implementation for workflow logic
    }

    private async handleUserEvent(event: any): Promise<void> {
        this.logger.log(`👤 [user] Processing user event`);
        // Implementation for user logic
    }

    // 🔍 Debug helper methods
    private logEventBusState(): void {
        try {
            const registeredListeners = EventBus.getRegisteredListeners();
            this.logger.log(`🔍 [debug] EventBus state:`);
            this.logger.log(`🔍 [debug] Total event types registered: ${registeredListeners.size}`);
            
            registeredListeners.forEach((listeners, eventType) => {
                this.logger.log(`🔍 [debug] ${eventType} → [${listeners.join(', ')}]`);
            });
        } catch (error) {
            this.logger.error('❌ [debug] Error getting EventBus state:', error);
        }
    }

    // 🧪 Test method to verify listener is working
    async testListener(): Promise<void> {
        this.logger.log('🧪 [test] Testing Pulse listener...');
        
        const testEvent = {
            id: 'test_pulse_001',
            type: 'document.lifecycle',
            timestamp: new Date().toISOString(),
            source: 'pulse-test',
            payload: {
                type: 'document.employee_onboarding.created',
                payload: {
                    document: {
                        id: 'test_doc_123',
                        type: 'employee_onboarding',
                        title: 'Test Onboarding'
                    },
                    user: {
                        id: 'test_user_456'
                    }
                }
            }
        };

        this.logger.log('🧪 [test] Emitting test event...');
        await EventBus.emit('document.lifecycle', testEvent);
    }
}
// // src/pulse/listeners/pulse-workflow.listener.ts
// import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
// import { ModuleEventListener } from '../../core/interfaces/event-listener.interface';
// import { EventBus } from '../../zoi/events/event-bus';
// // import { PulseWorkflowService } from '../services/pulse-workflow.service';

// @Injectable()
// export class PulseWorkflowListener implements ModuleEventListener, OnModuleInit {
//     readonly moduleName = 'Pulse';
//     private readonly logger = new Logger(PulseWorkflowListener.name);

//     async onModuleInit() {
//         await this.initialize();
//     }

//     async initialize(): Promise<void> {
//         EventBus.registerListener(this);
//         this.logger.log('🎯 Pulse workflow listener initialized');
//     }

//     getSubscribedEvents(): string[] {
//         return [
//             'document.employee_onboarding.*',
//             'document.performance_review.*',
//             'document.incident_report.*',
//             'document.training_certificate.*',
//             'document.policy_update.*',
//             'workflow.pulse.*',
//             'user.pulse.*',
//             'document.lifecycle'
//         ];
//     }

//     async handleEvent(event: any): Promise<void> {
//         const { type: eventType, payload } = event;

//         this.logger.debug(`📥 [listen] Pulse listener processing: ${eventType}`);

//         try {
//             // Route to appropriate internal function based on event type
//             if (eventType.includes('document.lifecycle')) {
//                 this.logger.debug(`🤷 [listen] hihi for event type: ${eventType}`);
//             } else {
//                 this.logger.debug(`🤷 [listen] No handler for event type: ${eventType}`);
//             }
//         } catch (error) {
//             this.logger.error(`❌ [listen] Error handling ${eventType}:`, error);
//         }
//     }
// }