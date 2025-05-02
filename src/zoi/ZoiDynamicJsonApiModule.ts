// src/zoi/zoi-dynamic-jsonapi.module.ts
import { DynamicModule, Module } from '@nestjs/common';
import { JsonApiModule, TypeOrmJsonApiModule } from 'json-api-nestjs';
import dataSource, { config } from '../database';

import {
    AccessAction,
    AccessEvent,
    ResourceAction,
    ResourceType,
    Role,
    RolePermission,
    User,
    UserRole,
    Workspace,
} from "../pulse/entity"

import { Document, DocumentAttachment, DocumentFlow, DocumentSignature, DocumentTemplate, FlowTemplate } from '../zoi/entity';

import { ZoiEntityLoaderService } from './ZoiEntityLoaderService';
import { DataSource } from 'typeorm';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmOptions } from 'json-api-nestjs/src/lib/types';

const entities = [
    User,
    Workspace,
    Role,
    UserRole,
    ResourceType,
    ResourceAction,
    RolePermission,
    AccessAction,
    AccessEvent,
    Document,
    DocumentAttachment,
    DocumentFlow,
    DocumentSignature,
    DocumentTemplate,
    FlowTemplate
];

@Module({})
export class ZoiDynamicJsonApiModule {
    static async forRootAsync(): Promise<DynamicModule> {
        const bootstrapDS = new DataSource({
            ...config,
            entities: [
                ...entities
            ],   // only need DocumentTemplate here
          });
        await bootstrapDS.initialize();    // this must be called!
        const loader = new ZoiEntityLoaderService(bootstrapDS);
        const dynamic = await loader.loadAll();

        return {
            module: ZoiDynamicJsonApiModule,
            imports: [
                // we need access to DocumentTemplate at bootstrap
                // TypeOrmModule.forFeature(
                //         [ User,
                //             Workspace,
                //             Role,
                //             UserRole,
                //             ResourceType,
                //             ResourceAction,
                //             RolePermission,
                //             AccessAction,
                //             AccessEvent,
                //             Document,
                //             DocumentAttachment,
                //             DocumentFlow,
                //             DocumentSignature,
                //             DocumentTemplate]
                // ),
                // NOW call json-api with a factory that includes dynamic entities
                TypeOrmModule.forFeature([DocumentTemplate]), // ✅ register the repo for DI
                JsonApiModule.forRoot(TypeOrmJsonApiModule, {
                    ...dataSource,
                    entities: [
                        User,
                        Workspace,
                        Role,
                        UserRole,
                        ResourceType,
                        ResourceAction,
                        RolePermission,
                        AccessAction,
                        AccessEvent,
                        Document,
                        DocumentAttachment,
                        DocumentFlow,
                        DocumentSignature,
                        DocumentTemplate,
                        FlowTemplate,
                        ...dynamic
                    ],
                    options: {
                        debug: true,
                        requiredSelectField: false,
                        operationUrl: 'operation',
                        // pipeForId: UUIDValidationPipe
                    },
                }),
            ],
            providers: [ZoiEntityLoaderService],
            exports: [JsonApiModule],
        };
    }
}