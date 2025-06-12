// src/zoi/events/event-decorators.ts
import { SetMetadata } from '@nestjs/common';
import { EventBus } from './event-bus';

export const EVENT_HANDLER_METADATA = 'event_handler';
export const EVENT_PATTERN_METADATA = 'event_pattern';

// 🎯 Decorator for automatic event handler registration
export function EventHandler(eventPattern: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        SetMetadata(EVENT_HANDLER_METADATA, true)(target, propertyKey, descriptor);
        SetMetadata(EVENT_PATTERN_METADATA, eventPattern)(target, propertyKey, descriptor);

        // Auto-register when class is instantiated
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            // Register handler on first call
            if (!this._eventHandlersRegistered) {
                this._eventHandlersRegistered = new Set();
            }

            if (!this._eventHandlersRegistered.has(propertyKey)) {
                EventBus.on(eventPattern, originalMethod.bind(this));
                this._eventHandlersRegistered.add(propertyKey);
                console.log(`🎧 Auto-registered event handler: ${eventPattern} -> ${target.constructor.name}.${propertyKey}`);
            }

            return originalMethod.apply(this, args);
        };
    };
}

// 🎯 Service decorator for automatic event registration
export function EventService() {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);

                // Auto-register all @EventHandler methods
                const prototype = Object.getPrototypeOf(this);
                const methodNames = Object.getOwnPropertyNames(prototype);

                for (const methodName of methodNames) {
                    const method = prototype[methodName];
                    if (typeof method === 'function' && methodName !== 'constructor') {
                        const isEventHandler = Reflect.getMetadata(EVENT_HANDLER_METADATA, prototype, methodName);
                        const eventPattern = Reflect.getMetadata(EVENT_PATTERN_METADATA, prototype, methodName);

                        if (isEventHandler && eventPattern) {
                            EventBus.on(eventPattern, method.bind(this));
                            console.log(`🎧 Auto-registered: ${eventPattern} -> ${constructor.name}.${methodName}`);
                        }
                    }
                }
            }
        };
    };
}