import { DynamicModule, Module } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { WinstonLoggerService } from './winston-logger.service';
import { Logger } from 'winston';

@Module({})
export class LoggerModule {
  static register(context: string): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: WinstonLoggerService,
          useFactory: (logger: Logger) => new WinstonLoggerService(logger, context),
          inject: [WINSTON_MODULE_NEST_PROVIDER],
        },
      ],
      exports: [WinstonLoggerService],
    };
  }
}
