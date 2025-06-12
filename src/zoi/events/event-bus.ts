// src/zoi/events/event-bus.ts
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';
import { ModuleEventListener } from 'src/core/interfaces/event-listener.interface';

export interface EventPayload {
  id: string;
  type: string;
  timestamp: string;
  source?: string;
  payload: any;
  metadata?: any;
}

export type EventHandler = (event: EventPayload) => void | Promise<void>;
export type EventPattern = string; // Support wildcards like 'workflow.step.*'

@Injectable()
export class EventBus {
    private static listeners = new Map<string, Function[]>();  // Original .on() listeners
    private static moduleListeners = new Map<string, ModuleEventListener[]>();  // New module listeners
    private static logger = new Logger(EventBus.name);

    // 🔄 ORIGINAL METHOD - Keep for backward compatibility
    static on(eventType: string, handler: Function): void {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        this.listeners.get(eventType)!.push(handler);
        this.logger.debug(`🔗 [on] Registered handler for ${eventType}`);
    }

    // 🔄 ORIGINAL METHOD - Keep for backward compatibility  
    static off(eventType: string, handler: Function): void {
        const handlers = this.listeners.get(eventType);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    // 🆕 NEW METHOD - For module listeners
    static registerListener(listener: ModuleEventListener): void {
        const events = listener.getSubscribedEvents();
        
        this.logger.log(`🔌 [register] Registering ${listener.moduleName} listener...`);
        
        events.forEach(eventPattern => {
            if (!this.moduleListeners.has(eventPattern)) {
                this.moduleListeners.set(eventPattern, []);
            }
            this.moduleListeners.get(eventPattern)!.push(listener);
            this.logger.debug(`📌 [register] ${listener.moduleName} → ${eventPattern}`);
        });

        this.logger.log(`✅ [register] ${listener.moduleName} registered for ${events.length} event patterns`);
    }

    // 🔄 ENHANCED EMIT - Works with both old and new systems
    static async emit(eventType: string, event: any): Promise<void> {
        this.logger.debug(`📤 [emit] Emitting event: ${eventType}`);

        // Track event in history
        const originalHandlerCount = (this.listeners.get(eventType) || []).length;
        const moduleHandlerCount = this.findMatchingModuleListeners(eventType).length;
        const totalListenerCount = originalHandlerCount + moduleHandlerCount;

        this.addToEventHistory(eventType, event, totalListenerCount);

        // 1. Call original .on() handlers (synchronous, like before)
        const originalHandlers = this.listeners.get(eventType) || [];
        if (originalHandlers.length > 0) {
            this.logger.debug(`🔗 [emit] Calling ${originalHandlers.length} original handlers for ${eventType}`);
            for (const handler of originalHandlers) {
                try {
                    await handler(event);
                } catch (error) {
                    this.logger.error(`❌ [emit] Error in original handler for ${eventType}:`, error);
                }
            }
        }

        // 2. Call new module listeners (with pattern matching)
        const matchingModuleListeners = this.findMatchingModuleListeners(eventType);
        if (matchingModuleListeners.length > 0) {
            this.logger.debug(`🎯 [emit] Calling ${matchingModuleListeners.length} module listeners for ${eventType}`);
            
            const promises = matchingModuleListeners.map(async (listener) => {
                try {
                    await listener.handleEvent(event);
                } catch (error) {
                    this.logger.error(`❌ [emit] Error in ${listener.moduleName} listener for ${eventType}:`, error);
                }
            });

            await Promise.allSettled(promises);
        }

        if (originalHandlers.length === 0 && matchingModuleListeners.length === 0) {
            this.logger.debug(`🔇 [emit] No listeners found for event: ${eventType}`);
        }
    }

    // 🔄 Helper method to add events to history
    private static addToEventHistory(eventType: string, event: any, listenerCount: number): void {
        this.eventHistory.push({
            type: eventType,
            timestamp: new Date(),
            event: event,
            listenerCount: listenerCount
        });

        // Keep history size under control
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
        }
    }

    // 🔍 Find module listeners that match the event type (supports wildcards)
    private static findMatchingModuleListeners(eventType: string): ModuleEventListener[] {
        const matchingListeners: ModuleEventListener[] = [];

        this.moduleListeners.forEach((listeners, pattern) => {
            if (this.matchesPattern(eventType, pattern)) {
                matchingListeners.push(...listeners);
            }
        });

        return matchingListeners;
    }

    // 🎯 Pattern matching for wildcards
    private static matchesPattern(eventType: string, pattern: string): boolean {
        // Exact match
        if (eventType === pattern) {
            return true;
        }

        // Wildcard pattern
        if (pattern.includes('*')) {
            const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
            return regex.test(eventType);
        }

        return false;
    }

    // 🔄 ORIGINAL METHOD - Keep for backward compatibility
    static getAllEventTypes(): string[] {
        const originalEvents = Array.from(this.listeners.keys());
        const moduleEvents = Array.from(this.moduleListeners.keys());
        return [...new Set([...originalEvents, ...moduleEvents])];
    }

    // 🔄 ORIGINAL METHOD - Keep for backward compatibility
    static once(eventType: string, handler: Function): void {
        const onceWrapper = (event: any) => {
            handler(event);
            this.off(eventType, onceWrapper);
        };
        this.on(eventType, onceWrapper);
        this.logger.debug(`🔗 [once] Registered one-time handler for ${eventType}`);
    }

    // 🔄 ORIGINAL METHOD - Event history tracking
    private static eventHistory: Array<{ 
        type: string; 
        timestamp: Date; 
        event: any; 
        listenerCount: number;
    }> = [];
    private static maxHistorySize = 1000;

    static getEventHistory(eventType?: string): Array<{ 
        type: string; 
        timestamp: Date; 
        event: any; 
        listenerCount: number;
    }> {
        if (eventType) {
            return this.eventHistory.filter(entry => entry.type === eventType);
        }
        return [...this.eventHistory];
    }

    // 🔄 Clear event history
    static clearEventHistory(): void {
        this.eventHistory = [];
        this.logger.debug('🧹 [history] Event history cleared');
    }

    // 🔄 ENHANCED METHOD - Get registered listeners (for debugging)
    static getRegisteredListeners(): Map<string, string[]> {
        const result = new Map<string, string[]>();
        
        // Add original listeners
        this.listeners.forEach((handlers, eventType) => {
            if (handlers.length > 0) {
                result.set(eventType, [`${handlers.length} original handlers`]);
            }
        });
        
        // Add module listeners
        this.moduleListeners.forEach((listeners, eventType) => {
            const existing = result.get(eventType) || [];
            const moduleNames = listeners.map(l => l.moduleName);
            result.set(eventType, [...existing, ...moduleNames]);
        });
        
        return result;
    }

    // 🔍 Debug methods
    static debugRegistration(): void {
        this.logger.log('🔍 [debug] EventBus Registration Summary:');
        
        this.logger.log(`📊 [debug] Original .on() listeners: ${this.listeners.size} event types`);
        this.listeners.forEach((handlers, eventType) => {
            this.logger.log(`  🔗 [debug] ${eventType} → ${handlers.length} handlers`);
        });
        
        this.logger.log(`📊 [debug] Module listeners: ${this.moduleListeners.size} event patterns`);
        this.moduleListeners.forEach((listeners, pattern) => {
            this.logger.log(`  📌 [debug] ${pattern} → [${listeners.map(l => l.moduleName).join(', ')}]`);
        });
    }

    // 🔄 ORIGINAL METHOD - Get event listener count
    static getListenerCount(eventType: string): number {
        const originalCount = (this.listeners.get(eventType) || []).length;
        const moduleCount = this.findMatchingModuleListeners(eventType).length;
        return originalCount + moduleCount;
    }

    // 🔄 ORIGINAL METHOD - Check if event type has listeners
    static hasListeners(eventType: string): boolean {
        return this.getListenerCount(eventType) > 0;
    }

    // 🔄 ORIGINAL METHOD - Remove all listeners for an event type
    static removeAllListeners(eventType?: string): void {
        if (eventType) {
            // Remove original listeners
            this.listeners.delete(eventType);
            
            // Remove module listeners (exact match only)
            this.moduleListeners.delete(eventType);
            
            this.logger.debug(`🧹 [cleanup] Removed all listeners for ${eventType}`);
        } else {
            // Remove all listeners
            this.listeners.clear();
            this.moduleListeners.clear();
            this.logger.debug('🧹 [cleanup] Removed all listeners');
        }
    }

    // 🔄 ORIGINAL METHOD - Get event statistics
    static getEventStats(): {
        totalEventTypes: number;
        totalOriginalHandlers: number;
        totalModuleListeners: number;
        eventHistory: number;
        recentEvents: string[];
    } {
        const totalOriginalHandlers = Array.from(this.listeners.values())
            .reduce((sum, handlers) => sum + handlers.length, 0);
        
        const totalModuleListeners = Array.from(this.moduleListeners.values())
            .reduce((sum, listeners) => sum + listeners.length, 0);

        const recentEvents = this.eventHistory
            .slice(-10)
            .map(entry => `${entry.type} (${entry.timestamp.toISOString()})`);

        return {
            totalEventTypes: this.getAllEventTypes().length,
            totalOriginalHandlers,
            totalModuleListeners,
            eventHistory: this.eventHistory.length,
            recentEvents
        };
    }

    // 🧪 Test compatibility
    static async testCompatibility(): Promise<void> {
        this.logger.log('🧪 [test] Testing EventBus compatibility...');

        // Test 1: Original .on() method
        let originalCalled = false;
        EventBus.on('test.original', () => {
            originalCalled = true;
            console.log('✅ Original .on() handler called');
        });

        await EventBus.emit('test.original', { message: 'test' });
        
        if (originalCalled) {
            this.logger.log('✅ [test] Original .on() method works');
        } else {
            this.logger.error('❌ [test] Original .on() method failed');
        }

        // Test 2: .once() method
        let onceCalled = false;
        let onceCallCount = 0;
        EventBus.once('test.once', () => {
            onceCalled = true;
            onceCallCount++;
            console.log('✅ Original .once() handler called');
        });

        await EventBus.emit('test.once', { message: 'first' });
        await EventBus.emit('test.once', { message: 'second' });

        if (onceCalled && onceCallCount === 1) {
            this.logger.log('✅ [test] Original .once() method works');
        } else {
            this.logger.error('❌ [test] Original .once() method failed');
        }

        // Test 3: getAllEventTypes
        const eventTypes = EventBus.getAllEventTypes();
        this.logger.log(`✅ [test] getAllEventTypes() returns ${eventTypes.length} event types`);

        // Test 4: getEventHistory
        const history = EventBus.getEventHistory();
        this.logger.log(`✅ [test] getEventHistory() returns ${history.length} events`);

        // Test 5: Event statistics
        const stats = EventBus.getEventStats();
        this.logger.log(`✅ [test] getEventStats() works:`, stats);

        this.logger.log('🏁 [test] Compatibility test completed');
    }
}

// 🎯 Alternative: Redis-based EventBus for distributed systems
// import { Injectable as RedisInjectable } from '@nestjs/common';
// import Redis from 'ioredis';

// @RedisInjectable()
// export class RedisEventBus {
//   private publisher: Redis;
//   private subscriber: Redis;
//   private handlers = new Map<string, EventHandler[]>();
//   private logger = new Logger('RedisEventBus');

//   constructor() {
//     this.publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
//     this.subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    
//     this.subscriber.on('message', this.handleRedisMessage.bind(this));
//   }

//   async on(eventPattern: string, handler: EventHandler): Promise<void> {
//     // Store handler locally
//     if (!this.handlers.has(eventPattern)) {
//       this.handlers.set(eventPattern, []);
//     }
//     this.handlers.get(eventPattern)!.push(handler);

//     // Subscribe to Redis pattern
//     if (eventPattern.includes('*')) {
//       await this.subscriber.psubscribe(eventPattern);
//     } else {
//       await this.subscriber.subscribe(eventPattern);
//     }
    
//     this.logger.debug(`🎧 Subscribed to Redis pattern: ${eventPattern}`);
//   }

//   async emit(eventType: string, payload: any): Promise<void> {
//     const event: EventPayload = {
//       id: this.generateEventId(),
//       type: eventType,
//       timestamp: new Date().toISOString(),
//       payload
//     };

//     await this.publisher.publish(eventType, JSON.stringify(event));
//     this.logger.debug(`🚀 Published to Redis: ${eventType}`);
//   }

//   private async handleRedisMessage(channel: string, message: string): Promise<void> {
//     try {
//       const event: EventPayload = JSON.parse(message);
      
//       // Find matching handlers
//       for (const [pattern, handlers] of this.handlers.entries()) {
//         if (this.matchesPattern(event.type, pattern)) {
//           for (const handler of handlers) {
//             await this.executeHandler(handler, event);
//           }
//         }
//       }
//     } catch (error) {
//       this.logger.error('❌ Error handling Redis message:', error);
//     }
//   }

//   private async executeHandler(handler: EventHandler, event: EventPayload): Promise<void> {
//     try {
//       const result = handler(event);
//       if (result instanceof Promise) {
//         await result;
//       }
//     } catch (error) {
//       this.logger.error(`❌ Error in Redis event handler for ${event.type}:`, error);
//     }
//   }

//   private matchesPattern(eventType: string, pattern: string): boolean {
//     const regexPattern = pattern
//       .replace(/\./g, '\\.')
//       .replace(/\*/g, '[^.]*');
//     const regex = new RegExp(`^${regexPattern}$`);
//     return regex.test(eventType);
//   }

//   private generateEventId(): string {
//     return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//   }
// }


// 🎯 Usage Examples & Testing
// export class EventBusTestHelper {
//   static async testEventBus() {
//     const eventBus = new EventBus();

//     // Test wildcard patterns
//     eventBus.on('workflow.step.*', (event) => {
//       console.log(`📋 Any workflow step: ${event.type}`);
//     });

//     eventBus.on('workflow.step.*.response.*', (event) => {
//       console.log(`📬 Any workflow step response: ${event.type}`);
//     });

//     // Test specific events
//     eventBus.on('workflow.step.grantAccess', (event) => {
//       console.log(`🔐 Grant access step: ${event.payload}`);
//     });

//     // Emit test events
//     eventBus.emit('workflow.step.grantAccess', { userId: '123' });
//     eventBus.emit('workflow.step.grantAccess.response.abc123', { success: true });
//     eventBus.emit('workflow.step.sendEmail', { to: 'test@example.com' });

//     // Test history
//     console.log('📊 Event history:', eventBus.getEventHistory());
//     console.log('📊 Workflow events:', eventBus.getEventHistory('workflow.step.*'));
//   }
// }

// 🎯 Export for backward compatibility
export { EventBus as default };