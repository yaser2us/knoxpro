// src/zoi/engine/zoi.entity.builder.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import 'reflect-metadata';

const typeMap = {
  integer: 'int',
  number: 'float',
  string: 'varchar',
  boolean: 'boolean',
  timestamp: 'timestamp',
  text: 'text',
  date: 'date',
  jsonb: 'jsonb',
  object: 'jsonb',
  uuid: 'uuid'
} as const;

interface FieldDefinition {
  type: string;
  nullable?: boolean;
  enum?: string[];
  default?: any;
  maxLength?: number;
  format?: string;
}

interface RelationshipDefinition {
  type: 'many_to_one' | 'one_to_many' | 'many_to_many' | 'one_to_one';
  target: string;
  required?: boolean;
  inverse?: string;
}

interface WorkflowDefinition {
  type: string;
  creates_table?: string;
  steps?: Array<{
    name: string;
    required_signatures?: number;
    roles?: string[];
  }>;
}

interface EntitySchema {
  type: string;
  tableName?: string;
  workspace_scoped?: boolean;
  properties: Record<string, FieldDefinition>;
  required?: string[];
  relationships?: Record<string, RelationshipDefinition>;
  workflow?: WorkflowDefinition;
  jsonapi?: {
    type: string;
    include_relationships?: string[];
  };
}

export class ZoiEntityBuilder {
  static createFromJsonSchema(schema: EntitySchema): Function[] {
    console.log("[zoi] Creating entities from schema:", schema.type);
    
    const entities: Function[] = [];
    
    try {
      // Always create main entity
      const mainEntity = this.createMainEntity(schema);
      entities.push(mainEntity);
      
      // Create workflow-specific entities if needed
      if (schema.workflow && this.needsWorkflowTable(schema.workflow)) {
        const workflowEntity = this.createWorkflowEntity(schema);
        if (workflowEntity) {
          entities.push(workflowEntity);
        }
      }
      
      console.log(`[zoi] Generated ${entities.length} entities for ${schema.type}`);
      return entities;
      
    } catch (error) {
      console.error(`[zoi] Error creating entities for ${schema.type}:`, error);
      return [];
    }
  }

  private static needsWorkflowTable(workflow: WorkflowDefinition): boolean {
    const workflowsNeedingTables = [
      'signature_approval',
      'approval_chain', 
      'scheduled_process',
      'conditional_routing'
    ];
    
    return workflowsNeedingTables.includes(workflow.type);
  }

  private static createMainEntity(schema: EntitySchema): Function {
    const entityClass = class {
      id!: string;
      createdAt!: Date;
      updatedAt!: Date;
    };

    // Setup all properties
    this.setupMainEntityProperties(entityClass, schema);
    
    // Apply all decorators
    this.applyBasicDecorators(entityClass, schema);
    this.applyColumnDecorators(entityClass, schema);
    this.applyRelationshipDecorators(entityClass, schema);
    this.applyWorkflowStatusField(entityClass, schema);

    return entityClass;
  }

  private static createWorkflowEntity(schema: EntitySchema): Function | null {
    if (!schema.workflow) return null;

    switch (schema.workflow.type) {
      case 'signature_approval':
        return this.createSignatureEntity(schema);
      case 'approval_chain':
        return this.createApprovalEntity(schema);
      case 'scheduled_process':
        return this.createProcessLogEntity(schema);
      case 'conditional_routing':
        return this.createActionLogEntity(schema);
      default:
        console.warn(`[zoi] Unknown workflow type: ${schema.workflow.type}`);
        return null;
    }
  }

  private static createSignatureEntity(schema: EntitySchema): Function {
    const signatureClass = class {
      id!: string;
      createdAt!: Date;
      updatedAt!: Date;
    };

    const signatureFields = {
      signature_step: { type: 'string' },
      signature_role: { type: 'string' },
      signature_data: { type: 'string', nullable: true },
      signed_at: { type: 'timestamp', nullable: true },
      notes: { type: 'text', nullable: true }
    };

    this.setupWorkflowEntityProperties(signatureClass, signatureFields, schema);
    this.applyWorkflowEntityDecorators(signatureClass, schema, 'signatures', signatureFields);

    return signatureClass;
  }

  private static createApprovalEntity(schema: EntitySchema): Function {
    const approvalClass = class {
      id!: string;
      createdAt!: Date;
      updatedAt!: Date;
    };

    const approvalFields = {
      approval_step: { type: 'string' },
      approver_role: { type: 'string' },
      decision: { type: 'string' }, // 'approved', 'rejected', 'pending'
      decision_at: { type: 'timestamp', nullable: true },
      reason: { type: 'text', nullable: true }
    };

    this.setupWorkflowEntityProperties(approvalClass, approvalFields, schema);
    this.applyWorkflowEntityDecorators(approvalClass, schema, 'approvals', approvalFields);

    return approvalClass;
  }

  private static createProcessLogEntity(schema: EntitySchema): Function {
    const logClass = class {
      id!: string;
      createdAt!: Date;
      updatedAt!: Date;
    };

    const logFields = {
      process_step: { type: 'string' },
      action_type: { type: 'string' },
      triggered_by: { type: 'string' },
      executed_at: { type: 'timestamp', nullable: true },
      result_data: { type: 'jsonb', nullable: true }
    };

    this.setupWorkflowEntityProperties(logClass, logFields, schema);
    this.applyWorkflowEntityDecorators(logClass, schema, 'process_logs', logFields);

    return logClass;
  }

  private static createActionLogEntity(schema: EntitySchema): Function {
    const actionClass = class {
      id!: string;
      createdAt!: Date;
      updatedAt!: Date;
    };

    const actionFields = {
      action_step: { type: 'string' },
      action_type: { type: 'string' },
      action_data: { type: 'jsonb', nullable: true },
      performed_at: { type: 'timestamp', nullable: true }
    };

    this.setupWorkflowEntityProperties(actionClass, actionFields, schema);
    this.applyWorkflowEntityDecorators(actionClass, schema, 'actions', actionFields);

    return actionClass;
  }

  private static setupMainEntityProperties(entityClass: Function, schema: EntitySchema) {
    // Setup schema properties
    for (const key in schema.properties) {
      if (!['id', 'createdAt', 'updatedAt'].includes(key)) {
        Object.defineProperty(entityClass.prototype, key, {
          value: undefined,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
    }

    // Setup relationship properties
    if (schema.relationships) {
      for (const relName in schema.relationships) {
        const rel = schema.relationships[relName];
        
        // Add relationship property
        Object.defineProperty(entityClass.prototype, relName, {
          value: undefined,
          writable: true,
          enumerable: true,
          configurable: true,
        });
        
        // Add foreign key property for many_to_one relationships
        if (rel.type === 'many_to_one') {
          const fkName = `${relName}_id`;
          Object.defineProperty(entityClass.prototype, fkName, {
            value: undefined,
            writable: true,
            enumerable: true,
            configurable: true,
          });
        }
      }
    }

    // Add workflow relationship property
    if (schema.workflow && this.needsWorkflowTable(schema.workflow)) {
      const workflowPropName = this.getWorkflowPropertyName(schema.workflow.type);
      Object.defineProperty(entityClass.prototype, workflowPropName, {
        value: undefined,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }

    // Add workspace property if scoped
    if (schema.workspace_scoped) {
      Object.defineProperty(entityClass.prototype, 'workspace_id', {
        value: undefined,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
  }

  private static setupWorkflowEntityProperties(
    entityClass: Function, 
    fields: Record<string, FieldDefinition>, 
    schema: EntitySchema
  ) {
    // Setup workflow-specific fields
    for (const fieldName in fields) {
      Object.defineProperty(entityClass.prototype, fieldName, {
        value: undefined,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }

    // Setup relationship properties
    Object.defineProperty(entityClass.prototype, 'user', {
      value: undefined,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(entityClass.prototype, 'user_id', {
      value: undefined,
      writable: true,
      enumerable: true,
      configurable: true,
    });

    const mainEntityName = schema.type.toLowerCase();
    Object.defineProperty(entityClass.prototype, mainEntityName, {
      value: undefined,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(entityClass.prototype, `${mainEntityName}_id`, {
      value: undefined,
      writable: true,
      enumerable: true,
      configurable: true,
    });

    // Add workspace property if scoped
    if (schema.workspace_scoped) {
      Object.defineProperty(entityClass.prototype, 'workspace_id', {
        value: undefined,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
  }

  private static applyBasicDecorators(entityClass: Function, schema: EntitySchema) {
    // Primary key and timestamps
    PrimaryGeneratedColumn('uuid')(entityClass.prototype, 'id');
    CreateDateColumn()(entityClass.prototype, 'createdAt');
    UpdateDateColumn()(entityClass.prototype, 'updatedAt');

    // Workspace scoping
    if (schema.workspace_scoped) {
      Column({ type: 'uuid' })(entityClass.prototype, 'workspace_id');
    }

    // Entity decorator
    const tableName = schema.tableName || schema.type.toLowerCase();
    Entity(tableName)(entityClass);
    
    // Set class name for debugging
    Object.defineProperty(entityClass, 'name', { value: schema.type });
  }

  private static applyColumnDecorators(entityClass: Function, schema: EntitySchema) {
    for (const key in schema.properties) {
      if (['id', 'createdAt', 'updatedAt'].includes(key)) continue;
      
      const prop = schema.properties[key];
      const isRequired = schema.required?.includes(key) ?? false;
      
      this.applyColumnDecorator(entityClass, key, prop, isRequired);
    }
  }

  private static applyColumnDecorator(
    entityClass: Function, 
    fieldName: string, 
    prop: FieldDefinition, 
    isRequired: boolean
  ) {
    let columnDecorator;
    
    if (prop.enum) {
      // Enum columns
      columnDecorator = Column({
        type: 'varchar',
        nullable: !isRequired,
        enum: prop.enum,
        default: prop.default
      });
    } else if (prop.type === 'string' || prop.format === 'text') {
      // String/text columns
      const columnType = prop.format === 'text' ? 'text' : 'varchar';
      const options: any = {
        type: columnType,
        nullable: !isRequired
      };
      
      if (prop.maxLength && columnType === 'varchar') {
        options.length = prop.maxLength;
      }
      
      columnDecorator = Column(options);
    } else if (prop.type === 'integer') {
      columnDecorator = Column({
        type: 'int',
        nullable: !isRequired
      });
    } else if (prop.type === 'number') {
      columnDecorator = Column({
        type: 'float',
        nullable: !isRequired
      });
    } else if (prop.type === 'boolean') {
      columnDecorator = Column({
        type: 'boolean',
        nullable: !isRequired
      });
    } else if (prop.format === 'date') {
      columnDecorator = Column({
        type: 'date',
        nullable: !isRequired
      });
    } else if (prop.format === 'timestamp') {
      columnDecorator = Column({
        type: 'timestamp',
        nullable: !isRequired
      });
    } else if (prop.type === 'object' || prop.format === 'jsonb') {
      columnDecorator = Column({
        type: 'jsonb',
        nullable: !isRequired
      });
    } else {
      // Default to varchar
      columnDecorator = Column({
        type: 'varchar',
        nullable: !isRequired
      });
    }
    
    columnDecorator(entityClass.prototype, fieldName);
  }

  private static applyRelationshipDecorators(entityClass: Function, schema: EntitySchema) {
    if (!schema.relationships) return;

    for (const relName in schema.relationships) {
      const rel = schema.relationships[relName];
      
      if (rel.type === 'many_to_one') {
        const fkColumn = `${relName}_id`;
        
        // Foreign key column
        Column({ 
          type: 'uuid', 
          nullable: !rel.required
        })(entityClass.prototype, fkColumn);

        // Relationship decorator
        ManyToOne(rel.target, { nullable: !rel.required })(entityClass.prototype, relName);
        JoinColumn({ name: fkColumn })(entityClass.prototype, relName);
        
      } else if (rel.type === 'one_to_many') {
        // One-to-many relationship
        OneToMany(rel.target, rel.inverse || schema.type.toLowerCase())(entityClass.prototype, relName);
      }
      // Note: many_to_many and one_to_one can be added later if needed
    }

    // Add workflow relationship
    if (schema.workflow && this.needsWorkflowTable(schema.workflow)) {
      const workflowPropName = this.getWorkflowPropertyName(schema.workflow.type);
      const workflowEntityName = this.getWorkflowEntityName(schema, schema.workflow.type);
      
      OneToMany(workflowEntityName, schema.type.toLowerCase())(entityClass.prototype, workflowPropName);
    }
  }

  private static applyWorkflowStatusField(entityClass: Function, schema: EntitySchema) {
    if (!schema.workflow || !schema.workflow.steps) return;

    Object.defineProperty(entityClass.prototype, 'workflow_status', {
      value: undefined,
      writable: true,
      enumerable: true,
      configurable: true,
    });

    const possibleStatuses = schema.workflow.steps.map((step: any) => step.name);
    
    Column({ 
      type: 'varchar', 
      default: possibleStatuses[0] || 'pending'
    })(entityClass.prototype, 'workflow_status');
  }

  private static applyWorkflowEntityDecorators(
    entityClass: Function, 
    schema: EntitySchema, 
    suffix: string,
    fields: Record<string, FieldDefinition>
  ) {
    // Basic decorators
    PrimaryGeneratedColumn('uuid')(entityClass.prototype, 'id');
    CreateDateColumn()(entityClass.prototype, 'createdAt');
    UpdateDateColumn()(entityClass.prototype, 'updatedAt');

    // Workspace scoping
    if (schema.workspace_scoped) {
      Column({ type: 'uuid' })(entityClass.prototype, 'workspace_id');
    }

    // Apply field columns
    for (const [fieldName, fieldDef] of Object.entries(fields)) {
      this.applyColumnDecorator(entityClass, fieldName, fieldDef, fieldDef.nullable !== true);
    }

    // Foreign key columns
    Column({ type: 'uuid' })(entityClass.prototype, 'user_id');
    Column({ type: 'uuid' })(entityClass.prototype, `${schema.type.toLowerCase()}_id`);

    // Relationship decorators
    ManyToOne('User')(entityClass.prototype, 'user');
    JoinColumn({ name: 'user_id' })(entityClass.prototype, 'user');
    
    ManyToOne(schema.type)(entityClass.prototype, schema.type.toLowerCase());
    JoinColumn({ name: `${schema.type.toLowerCase()}_id` })(entityClass.prototype, schema.type.toLowerCase());

    // Entity naming
    const tableName = schema.workflow?.creates_table || `${schema.tableName || schema.type.toLowerCase()}_${suffix}`;
    Entity(tableName)(entityClass);
    
    const className = this.getWorkflowEntityName(schema, schema.workflow?.type || '');
    Object.defineProperty(entityClass, 'name', { value: className });
  }

  private static getWorkflowPropertyName(workflowType: string): string {
    switch (workflowType) {
      case 'signature_approval':
        return 'signatures';
      case 'approval_chain':
        return 'approvals';
      case 'scheduled_process':
        return 'process_logs';
      case 'conditional_routing':
        return 'actions';
      default:
        return 'workflow_items';
    }
  }

  private static getWorkflowEntityName(schema: EntitySchema, workflowType: string): string {
    switch (workflowType) {
      case 'signature_approval':
        return `${schema.type}Signature`;
      case 'approval_chain':
        return `${schema.type}Approval`;
      case 'scheduled_process':
        return `${schema.type}ProcessLog`;
      case 'conditional_routing':
        return `${schema.type}Action`;
      default:
        return `${schema.type}WorkflowItem`;
    }
  }
}

// static createFromJsonSchemaV1(schema: any): Function {
//   const fields: { [key: string]: any } = {};

//   console.log('Creating entity from schema:', schema);
//   // 1. Dynamically build the class with real fields
//   const entityClass = class {
//     id: string; // Ensure 'id' field statically exists
//   };

//   for (const key in schema.properties) {
//     const prop = schema.properties[key];

//     if (key !== 'id') {
//       // Dynamically define other fields
//       Object.defineProperty(entityClass.prototype, key, {
//         value: undefined,
//         writable: true,
//         enumerable: true,
//         configurable: true,
//       });
//     }
//   }
// //
//   // 2. Decorate fields with correct TypeORM decorators
//   PrimaryGeneratedColumn('uuid')(entityClass.prototype, 'id');

//   for (const key in schema.properties) {
//     if (key === 'id') continue;
//     const prop = schema.properties[key];

//     const isRequired = schema.required?.includes(key) ?? false;
//     const columnType = typeMap[prop.format] || typeMap[prop.type] || 'varchar';

//     Column({ type: columnType, nullable: !isRequired })(entityClass.prototype, key);
//   }

//   // 3. Decorate the class itself
//   Entity(schema.title.toLowerCase())(entityClass);

//   // 4. Rename the class nicely
//   Object.defineProperty(entityClass, 'name', { value: schema.title });

//   return entityClass;
// }
