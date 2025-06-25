// import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn, Not, IsNull } from 'typeorm';
// // import { JsonApiResource } from '@yaser2us/json-api-nestjs';
// import 'reflect-metadata';

// const typeMap = {
//   integer: 'int',
//   number: 'float', 
//   string: 'varchar',
//   boolean: 'bool',
//   timestamp: 'timestamp',
//   text: 'text',
//   date: 'date',
//   jsonb: 'jsonb',
//   object: 'jsonb'
// };

// export class ZoiEntityBuilder {
//   static createFromJsonSchema(schema: any): [Function, Function?] {
//     console.log("[zoi] Creating entity from schema:", schema);
    
//     // Create main entity class
//     const entityClass = this.createMainEntity(schema);
    
//     // Create signature entity class if workflow is defined
//     let signatureEntityClass;
//     if (schema.workflow && schema.signatures) {
//       signatureEntityClass = this.createSignatureEntity(schema);
//     }
    
//     return signatureEntityClass ? [entityClass, signatureEntityClass] : [entityClass];
//   }

//   private static createMainEntity(schema: any): Function {
//     const entityClass = class {
//       id: string;
//       createdAt: Date;
//       updatedAt: Date;
//     };

//     // Define properties on prototype
//     for (const key in schema.properties) {
//       const prop = schema.properties[key];
//       if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
//         Object.defineProperty(entityClass.prototype, key, {
//           value: undefined,
//           writable: true,
//           enumerable: true,
//           configurable: true,
//         });
//       }
//     }

//     // Add relationship properties
//     if (schema.relationships) {
//       for (const relName in schema.relationships) {
//         Object.defineProperty(entityClass.prototype, relName, {
//           value: undefined,
//           writable: true,
//           enumerable: true,
//           configurable: true,
//         });
//       }
//     }

//     // Add signatures relationship if workflow exists
//     if (schema.workflow) {
//       Object.defineProperty(entityClass.prototype, 'signatures', {
//         value: undefined,
//         writable: true,
//         enumerable: true,
//         configurable: true,
//       });
//     }

//     // Apply decorators
//     this.applyBasicDecorators(entityClass, schema);
//     this.applyColumnDecorators(entityClass, schema);
//     this.applyRelationshipDecorators(entityClass, schema);
//     this.applyJsonApiDecorators(entityClass, schema);

//     return entityClass;
//   }

//   private static createSignatureEntity(schema: any): Function {
//     const signatureClass = class {
//       id: string;
//       createdAt: Date;
//       updatedAt: Date;
//     };

//     const signatureSchema = schema.signatures;
//     const mainEntityName = schema.type;

//     // Define signature fields
//     for (const key in signatureSchema.fields) {
//       Object.defineProperty(signatureClass.prototype, key, {
//         value: undefined,
//         writable: true,
//         enumerable: true,
//         configurable: true,
//       });
//     }

//     // Add relationships to main entity and user
//     ['user', mainEntityName.toLowerCase(), 'user_id', `${mainEntityName.toLowerCase()}_id`].forEach(prop => {
//       Object.defineProperty(signatureClass.prototype, prop, {
//         value: undefined,
//         writable: true,
//         enumerable: true,
//         configurable: true,
//       });
//     });

//     // Apply decorators for signature entity
//     PrimaryGeneratedColumn('uuid')(signatureClass.prototype, 'id');
//     CreateDateColumn()(signatureClass.prototype, 'createdAt');
//     CreateDateColumn({ name: 'updated_at' })(signatureClass.prototype, 'updatedAt');

//     // Workspace scoping if enabled
//     if (schema.workspace_scoped) {
//       Object.defineProperty(signatureClass.prototype, 'workspace_id', {
//         value: undefined,
//         writable: true,
//         enumerable: true,
//         configurable: true,
//       });
//       Column('uuid')(signatureClass.prototype, 'workspace_id');
//     }

//     // Apply signature field columns
//     for (const key in signatureSchema.fields) {
//       const prop = signatureSchema.fields[key];
//       const columnType = typeMap[prop.format] || typeMap[prop.type] || 'varchar';
//       const isRequired = !prop.nullable;
      
//       Column({ 
//         type: columnType, 
//         nullable: !isRequired,
//         name: key 
//       })(signatureClass.prototype, key);
//     }

//     // Relationships
//     Column('uuid')(signatureClass.prototype, 'user_id');
//     Column('uuid')(signatureClass.prototype, `${mainEntityName.toLowerCase()}_id`);

//     // Entity and JsonApi decorators
//     const tableName = signatureSchema.table_name || `${schema.tableName || schema.type.toLowerCase()}_signatures`;
//     Entity(tableName)(signatureClass);
    
//     // if (schema.jsonapi) {
//     //   JsonApiResource({ type: `${schema.jsonapi.type}-signatures` })(signatureClass);
//     // }

//     Object.defineProperty(signatureClass, 'name', { 
//       value: `${schema.type}Signature` 
//     });

//     return signatureClass;
//   }

//   private static applyBasicDecorators(entityClass: Function, schema: any) {
//     // Basic entity decorators
//     PrimaryGeneratedColumn('uuid')(entityClass.prototype, 'id');
//     CreateDateColumn()(entityClass.prototype, 'createdAt');
//     CreateDateColumn({ name: 'updated_at' })(entityClass.prototype, 'updatedAt');

//     // Workspace scoping
//     if (schema.workspace_scoped) {
//       Object.defineProperty(entityClass.prototype, 'workspace_id', {
//         value: undefined,
//         writable: true,
//         enumerable: true,
//         configurable: true,
//       });
//       Column('uuid')(entityClass.prototype, 'workspace_id');
//     }

//     // Entity decorator
//     const tableName = schema.tableName || schema.type.toLowerCase();
//     Entity(tableName)(entityClass);
//     Object.defineProperty(entityClass, 'name', { value: schema.type });
//   }

//   private static applyColumnDecorators(entityClass: Function, schema: any) {
//     for (const key in schema.properties) {
//       if (['id', 'createdAt', 'updatedAt'].includes(key)) continue;
      
//       const prop = schema.properties[key];
//       const isRequired = schema.required?.includes(key) ?? false;
//       const columnType = typeMap[prop.format] || typeMap[prop.type] || 'varchar';

//       const columnOptions: any = { 
//         type: columnType, 
//         nullable: !isRequired 
//       };

//       // Handle enums
//       if (prop.enum) {
//         columnOptions.enum = prop.enum;
//         if (prop.default) {
//           columnOptions.default = prop.default;
//         }
//       }

//       // Handle max length
//       if (prop.maxLength) {
//         columnOptions.length = prop.maxLength;
//       }

//       Column(columnOptions)(entityClass.prototype, key);
//     }
//   }

//   private static applyRelationshipDecorators(entityClass: Function, schema: any) {
//     if (!schema.relationships) return;

//     for (const relName in schema.relationships) {
//       const rel = schema.relationships[relName];
      
//       if (rel.type === 'many_to_one') {
//         // Add foreign key column
//         const fkColumn = `${relName}_id`;
//         Object.defineProperty(entityClass.prototype, fkColumn, {
//           value: undefined,
//           writable: true,
//           enumerable: true,
//           configurable: true,
//         });
        
//         Column({ 
//           type: 'uuid', 
//           nullable: !rel.required,
//           name: fkColumn 
//         })(entityClass.prototype, fkColumn);

//         // Add relationship decorator
//         // Note: In real implementation, you'd need to resolve the target entity
//         // For now, we'll use string references
//         ManyToOne(rel.target, { nullable: !rel.required })(entityClass.prototype, relName);
//         JoinColumn({ name: fkColumn })(entityClass.prototype, relName);
//       }
//     }

//     // Add signatures relationship if workflow exists
//     if (schema.workflow) {
//       const signatureEntityName = `${schema.type}Signature`;
//       OneToMany(signatureEntityName, `${schema.type.toLowerCase()}`)(entityClass.prototype, 'signatures');
//     }
//   }

//   private static applyJsonApiDecorators(entityClass: Function, schema: any) {
//     if (schema.jsonapi) {
//       const jsonApiOptions: any = { type: schema.jsonapi.type };
      
//       if (schema.jsonapi.include_relationships) {
//         // Add include options if needed
//       }
      
//     //   JsonApiResource(jsonApiOptions)(entityClass);
//     }
//   }

//   // Helper method to validate workflow completion
//   static generateWorkflowHelpers(schema: any) {
//     if (!schema.workflow) return {};

//     return {
//       async isWorkflowComplete(entityId: string, signatureRepo: any) {
//         const workflow = schema.workflow;
        
//         for (const step of workflow.steps) {
//           const signatures = await signatureRepo.count({
//             where: {
//               [`${schema.type.toLowerCase()}_id`]: entityId,
//               signature_step: step.name,
//               signed_at: Not(IsNull())
//             }
//           });
          
//           if (signatures < step.required_signatures) {
//             return false;
//           }
//         }
        
//         return true;
//       },

//       async getWorkflowStatus(entityId: string, signatureRepo: any) {
//         const workflow = schema.workflow;
        
//         for (const step of workflow.steps) {
//           const signatures = await signatureRepo.count({
//             where: {
//               [`${schema.type.toLowerCase()}_id`]: entityId,
//               signature_step: step.name,
//               signed_at: Not(IsNull())
//             }
//           });
          
//           if (signatures < step.required_signatures) {
//             return {
//               current_step: step.name,
//               required: step.required_signatures,
//               completed: signatures,
//               status: 'pending'
//             };
//           }
//         }
        
//         return { status: 'completed' };
//       }
//     };
//   }
// }

// src/zoi/engine/zoi.entity.builder.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import 'reflect-metadata';

// Import the actual entity classes we'll reference
import { User, Workspace } from '../../pulse/entity';

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
  // Store generated entities to reference them in relationships
  private static generatedEntities = new Map<string, Function>();
  
  static createFromJsonSchema(schema: EntitySchema): Function[] {
    console.log("[zoi] Creating entities from schema:", schema.type);
    
    const entities: Function[] = [];
    
    try {
      // Always create main entity first
      const mainEntity = this.createMainEntity(schema);
      entities.push(mainEntity);
      
      // Store it for relationship references
      this.generatedEntities.set(schema.type, mainEntity);
      
      // Create workflow-specific entities if needed
      if (schema.workflow && this.needsWorkflowTable(schema.workflow)) {
        const workflowEntity = this.createWorkflowEntity(schema);
        if (workflowEntity) {
          entities.push(workflowEntity);
          
          // Store workflow entity too
          const workflowEntityName = this.getWorkflowEntityName(schema, schema.workflow.type);
          this.generatedEntities.set(workflowEntityName, workflowEntity);
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

    // Setup relationship properties (but NOT foreign key columns as properties)
    if (schema.relationships) {
      for (const relName in schema.relationships) {
        // Add relationship property
        Object.defineProperty(entityClass.prototype, relName, {
          value: undefined,
          writable: true,
          enumerable: true,
          configurable: true,
        });
        
        // Foreign key columns will be added automatically by TypeORM decorators
        // We don't expose them as properties for JSON-API
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

    // Add workspace property if scoped (as relationship, not attribute)
    if (schema.workspace_scoped) {
      Object.defineProperty(entityClass.prototype, 'workspace', {
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

    // Setup relationship properties (not foreign key columns)
    Object.defineProperty(entityClass.prototype, 'user', {
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

    // Add workspace relationship property if scoped
    if (schema.workspace_scoped) {
      Object.defineProperty(entityClass.prototype, 'workspace', {
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

    // Workspace relationship (if scoped)
    if (schema.workspace_scoped) {
      // Add workspace relationship using actual Workspace entity class
      ManyToOne(() => Workspace, { nullable: false })(entityClass.prototype, 'workspace');
      JoinColumn({ name: 'workspace_id' })(entityClass.prototype, 'workspace');
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
        // Get the target entity class
        const targetEntity = this.getEntityClass(rel.target);
        
        if (targetEntity) {
          // The foreign key column is created automatically by TypeORM
          ManyToOne(() => targetEntity, { nullable: !rel.required })(entityClass.prototype, relName);
          JoinColumn({ name: `${relName}_id` })(entityClass.prototype, relName);
        } else {
          console.warn(`[zoi] Target entity ${rel.target} not found for relationship ${relName}`);
        }
        
      } else if (rel.type === 'one_to_many') {
        // Get the target entity class
        const targetEntity = this.getEntityClass(rel.target);
        
        if (targetEntity) {
          OneToMany(() => targetEntity, rel.inverse || schema.type.toLowerCase())(entityClass.prototype, relName);
        } else {
          console.warn(`[zoi] Target entity ${rel.target} not found for relationship ${relName}`);
        }
      }
    }

    // Add workflow relationship
    if (schema.workflow && this.needsWorkflowTable(schema.workflow)) {
      const workflowPropName = this.getWorkflowPropertyName(schema.workflow.type);
      const workflowEntityName = this.getWorkflowEntityName(schema, schema.workflow.type);
      const workflowEntity = this.generatedEntities.get(workflowEntityName);
      
      if (workflowEntity) {
        OneToMany(() => workflowEntity, schema.type.toLowerCase())(entityClass.prototype, workflowPropName);
      }
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

    // Apply field columns
    for (const [fieldName, fieldDef] of Object.entries(fields)) {
      this.applyColumnDecorator(entityClass, fieldName, fieldDef, fieldDef.nullable !== true);
    }

    // Relationship decorators using actual entity classes
    ManyToOne(() => User)(entityClass.prototype, 'user');
    JoinColumn({ name: 'user_id' })(entityClass.prototype, 'user');
    
    // Get the main entity class
    const mainEntity = this.generatedEntities.get(schema.type);
    if (mainEntity) {
      ManyToOne(() => mainEntity)(entityClass.prototype, schema.type.toLowerCase());
      JoinColumn({ name: `${schema.type.toLowerCase()}_id` })(entityClass.prototype, schema.type.toLowerCase());
    }

    // Workspace relationship if scoped
    if (schema.workspace_scoped) {
      ManyToOne(() => Workspace)(entityClass.prototype, 'workspace');
      JoinColumn({ name: 'workspace_id' })(entityClass.prototype, 'workspace');
    }

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

  /**
   * Get entity class by name (for relationships)
   */
  private static getEntityClass(entityName: string): Function | null {
    // First check generated entities
    if (this.generatedEntities.has(entityName)) {
      return this.generatedEntities.get(entityName)!;
    }
    
    // Check static entities
    switch (entityName) {
      case 'User':
        return User;
      case 'Workspace':
        return Workspace;
      default:
        // Could add more static entities here as needed
        console.warn(`[zoi] Unknown entity type: ${entityName}`);
        return null;
    }
  }

  /**
   * Clear generated entities cache (useful for testing)
   */
  static clearCache(): void {
    this.generatedEntities.clear();
  }
}