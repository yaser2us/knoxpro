// src/zoi/events/event-bus.module.ts
import { Module, Global, DynamicModule } from '@nestjs/common';
import { 
    EventBus, 
    // RedisEventBus 
} from './event-bus';

export interface EventBusModuleOptions {
  useRedis?: boolean;
  redisUrl?: string;
  maxHistorySize?: number;
}

@Global()
@Module({})
export class EventBusModule {
  static forRoot(options: EventBusModuleOptions = {}): DynamicModule {
    const providers = [
      {
        provide: 'EVENT_BUS_OPTIONS',
        useValue: options
      },
      {
        provide: EventBus,
        useFactory: (opts: EventBusModuleOptions) => {
        //   if (opts.useRedis) {
        //     return new RedisEventBus();
        //   }
          return new EventBus();
        },
        inject: ['EVENT_BUS_OPTIONS']
      }
    ];

    return {
      module: EventBusModule,
      providers,
      exports: [EventBus]
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => EventBusModuleOptions | Promise<EventBusModuleOptions>;
    inject?: any[];
  }): DynamicModule {
    return {
      module: EventBusModule,
      providers: [
        {
          provide: 'EVENT_BUS_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || []
        },
        {
          provide: EventBus,
          useFactory: (opts: EventBusModuleOptions) => {
            // if (opts.useRedis) {
            //   return new RedisEventBus();
            // }
            return new EventBus();
          },
          inject: ['EVENT_BUS_OPTIONS']
        }
      ],
      exports: [EventBus]
    };
  }
}