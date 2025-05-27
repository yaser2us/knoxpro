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
import { ZoiDocumentInterceptor } from './zoi.document.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import { WinstonLoggerService } from 'src/common/logger/winston-logger.service';
import { winstonConfig } from 'src/common/logger/logger.config';
import { LoggerModule } from 'src/common/logger/logger.module';
// import { ZoiHotReloadService } from './zoi.hot.reload.service';

export const ENTITY_PARAM_MAP = Symbol('ENTITY_PARAM_MAP');

//
@Module({
    imports: [
        // WinstonModule.forRoot(winstonConfig), // <== Required to inject WINSTON_MODULE_NEST_PROVIDER
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
    ],
    controllers: [
        ZoiController
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
            useClass: ZoiDocumentInterceptor
        }
        // { provide: ENTITY_PARAM_MAP, useValue: new Map() },
    ],
    exports: [
        ZoiBootstrapService,
        ZoiSchemaService,
        ZoiFlowEngine,
        ZoiStepExecutor
        // 'UserLogger'
    ],
})
export class ZoiModule { }
