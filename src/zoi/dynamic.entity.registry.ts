// src/zoi/dynamic-entity.registry.ts
import { EntitySchema } from 'typeorm';
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


export class DynamicEntityRegistry {

    private static entities: (Function | EntitySchema)[] = [
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
        WorkflowTemplate,
        WorkflowRun,
        WorkflowLog
    ];

    static register(entity: EntitySchema) {
        this.entities.push(entity);
    }

    static get getAllEntities(): (Function | EntitySchema)[] {
        return this.entities;
    }
}
