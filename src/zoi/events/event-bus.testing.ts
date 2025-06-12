// src/zoi/events/event-bus.testing.ts
import { EventBus } from './event-bus';

export interface CapturedEvent {
  id: string;
  type: string;
  timestamp: string;
  source?: string;
  payload: any;
  metadata?: any;
}

export interface EventTestAssertion {
  eventType?: string;
  documentId?: string;
  userId?: string;
  minCount?: number;
  maxCount?: number;
  timeoutMs?: number;
}

export class EventBusTestUtils {
  private static capturedEvents: CapturedEvent[] = [];
  private static isCapturing = false;
  private static captureHandler: ((event: CapturedEvent) => void) | null = null;
  private static captureStartTime: Date | null = null;

  /**
   * Start capturing all events emitted through EventBus
   */
  static startCapturing(): void {
    this.capturedEvents = [];
    this.isCapturing = true;
    this.captureStartTime = new Date();
    
    // Remove existing handler if any
    if (this.captureHandler) {
      EventBus.off('**', this.captureHandler);
    }

    // Create new capture handler
    this.captureHandler = (event: CapturedEvent) => {
      if (this.isCapturing) {
        this.capturedEvents.push({
          ...event,
          capturedAt: new Date().toISOString()
        } as any);
      }
    };

    EventBus.on('**', this.captureHandler);
    
    console.log('🎧 EventBus capture started');
  }

  /**
   * Stop capturing and return all captured events
   */
  static stopCapturing(): CapturedEvent[] {
    this.isCapturing = false;
    
    if (this.captureHandler) {
      EventBus.off('**', this.captureHandler);
      this.captureHandler = null;
    }

    const events = [...this.capturedEvents];
    const captureTime = this.captureStartTime ? Date.now() - this.captureStartTime.getTime() : 0;
    
    console.log(`🛑 EventBus capture stopped. Captured ${events.length} events in ${captureTime}ms`);
    
    return events;
  }

  /**
   * Get captured events with optional filtering
   */
  static getCapturedEvents(filter?: {
    eventType?: string;
    documentId?: string;
    userId?: string;
    since?: Date;
  }): CapturedEvent[] {
    let events = [...this.capturedEvents];

    if (filter?.eventType) {
      events = events.filter(event => 
        filter.eventType!.includes('*') 
          ? this.matchesPattern(event.type, filter.eventType!)
          : event.type === filter.eventType
      );
    }

    if (filter?.documentId) {
      events = events.filter(event => 
        event.payload?.document?.id === filter.documentId ||
        event.payload?.documentId === filter.documentId
      );
    }

    if (filter?.userId) {
      events = events.filter(event => 
        event.payload?.user?.id === filter.userId ||
        event.payload?.userId === filter.userId
      );
    }

    if (filter?.since) {
      events = events.filter(event => 
        new Date(event.timestamp) >= filter.since!
      );
    }

    return events;
  }

  /**
   * Clear all captured events
   */
  static clearCaptured(): void {
    this.capturedEvents = [];
    console.log('🧹 Cleared captured events');
  }

  /**
   * Wait for a specific event to be emitted
   */
  static async waitForEvent(
    eventType: string, 
    timeout = 5000,
    additionalChecks?: (event: CapturedEvent) => boolean
  ): Promise<CapturedEvent> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        EventBus.off(eventType, handler);
        reject(new Error(`Timeout waiting for event: ${eventType} (${timeout}ms)`));
      }, timeout);

      const handler = (event: CapturedEvent) => {
        if (additionalChecks && !additionalChecks(event)) {
          return; // Event doesn't match additional criteria
        }

        clearTimeout(timeoutId);
        EventBus.off(eventType, handler);
        resolve(event);
      };

      EventBus.once(eventType, handler);
    });
  }

  /**
   * Wait for multiple events matching a pattern
   */
  static async waitForEvents(
    eventPattern: string,
    count: number,
    timeout = 10000
  ): Promise<CapturedEvent[]> {
    const matchedEvents: CapturedEvent[] = [];

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        EventBus.off('**', handler);
        reject(new Error(`Timeout waiting for ${count} events matching ${eventPattern} (${timeout}ms). Got ${matchedEvents.length}`));
      }, timeout);

      const handler = (event: CapturedEvent) => {
        if (this.matchesPattern(event.type, eventPattern)) {
          matchedEvents.push(event);
          
          if (matchedEvents.length >= count) {
            clearTimeout(timeoutId);
            EventBus.off('**', handler);
            resolve(matchedEvents);
          }
        }
      };

      EventBus.on('**', handler);
    });
  }

  /**
   * Emit an event and wait for a response event
   */
  static async emitAndWaitForResponse(
    requestEvent: string, 
    requestPayload: any, 
    responseEvent: string,
    timeout = 5000
  ): Promise<CapturedEvent> {
    const responsePromise = this.waitForEvent(responseEvent, timeout);
    EventBus.emit(requestEvent, requestPayload);
    return responsePromise;
  }

  /**
   * Assert that specific events occurred
   */
  static assertEventsOccurred(assertions: EventTestAssertion[]): void {
    for (const assertion of assertions) {
      const matchingEvents = this.getCapturedEvents({
        eventType: assertion.eventType,
        documentId: assertion.documentId,
        userId: assertion.userId
      });

      if (assertion.minCount !== undefined && matchingEvents.length < assertion.minCount) {
        throw new Error(
          `Expected at least ${assertion.minCount} events of type '${assertion.eventType}', but got ${matchingEvents.length}`
        );
      }

      if (assertion.maxCount !== undefined && matchingEvents.length > assertion.maxCount) {
        throw new Error(
          `Expected at most ${assertion.maxCount} events of type '${assertion.eventType}', but got ${matchingEvents.length}`
        );
      }

      console.log(`✅ Assertion passed: ${assertion.eventType} (${matchingEvents.length} events)`);
    }
  }

  /**
   * Create a mock event for testing
   */
  static createMockEvent(type: string, payload: any): CapturedEvent {
    return {
      id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date().toISOString(),
      source: 'mock',
      payload,
      metadata: {
        isMock: true,
        createdAt: new Date().toISOString()
      }
    };
  }

  /**
   * Create a mock document lifecycle event
   */
  static createMockDocumentEvent(
    eventType: 'created' | 'updated' | 'deleted',
    document: any,
    user?: any
  ): CapturedEvent {
    return this.createMockEvent(`document.${document.type}.${eventType}`, {
      document,
      user: user || { id: 'mock-user' },
      method: eventType === 'created' ? 'POST' : 'PATCH',
      metadata: {
        source: 'mock-test',
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Create a mock workflow step event
   */
  static createMockStepEvent(action: string, workflowRunId: string, payload: any = {}): CapturedEvent {
    return this.createMockEvent(`workflow.step.${action}`, {
      workflowRunId,
      stepIndex: 0,
      step: { action },
      context: {},
      document: { id: 'mock-doc' },
      ...payload
    });
  }

  /**
   * Create a mock step response event
   */
  static createMockStepResponse(
    action: string, 
    stepId: string, 
    success = true, 
    shouldPause = false
  ): CapturedEvent {
    return this.createMockEvent(`workflow.step.${action}.response.${stepId}`, {
      workflowRunId: 'mock-workflow-run',
      stepResult: {
        success,
        shouldPause,
        updatedContext: { mockResponse: true },
        error: success ? null : 'Mock error'
      }
    });
  }

  /**
   * Run a complete workflow test scenario
   */
  static async testWorkflowScenario(scenario: {
    name: string;
    documentEvent: any;
    expectedSteps: string[];
    timeout?: number;
  }): Promise<{
    success: boolean;
    events: CapturedEvent[];
    errors: string[];
  }> {
    console.log(`🧪 Running workflow scenario: ${scenario.name}`);
    
    const errors: string[] = [];
    this.startCapturing();

    try {
      // Emit the document event
      EventBus.emit('document.lifecycle', scenario.documentEvent);

      // Wait for expected workflow steps
      const stepEvents = await this.waitForEvents(
        'workflow.step.*',
        scenario.expectedSteps.length,
        scenario.timeout || 10000
      );

      // Check if all expected steps occurred
      for (const expectedStep of scenario.expectedSteps) {
        const stepFound = stepEvents.some(event => 
          event.type.includes(expectedStep)
        );
        
        if (!stepFound) {
          errors.push(`Expected step '${expectedStep}' not found`);
        }
      }

      const allEvents = this.stopCapturing();
      
      return {
        success: errors.length === 0,
        events: allEvents,
        errors
      };

    } catch (error) {
      errors.push(error.message);
      this.stopCapturing();
      
      return {
        success: false,
        events: this.capturedEvents,
        errors
      };
    }
  }

  /**
   * Print captured events summary
   */
  static printEventSummary(): void {
    const events = this.capturedEvents;
    const eventTypes = [...new Set(events.map(e => e.type))];
    const eventCounts = eventTypes.map(type => ({
      type,
      count: events.filter(e => e.type === type).length
    }));

    console.log('\n📊 Event Summary:');
    console.log(`Total events: ${events.length}`);
    console.log('Event types:');
    eventCounts.forEach(({ type, count }) => {
      console.log(`  ${type}: ${count}`);
    });

    if (events.length > 0) {
      console.log(`\nTime range: ${events[0].timestamp} to ${events[events.length - 1].timestamp}`);
    }
  }

  /**
   * Export captured events to JSON
   */
  static exportEvents(): string {
    return JSON.stringify({
      metadata: {
        captureStartTime: this.captureStartTime?.toISOString(),
        captureEndTime: new Date().toISOString(),
        totalEvents: this.capturedEvents.length
      },
      events: this.capturedEvents
    }, null, 2);
  }

  /**
   * Check if an event pattern matches an event type
   */
  private static matchesPattern(eventType: string, pattern: string): boolean {
    // Convert wildcard pattern to regex
    const regexPattern = pattern
      .replace(/\./g, '\\.')  // Escape dots
      .replace(/\*/g, '[^.]*') // * matches anything except dots
      .replace(/\*\*/g, '.*'); // ** matches anything including dots
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(eventType);
  }

  /**
   * Wait for a specific event sequence
   */
  static async waitForEventSequence(
    sequence: string[],
    timeout = 10000
  ): Promise<CapturedEvent[]> {
    const matchedEvents: CapturedEvent[] = [];
    let currentIndex = 0;

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        EventBus.off('**', handler);
        reject(new Error(`Timeout waiting for event sequence. Got ${currentIndex}/${sequence.length}: ${sequence.slice(0, currentIndex).join(' -> ')}`));
      }, timeout);

      const handler = (event: CapturedEvent) => {
        if (currentIndex < sequence.length) {
          const expectedPattern = sequence[currentIndex];
          
          if (this.matchesPattern(event.type, expectedPattern)) {
            matchedEvents.push(event);
            currentIndex++;
            
            console.log(`✅ Sequence step ${currentIndex}/${sequence.length}: ${event.type}`);
            
            if (currentIndex >= sequence.length) {
              clearTimeout(timeoutId);
              EventBus.off('**', handler);
              resolve(matchedEvents);
            }
          }
        }
      };

      EventBus.on('**', handler);
    });
  }
}

// 🧪 Example test scenarios
export class WorkflowTestScenarios {
  
  static async testContractApprovalFlow(): Promise<void> {
    console.log('🧪 Testing Contract Approval Flow...');

    const result = await EventBusTestUtils.testWorkflowScenario({
      name: 'Contract Approval Flow',
      documentEvent: EventBusTestUtils.createMockDocumentEvent('created', {
        id: 'contract-123',
        type: 'contract',
        title: 'Service Agreement',
        status: 'draft',
        value: 15000
      }),
      expectedSteps: ['grantAccess', 'sendEmail', 'waitForApproval']
    });

    if (result.success) {
      console.log('✅ Contract approval flow test passed');
    } else {
      console.log('❌ Contract approval flow test failed:', result.errors);
    }

    EventBusTestUtils.printEventSummary();
  }

  static async testStepResponseFlow(): Promise<void> {
    console.log('🧪 Testing Step Response Flow...');

    EventBusTestUtils.startCapturing();

    // Emit step event
    const stepEvent = EventBusTestUtils.createMockStepEvent('grantAccess', 'workflow-123');
    EventBus.emit('workflow.step.grantAccess', stepEvent);

    // Wait for step to be processed (should come from your consumers)
    try {
      const stepResponseEvent = await EventBusTestUtils.waitForEvent(
        'workflow.step.grantAccess.response.*',
        2000
      );
      
      console.log('✅ Step response received:', stepResponseEvent.type);
    } catch (error) {
      console.log('❌ Step response not received:', error.message);
    }

    EventBusTestUtils.stopCapturing();
  }

  static async testEventSequence(): Promise<void> {
    console.log('🧪 Testing Event Sequence...');

    EventBusTestUtils.startCapturing();

    try {
      const sequencePromise = EventBusTestUtils.waitForEventSequence([
        'document.lifecycle',
        'workflow.start',
        'workflow.step.*',
        'workflow.step.*.response.*'
      ], 5000);

      // Trigger the sequence
      EventBus.emit('document.lifecycle', EventBusTestUtils.createMockDocumentEvent('created', {
        id: 'test-doc',
        type: 'contract'
      }));

      const sequence = await sequencePromise;
      console.log('✅ Event sequence completed:', sequence.map(e => e.type));

    } catch (error) {
      console.log('❌ Event sequence failed:', error.message);
    }

    EventBusTestUtils.stopCapturing();
  }
}

// 🎯 Jest test helpers
export class JestEventTestHelpers {
  
  static expectEventToBeEmitted(eventType: string, timeout = 1000) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Expected event '${eventType}' to be emitted within ${timeout}ms`));
      }, timeout);

      EventBus.once(eventType, (event) => {
        clearTimeout(timeoutId);
        resolve(event);
      });
    });
  }

  static expectEventsInOrder(eventTypes: string[], timeout = 5000) {
    return EventBusTestUtils.waitForEventSequence(eventTypes, timeout);
  }

  static mockEventHandler(eventType: string): jest.Mock {
    const mockHandler = jest.fn();
    EventBus.on(eventType, mockHandler);
    return mockHandler;
  }
}