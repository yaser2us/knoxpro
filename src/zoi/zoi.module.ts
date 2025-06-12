// zoi.module.ts
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import {
    Document,
    DocumentAttachment,
    DocumentFlow,
    DocumentSignature,
    DocumentTemplate,
    FlowTemplate
} from './entity';
import { ZoiBootstrapService } from './zoi.bootstrap.service';
import { ZoiController } from './zoi.controller';
import { ZoiSchemaService } from './zoi.schema.service';
import { DocumentLifecycleService } from './lifecycle/document.lifecycle.service';
import { ZoiFlowEngine } from './engine/zoi.flow.engine';
import { ZoiStepExecutor } from './zoi.flow.step.executor';
import { WorkflowTemplate } from './entity/workflow.template.entity';
import { WorkflowRun } from './entity/workflow.run.entity';
import { WorkflowLog } from './entity/workflow.log.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ZoiDocumentInterceptor, ZoiDocumentInterceptorRobust } from './zoi.document.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import { WinstonLoggerService } from 'src/common/logger/winston-logger.service';
import { winstonConfig } from 'src/common/logger/logger.config';
import { LoggerModule } from 'src/common/logger/logger.module';
import { EventBusModule } from './events/event-bus.module';
import { ScheduleModule } from '@nestjs/schedule';
// import { EventReplayService } from './events/event-replay.service';
// import { EventMonitoringService } from './events/event-monitoring.service';
import { ZoiWorkflowTriggerService } from './services/zoi-workflow-trigger.service';
import { ZoiDebugController } from './controllers/zoi-debug.controller';
// import { ZoiHotReloadService } from './zoi.hot.reload.service';


export const ENTITY_PARAM_MAP = Symbol('ENTITY_PARAM_MAP');

//
@Module({
    imports: [
        // WinstonModule.forRoot(winstonConfig), // <== Required to inject WINSTON_MODULE_NEST_PROVIDER
        // Import EventBus globally
        EventBusModule.forRoot({
            useRedis: process.env.USE_REDIS_EVENT_BUS === 'true',
            redisUrl: process.env.REDIS_URL,
            maxHistorySize: 5000
        }),
        LoggerModule.register('ZoiStepExecutor'),
        TypeOrmModule.forFeature([
            Document,
            DocumentFlow,
            DocumentTemplate,
            DocumentSignature,
            DocumentAttachment,
            FlowTemplate,
            WorkflowTemplate,
            WorkflowRun,
            WorkflowLog
            // optionally other entities
        ]),
        // For cron jobs in monitoring
        ScheduleModule.forRoot()
    ],
    controllers: [
        ZoiController,
        ZoiDebugController
    ],
    providers: [
        // ZoiHotReloadService,
        // {
        //     provide: 'UserLogger',
        //     useFactory: (winstonLogger) => new WinstonLoggerService(winstonLogger, 'winstonLogger'),
        //     inject: [WINSTON_MODULE_NEST_PROVIDER],
        //   },
        ZoiBootstrapService,
        ZoiSchemaService,
        DocumentLifecycleService,
        ZoiFlowEngine,
        ZoiStepExecutor,
        {
            provide: APP_INTERCEPTOR,
            useClass: ZoiDocumentInterceptorRobust//ZoiDocumentInterceptor
        },
        // Core Zoi Services
        // ZoiDocumentInterceptor,
        ZoiDocumentInterceptorRobust,
        ZoiWorkflowTriggerService,
        ZoiFlowEngine,

        // Event System Services
        // EventMonitoringService,
        // EventReplayService,

        // Recovery Service for crash recovery
        {
            provide: 'ZOI_RECOVERY_SERVICE',
            useFactory: (flowEngine: ZoiFlowEngine) => {
                return {
                    async recoverInterruptedWorkflows() {
                        // Implementation for recovering workflows on startup
                        console.log('🔄 Recovering interrupted workflows...');
                        // Find workflows with status 'running' or 'waiting_for_step'
                        // Re-emit their current step events
                    }
                };
            },
            inject: [ZoiFlowEngine]
        }
        // { provide: ENTITY_PARAM_MAP, useValue: new Map() },
    ],
    exports: [
        ZoiBootstrapService,
        ZoiSchemaService,
        ZoiFlowEngine,
        ZoiStepExecutor,
        ZoiWorkflowTriggerService,
        // EventMonitoringService,
        // EventReplayService
        // 'UserLogger'
    ],
})
export class ZoiModule { }
