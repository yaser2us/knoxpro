// src/zoi/events/event-monitoring.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from './event-bus';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EventMonitoringService {
  private logger = new Logger('EventMonitoring');
  private eventCounts = new Map<string, number>();
  private errorCounts = new Map<string, number>();

  constructor(private eventBus: EventBus) {
    // Monitor all events
    EventBus.on('**', this.trackEvent.bind(this));
    EventBus.on('event.handler.error', this.trackError.bind(this));
  }

  private trackEvent(event: any) {
    const eventType = event.type;
    this.eventCounts.set(eventType, (this.eventCounts.get(eventType) || 0) + 1);
  }

  private trackError(event: any) {
    const eventType = event.payload.originalEvent.type;
    this.errorCounts.set(eventType, (this.errorCounts.get(eventType) || 0) + 1);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  logEventStats() {
    if (this.eventCounts.size === 0) return;

    const stats = Array.from(this.eventCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    this.logger.log(`📊 Top events (last minute): ${JSON.stringify(Object.fromEntries(stats))}`);
    
    if (this.errorCounts.size > 0) {
      this.logger.warn(`❌ Errors: ${JSON.stringify(Object.fromEntries(this.errorCounts.entries()))}`);
    }

    // Reset counters
    this.eventCounts.clear();
    this.errorCounts.clear();
  }

  getEventHistory(eventType?: string) {
    return EventBus.getEventHistory(eventType);
  }

  getEventTypes() {
    return EventBus.getAllEventTypes();
  }
}



// 🎯 Usage example with decorators
// @EventService()
// export class ExampleEventConsumer {
//   @EventHandler('document.lifecycle')
//   handleDocumentEvent(event: any) {
//     console.log('📄 Document event received:', event.type);
//   }

//   @EventHandler('workflow.step.*')
//   handleWorkflowStep(event: any) {
//     console.log('📋 Workflow step:', event.type);
//   }

//   @EventHandler('workflow.step.*.response.*')
//   handleStepResponse(event: any) {
//     console.log('📬 Step response:', event.type);
//   }
// }