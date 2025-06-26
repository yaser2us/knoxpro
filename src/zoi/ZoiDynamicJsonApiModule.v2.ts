// src/zoi/ZoiDynamicJsonApiModule.ts
import { DynamicModule, Module } from '@nestjs/common';
import { JsonApiModule } from '@yaser2us/json-api-nestjs';
import { TypeOrmJsonApiModule } from '@yaser2us/json-api-nestjs-typeorm';
import { config, dataSource } from '../database';

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
import { WorkflowTemplate } from './entity/workflow.template.entity';
import { WorkflowRun } from './entity/workflow.run.entity';
import { WorkflowLog } from './entity/workflow.log.entity';

import { ZoiEntityLoaderService } from './ZoiEntityLoaderService';
import { ZoiWorkflowService } from './services/ZoiWorkflowService';
import { ZoiDemoController } from './controllers/ZoiDemoController';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UUIDValidationPipe } from 'src/common/pipe/uuid.pipe';
import { School } from 'src/core/entity/school.entity';
import { YasserNasser, Profile } from 'src/core/entity';
import { EnhancedUserContextPipe } from 'src/common/pipe/enhanced-user-context.pipe';

function isEntityClass(fn: any): fn is { new(...args: any[]): any } {
    return typeof fn === 'function' && /^\s*class\s+/.test(fn.toString());
}

// Static entities that are always present
const staticEntities = [
    School,
    YasserNasser,
    User,
    Profile,
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
    WorkflowTemplate,
    WorkflowRun,
    WorkflowLog,
];

@Module({})
export class ZoiDynamicJsonApiModule {
    static async forRootAsync(): Promise<DynamicModule> {
        console.log('[zoi] 🚀 Initializing ZoiDynamicJsonApiModule...');
        
        try {
            // Create bootstrap DataSource for initial setup
            const bootstrapDS = new DataSource({
                ...config,
                entities: staticEntities,
            });
            
            await bootstrapDS.initialize();
            console.log('[zoi] ✓ Bootstrap DataSource initialized');
            
            // Load dynamic entities
            const loader = new ZoiEntityLoaderService(bootstrapDS);
            const dynamicEntities = await loader.loadAll();
            
            console.log('[zoi] Dynamic entities to register:', dynamicEntities.map(e => e.name));

            console.log(`[zoi] ✓ Loaded ${dynamicEntities.length} dynamic entities`);
            
            // Log all entities for debugging
            const allEntities = [...staticEntities, ...dynamicEntities.filter(isEntityClass)];
            console.log('[zoi] 📋 All entities to be registered:');
            allEntities.forEach(entity => {
                console.log(`  - ${entity.name}`);
            });
            
            // Close bootstrap connection (it will be recreated by the main module)
            await bootstrapDS.destroy();
            
            return {
                module: ZoiDynamicJsonApiModule,
                imports: [
                    // Register repositories for static entities we need at startup
                    TypeOrmModule.forFeature([
                        DocumentTemplate,
                        WorkflowTemplate,
                        WorkflowRun,
                        WorkflowLog,
                        DocumentSignature,
                        User
                    ]),
                    
                    // Configure JSON-API module with all entities
                    JsonApiModule.forRoot(TypeOrmJsonApiModule, {
                        ...dataSource,
                        
                        entities: [
                            School,
                            YasserNasser,
                            User,
                            Profile,
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
                            WorkflowTemplate,
                            WorkflowRun,
                            WorkflowLog,
                            ...dynamicEntities.filter(isEntityClass)
                        ],
                        options: {
                            debug: true,
                            requiredSelectField: false,
                            operationUrl: 'operation',
                            pipeForId: UUIDValidationPipe,
                            pipeForQuery: EnhancedUserContextPipe,
                            enableContext: true,
                            // Additional JSON-API options
                            // maxPageSize: 100,
                            // defaultPageSize: 20,
                        },
                    }),
                ],
                providers: [
                    ZoiEntityLoaderService,
                    ZoiWorkflowService,
                ],
                controllers: [ZoiDemoController],
                exports: [
                    JsonApiModule,
                    ZoiEntityLoaderService,
                    ZoiWorkflowService,
                ],
            };
            
        } catch (error) {
            console.error('[zoi] ❌ Error initializing ZoiDynamicJsonApiModule:', error);
            
            // Fallback: return module with only static entities
            console.log('[zoi] 🔄 Falling back to static entities only...');
            
            return {
                module: ZoiDynamicJsonApiModule,
                imports: [
                    TypeOrmModule.forFeature([
                        DocumentTemplate,
                        WorkflowTemplate,
                        WorkflowRun,
                        WorkflowLog,
                        DocumentSignature,
                        User
                    ]),
                    JsonApiModule.forRoot(TypeOrmJsonApiModule, {
                        ...dataSource,
                        entities: [
                            School,
                            YasserNasser,
                            User,
                            Profile,
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
                            WorkflowTemplate,
                            WorkflowRun,
                            WorkflowLog,
                        ],
                        options: {
                            debug: true,
                            requiredSelectField: false,
                            operationUrl: 'operation',
                            pipeForId: UUIDValidationPipe,
                            pipeForQuery: EnhancedUserContextPipe,
                            enableContext: true,
                        },
                    }),
                ],
                providers: [ZoiEntityLoaderService],
                controllers: [],
                exports: [JsonApiModule, ZoiEntityLoaderService],
            };
        }
    }
}