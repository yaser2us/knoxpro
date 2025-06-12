// // src/zoi/events/event-replay.service.ts
// import { Injectable } from '@nestjs/common';
// import { EventBus, EventPayload } from './event-bus';

// @Injectable()
// export class EventReplayService {
//   constructor(private eventBus: EventBus) {}

//   async replayEvents(fromTimestamp: string, toTimestamp?: string, eventPattern?: string) {
//     const history = this.eventBus.getEventHistory(eventPattern);
    
//     const eventsToReplay = history.filter(event => {
//       const eventTime = new Date(event.timestamp);
//       const fromTime = new Date(fromTimestamp);
//       const toTime = toTimestamp ? new Date(toTimestamp) : new Date();
      
//       return eventTime >= fromTime && eventTime <= toTime;
//     });

//     console.log(`🔄 Replaying ${eventsToReplay.length} events from ${fromTimestamp}`);

//     for (const event of eventsToReplay) {
//       // Re-emit with replay flag
//       const replayEvent = {
//         ...event,
//         id: `replay_${event.id}`,
//         metadata: {
//           ...event.metadata,
//           isReplay: true,
//           originalEventId: event.id,
//           replayedAt: new Date().toISOString()
//         }
//       };

//       EventBus.emit(event.type, replayEvent.payload);
      
//       // Small delay to prevent overwhelming
//       await new Promise(resolve => setTimeout(resolve, 10));
//     }

//     console.log(`✅ Replay completed: ${eventsToReplay.length} events`);
//   }

//   async replayWorkflow(workflowRunId: string, fromStepIndex: number = 0) {
//     const workflowEvents = this.eventBus.getEventHistory('workflow.*')
//       .filter(event => 
//         event.payload.workflowRunId === workflowRunId ||
//         event.payload.workflowRun?.id === workflowRunId
//       )
//       .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

//     const relevantEvents = workflowEvents.filter(event => {
//       if (event.type.includes('.step.')) {
//         const stepIndex = event.payload.stepIndex;
//         return stepIndex >= fromStepIndex;
//       }
//       return true;
//     });

//     console.log(`🔄 Replaying workflow ${workflowRunId} from step ${fromStepIndex}`);
    
//     for (const event of relevantEvents) {
//       EventBus.emit(event.type, event.payload);
//       await new Promise(resolve => setTimeout(resolve, 100)); // Slower for workflow steps
//     }
//   }
// }