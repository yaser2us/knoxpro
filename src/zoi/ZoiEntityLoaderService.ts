// src/zoi/zoi-entity-loader.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ZoiEntityBuilder } from './engine/zoi.entity.builder';
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
import { error } from 'console';


@Injectable()
export class ZoiEntityLoaderService {
    //   constructor(private readonly entityManager: EntityManager) {}


    @InjectRepository(DocumentTemplate)
    private templateRepo: Repository<DocumentTemplate>

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,

    ) {
        this.templateRepo = dataSource.getRepository(DocumentTemplate);;

        console.log("[zoi] ZoiEntityLoaderService initialized", this.templateRepo);
    }

    /**  
     * Fetch all active templates, 
     * build a runtime EntityClass for each one  
     */
    async loadAll(): Promise<Function[]> {
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
//
        const templates = await this.templateRepo.find({ where: { isActive: true } });
        const dynamicEntities = templates.map(t => ZoiEntityBuilder.createFromJsonSchema(t.schema));

        dynamicEntities.forEach(entity => {
            console.log('Generated entity class:', entity.name);
        });
        return dynamicEntities;
    }

    // async loadDynamicEntities(): Promise<Function[]> {
    //     const templates = await this.entityManager.find(DocumentTemplate, { where: { isActive: true } });
    //     const dynamicEntities: Function[] = [];

    //     for (const template of templates) {
    //         const entityClass = ZoiEntityBuilder.createFromJsonSchema(template.schema);
    //         dynamicEntities.push(entityClass);
    //     }

    //     return dynamicEntities;
    // }
}
