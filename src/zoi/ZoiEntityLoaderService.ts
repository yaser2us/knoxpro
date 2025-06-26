// src/zoi/ZoiEntityLoaderService.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ZoiEntityBuilder } from './engine/zoi.entity.builder.v2';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class ZoiEntityLoaderService {
    private templateRepo: Repository<DocumentTemplate>;

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) {
        this.templateRepo = dataSource.getRepository(DocumentTemplate);
        console.log("[zoi] ZoiEntityLoaderService initialized");
    }

    /**  
     * Fetch all active templates and build runtime EntityClasses
     */
    async loadAll(): Promise<Function[]> {
        console.log("[zoi] Loading dynamic entities...");

        try {
            const templates = await this.templateRepo.find({
                where: { isActive: true },
                order: { createdAt: 'ASC' }
            });

            console.log(`[zoi] Found ${templates.length} active templates`);

            const allDynamicEntities: Function[] = [];

            for (const template of templates) {
                try {
                    console.log(`[zoi] Processing template: ${template.name} (type: ${template.type})`);

                    // Parse schema (handle both string and object)
                    let schema;
                    if (typeof template.schema === 'string') {
                        schema = JSON.parse(template.schema);
                    } else {
                        schema = template.schema;
                    }

                    // Validate schema
                    if (!this.isValidSchema(schema)) {
                        console.warn(`[zoi] Invalid schema for template ${template.name}, skipping`);
                        continue;
                    }

                    // 🔧 ENHANCED: Better logging of schema being processed
                    console.log(`[zoi] Schema type: ${schema.type}, has workflow: ${!!schema.workflow}`);

                    // Generate entities - this returns Function[]
                    const entitiesFromTemplate = ZoiEntityBuilder.createFromJsonSchema(schema);

                    console.log(`[zoi] Generated ${entitiesFromTemplate.length} entities from template ${template.name}:`);

                    if (entitiesFromTemplate.length > 0) {
                        entitiesFromTemplate.forEach((entity, index) => {
                            console.log(`[zoi] ✓ Entity ${index + 1}: ${entity.name}`);

                            // 🔧 ENHANCED: Validate entity before adding
                            if (this.isValidEntity(entity)) {
                                allDynamicEntities.push(entity);
                            } else {
                                console.warn(`[zoi] ⚠️ Invalid entity ${entity.name}, skipping`);
                            }
                        });
                    } else {
                        console.warn(`[zoi] No entities generated for template ${template.name}`);
                    }

                } catch (templateError) {
                    console.error(`[zoi] ❌ Error processing template ${template.name}:`, templateError);
                    // Continue with other templates instead of failing completely
                }
            }

            // 🔧 ENHANCED: Better final logging
            console.log(`[zoi] ✅ Successfully generated ${allDynamicEntities.length} dynamic entities:`);
            allDynamicEntities.forEach((entity, index) => {
                console.log(`[zoi]   ${index + 1}. ${entity.name}`);
            });

            return allDynamicEntities;

        } catch (error) {
            console.error('[zoi] ❌ Critical error loading templates:', error);
            // Return empty array to prevent app from crashing
            return [];
        }
    }

    /**
     * 🔧 ENHANCED: Validate schema structure with better checks
     */
    private isValidSchema(schema: any): boolean {
        if (!schema || typeof schema !== 'object') {
            console.warn('[zoi] Schema is not an object');
            return false;
        }

        // Required fields
        if (!schema.type || typeof schema.type !== 'string') {
            console.warn('[zoi] Schema missing required "type" field');
            return false;
        }

        if (!schema.properties || typeof schema.properties !== 'object') {
            console.warn('[zoi] Schema missing required "properties" field');
            return false;
        }

        // 🆕 NEW: Additional validation for workflow schemas
        if (schema.workflow) {
            if (!schema.workflow.type || typeof schema.workflow.type !== 'string') {
                console.warn('[zoi] Schema has workflow but missing workflow.type');
                return false;
            }

            if (schema.workflow.steps && !Array.isArray(schema.workflow.steps)) {
                console.warn('[zoi] Schema workflow.steps must be an array');
                return false;
            }
        }

        return true;
    }

    /**
     * 🆕 NEW: Validate generated entity
     */
    private isValidEntity(entity: Function): boolean {
        if (!entity || typeof entity !== 'function') {
            console.warn('[zoi] Entity is not a function');
            return false;
        }

        if (!entity.name || typeof entity.name !== 'string') {
            console.warn('[zoi] Entity missing name property');
            return false;
        }

        // Check if entity has required TypeORM metadata
        try {
            // Basic check - if it has prototype and constructor
            if (!entity.prototype) {
                console.warn(`[zoi] Entity ${entity.name} missing prototype`);
                return false;
            }

            return true;
        } catch (error) {
            console.warn(`[zoi] Error validating entity ${entity.name}:`, error);
            return false;
        }
    }

    /**
     * Get entity by name (useful for debugging)
     */
    async getEntityByName(name: string): Promise<Function | null> {
        const entities = await this.loadAll();
        const found = entities.find(entity => entity.name === name);

        if (found) {
            console.log(`[zoi] ✓ Found entity: ${name}`);
        } else {
            console.log(`[zoi] ❌ Entity not found: ${name}`);
            console.log(`[zoi] Available entities: ${entities.map(e => e.name).join(', ')}`);
        }

        return found || null;
    }

    /**
     * List all generated entity names
     */
    async listEntityNames(): Promise<string[]> {
        const entities = await this.loadAll();
        return entities.map(entity => entity.name);
    }

    /**
     * 🔧 ENHANCED: Debug method with better output
     */
    async debugSchemas(): Promise<{
        templates: Array<{
            name: string;
            type: string;
            hasWorkflow: boolean;
            workflowType?: string;
            entityCount: number;
            entities: string[];
        }>;
        totalEntities: number;
        allEntityNames: string[];
    }> {
        try {
            const templates = await this.templateRepo.find({ where: { isActive: true } });

            console.log('\n[zoi] === SCHEMA DEBUG ===');

            const debug: {
                templates: Array<{
                    name: string;
                    type: string;
                    hasWorkflow: boolean;
                    workflowType?: string;
                    entityCount: number;
                    entities: string[];
                }>;
                totalEntities: number;
                allEntityNames: string[];
            } = {
                templates: [],
                totalEntities: 0,
                allEntityNames: []
            };

            for (const template of templates) {
                console.log(`\nTemplate: ${template.name} (${template.type})`);

                try {
                    // Parse schema
                    let schema;
                    if (typeof template.schema === 'string') {
                        schema = JSON.parse(template.schema);
                    } else {
                        schema = template.schema;
                    }

                    // Generate entities to see what would be created
                    const entities = ZoiEntityBuilder.createFromJsonSchema(schema);
                    const entityNames = entities.map(e => e.name);

                    const templateDebug = {
                        name: template.name,
                        type: template.type,
                        hasWorkflow: !!schema.workflow,
                        workflowType: schema.workflow?.type,
                        entityCount: entities.length,
                        entities: entityNames
                    };

                    debug.templates.push(templateDebug);
                    debug.totalEntities += entities.length;
                    debug.allEntityNames.push(...entityNames);

                    console.log(`  Entities (${entities.length}): ${entityNames.join(', ')}`);
                    console.log(`  Has workflow: ${!!schema.workflow} ${schema.workflow ? `(${schema.workflow.type})` : ''}`);

                } catch (error) {
                    console.error(`  ❌ Error processing template: ${error.message}`);
                    debug.templates.push({
                        name: template.name,
                        type: template.type,
                        hasWorkflow: false,
                        entityCount: 0,
                        entities: [`ERROR: ${error.message}`]
                    });
                }
            }

            console.log(`\n[zoi] Summary: ${debug.totalEntities} total entities from ${templates.length} templates`);
            console.log('[zoi] === END DEBUG ===\n');

            return debug;

        } catch (error) {
            console.error('[zoi] Error in debug:', error);
            return {
                templates: [],
                totalEntities: 0,
                allEntityNames: []
            };
        }
    }

    /**
     * 🆕 NEW: Check if specific entity type exists
     */
    async hasEntity(entityName: string): Promise<boolean> {
        const entities = await this.loadAll();
        return entities.some(entity => entity.name === entityName);
    }

    /**
     * 🆕 NEW: Get entities by pattern (useful for finding signature entities)
     */
    async getEntitiesByPattern(pattern: string): Promise<Function[]> {
        const entities = await this.loadAll();
        const regex = new RegExp(pattern, 'i');
        return entities.filter(entity => regex.test(entity.name));
    }

    /**
     * 🆕 NEW: Get signature entities only
     */
    async getSignatureEntities(): Promise<Function[]> {
        return this.getEntitiesByPattern('signature');
    }

    /**
     * 🆕 NEW: Get main entities only (non-signature)
     */
    async getMainEntities(): Promise<Function[]> {
        const entities = await this.loadAll();
        return entities.filter(entity =>
            !entity.name.toLowerCase().includes('signature') &&
            !entity.name.endsWith('_signatures')
        );
    }

}