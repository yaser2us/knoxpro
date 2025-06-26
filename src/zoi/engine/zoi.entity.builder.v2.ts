// src/zoi/engine/zoi.entity.builder.ts - COMPLETE VERSION
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import 'reflect-metadata';

// Import the actual entity classes we'll reference
import { User, Workspace } from '../../core/entity';

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

/**
 * Enhanced naming convention utilities with backward compatibility
 */
class NamingConventions {
    /**
     * Convert any string to snake_case for database tables
     */
    static toSnakeCase(str: string): string {
        return str
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .replace(/^_/, '');
    }

    /**
     * Convert any string to PascalCase for entity class names
     */
    static toPascalCase(str: string): string {
        return str
            .split(/[-_]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }

    /**
     * Convert any string to kebab-case for JSON-API types
     */
    static toKebabCase(str: string): string {
        return str
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
            .replace(/^-/, '')
            .replace(/_/g, '-');
    }

    /**
     * Enhanced name generation with proper pluralization and validation
     */
    static generateNames(schemaType: string) {
        // 🔧 ENHANCED: Better word extraction and normalization
        const words = this.extractWords(schemaType);
        const baseType = words.join('_').toLowerCase();

        const names = {
            // Database table name (snake_case, plural)
            tableName: this.pluralize(this.toSnakeCase(baseType)),

            // Entity class name (PascalCase, singular)
            entityName: this.toPascalCase(baseType),

            // JSON-API type (kebab-case, plural)
            jsonApiType: this.pluralize(this.toKebabCase(baseType)),

            // Raw type for reference
            rawType: schemaType
        };

        // 🔧 ENHANCED: Validation logging (internal only)
        this.validateNaming(names, schemaType);

        return names;
    }

    /**
     * 🆕 ENHANCED: Better word extraction from any format
     */
    private static extractWords(input: string): string[] {
        return input
            .replace(/([a-z])([A-Z])/g, '$1 $2')  // Split camelCase
            .replace(/[-_]/g, ' ')                // Replace separators
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 0);
    }

    /**
     * 🆕 ENHANCED: Proper pluralization
     */
    private static pluralize(word: string): string {
        // Handle special cases
        const irregularPlurals: Record<string, string> = {
            'person': 'people',
            'child': 'children',
            'man': 'men',
            'woman': 'women',
            'test': 'tests',      // Keep "test" -> "tests"
            'data': 'data'        // "data" is already plural
        };

        const lowerWord = word.toLowerCase();
        if (irregularPlurals[lowerWord]) {
            return this.preserveCase(word, irregularPlurals[lowerWord]);
        }

        // Regular pluralization rules
        if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') ||
            word.endsWith('ch') || word.endsWith('sh')) {
            return word + 'es';
        }

        if (word.endsWith('y') && !/[aeiou]y$/.test(word)) {
            return word.slice(0, -1) + 'ies';
        }

        if (word.endsWith('f')) {
            return word.slice(0, -1) + 'ves';
        }

        if (word.endsWith('fe')) {
            return word.slice(0, -2) + 'ves';
        }

        return word + 's';
    }

    /**
     * 🆕 ENHANCED: Preserve case pattern
     */
    private static preserveCase(original: string, replacement: string): string {
        if (original === original.toUpperCase()) {
            return replacement.toUpperCase();
        }
        if (original === original.toLowerCase()) {
            return replacement.toLowerCase();
        }
        if (original.charAt(0) === original.charAt(0).toUpperCase()) {
            return replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase();
        }
        return replacement;
    }

    /**
     * 🆕 ENHANCED: Internal validation (doesn't break API)
     */
    private static validateNaming(names: any, schemaType: string) {
        const issues: string[] = [];

        // Check table name format
        if (!/^[a-z][a-z0-9_]*$/.test(names.tableName)) {
            issues.push(`Table name '${names.tableName}' should be lowercase snake_case`);
        }

        // Check entity name format  
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(names.entityName)) {
            issues.push(`Entity name '${names.entityName}' should be PascalCase`);
        }

        // Check JSON-API type format
        if (!/^[a-z][a-z0-9-]*$/.test(names.jsonApiType)) {
            issues.push(`JSON-API type '${names.jsonApiType}' should be lowercase kebab-case`);
        }

        if (issues.length > 0) {
            console.warn(`[zoi] 🔍 Naming validation issues for '${schemaType}':`, issues);
        } else {
            console.log(`[zoi] ✅ Naming validation passed for '${schemaType}':`, {
                table: names.tableName,
                entity: names.entityName,
                jsonApi: names.jsonApiType
            });
        }
    }
}

////////////

// 🔥 BULLETPROOF NAMING SYSTEM - NO MORE WASTED DAYS!
// src/zoi/naming/bulletproof.naming.ts

/**
 * 🛡️ BULLETPROOF NAMING SYSTEM
 * 
 * After wasting 2 days on naming issues, this system ensures:
 * ✅ ONE source of truth for all naming
 * ✅ Automatic validation and error prevention  
 * ✅ Clear debugging when things go wrong
 * ✅ Zero ambiguity about which name to use where
 */

interface BulletproofNaming {
    // Input
    original: string;

    // Generated (THESE ARE THE ONLY NAMES YOU EVER USE)
    database: {
        tableName: string;           // blood_tests - ONLY for raw SQL
        columnPrefix?: string;       // blood_test_ - for foreign keys
    };

    typeorm: {
        entityName: string;          // BloodTest - ONLY for TypeORM classes
        repositoryName: string;      // BloodTestRepository
    };

    jsonapi: {
        resourceType: string;        // blood-tests - ONLY for API endpoints
        endpoint: string;            // /api/blood-tests
    };

    service: {
        className: string;           // BloodTestService
        methods: {
            findAll: string;         // findBloodTests
            findOne: string;         // findBloodTest
            create: string;          // createBloodTest
            update: string;          // updateBloodTest
            delete: string;          // deleteBloodTest
        };
    };

    // Meta
    validation: {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    };
}

export class BBulletproofNaming {
    private static readonly NAMING_CACHE = new Map<string, BulletproofNaming>();

    /**
     * 🎯 MAIN METHOD: Get bulletproof naming for any schema
     * 
     * This is the ONLY method you need to call.
     * It handles everything and tells you exactly what name to use where.
     */
    static generate(schemaType: string): BulletproofNaming {
        // Check cache first
        if (this.NAMING_CACHE.has(schemaType)) {
            return this.NAMING_CACHE.get(schemaType)!;
        }

        console.log(`🔧 [BULLETPROOF] Generating naming for: "${schemaType}"`);

        // Extract and normalize words
        const words = this.extractWords(schemaType);
        const baseWord = words.join('_').toLowerCase();

        // Generate all naming variations
        const naming: BulletproofNaming = {
            original: schemaType,

            database: {
                tableName: this.pluralize(this.toSnakeCase(baseWord)),
                columnPrefix: this.toSnakeCase(baseWord) + '_'
            },

            typeorm: {
                entityName: this.toPascalCase(baseWord),
                repositoryName: this.toPascalCase(baseWord) + 'Repository'
            },

            jsonapi: {
                resourceType: this.pluralize(this.toKebabCase(baseWord)),
                endpoint: '/api/' + this.pluralize(this.toKebabCase(baseWord))
            },

            service: {
                className: this.toPascalCase(baseWord) + 'Service',
                methods: {
                    findAll: 'find' + this.pluralize(this.toPascalCase(baseWord)),
                    findOne: 'find' + this.toPascalCase(baseWord),
                    create: 'create' + this.toPascalCase(baseWord),
                    update: 'update' + this.toPascalCase(baseWord),
                    delete: 'delete' + this.toPascalCase(baseWord)
                }
            },

            validation: this.validateNaming(schemaType, baseWord)
        };

        // Cache it
        this.NAMING_CACHE.set(schemaType, naming);

        // Log the results
        this.logNamingResult(naming);

        // Throw error if validation failed
        if (!naming.validation.isValid) {
            throw new Error(`🚨 BULLETPROOF NAMING FAILED for "${schemaType}": ${naming.validation.errors.join(', ')}`);
        }

        return naming;
    }

    /**
     * 🔍 DEBUGGING: When things go wrong, call this
     */
    static debug(schemaType: string): void {
        console.log('\n🔍 BULLETPROOF NAMING DEBUG');
        console.log('='.repeat(50));

        try {
            const naming = this.generate(schemaType);

            console.log('✅ VALIDATION: PASSED');
            console.log('\n📋 USE THESE NAMES:');
            console.log(`Database Table:     ${naming.database.tableName}`);
            console.log(`TypeORM Entity:     ${naming.typeorm.entityName}`);
            console.log(`JSON-API Type:      ${naming.jsonapi.resourceType}`);
            console.log(`API Endpoint:       ${naming.jsonapi.endpoint}`);
            console.log(`Service Class:      ${naming.service.className}`);

            console.log('\n🧪 CODE EXAMPLES:');
            console.log(`// Raw SQL:`);
            console.log(`SELECT * FROM ${naming.database.tableName};`);
            console.log(`\n// TypeORM:`);
            console.log(`const entity = new ${naming.typeorm.entityName}();`);
            console.log(`const repo = getRepository(${naming.typeorm.entityName});`);
            console.log(`\n// JSON-API:`);
            console.log(`fetch('${naming.jsonapi.endpoint}');`);
            console.log(`\n// Service:`);
            console.log(`const service = new ${naming.service.className}();`);
            console.log(`await service.${naming.service.methods.findAll}();`);

            if (naming.validation.warnings.length > 0) {
                console.log('\n⚠️  WARNINGS:');
                naming.validation.warnings.forEach(w => console.log(`  - ${w}`));
            }

        } catch (error) {
            console.log('❌ VALIDATION: FAILED');
            console.log(`Error: ${error.message}`);

            // Show what went wrong
            console.log('\n🔧 DEBUGGING INFO:');
            console.log(`Input: "${schemaType}"`);
            console.log(`Words extracted: ${this.extractWords(schemaType)}`);
        }

        console.log('='.repeat(50));
    }

    /**
     * 🚀 QUICK REFERENCE: Get specific name type
     */
    static getTableName(schemaType: string): string {
        return this.generate(schemaType).database.tableName;
    }

    static getEntityName(schemaType: string): string {
        return this.generate(schemaType).typeorm.entityName;
    }

    static getJsonApiType(schemaType: string): string {
        return this.generate(schemaType).jsonapi.resourceType;
    }

    static getServiceName(schemaType: string): string {
        return this.generate(schemaType).service.className;
    }

    /**
     * 🛠️ INTERNAL: Word extraction
     */
    private static extractWords(input: string): string[] {
        const words = input
            .replace(/([a-z])([A-Z])/g, '$1 $2')  // camelCase -> camel Case
            .replace(/[-_]/g, ' ')                // Replace separators
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 0);

        if (words.length === 0) {
            throw new Error(`🚨 BULLETPROOF NAMING: Could not extract words from "${input}"`);
        }

        return words;
    }

    /**
     * 🛠️ INTERNAL: Case conversions
     */
    private static toSnakeCase(str: string): string {
        return str.replace(/\s+/g, '_').toLowerCase();
    }

    private static toPascalCase(str: string): string {
        return str.split(/[-_\s]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }

    private static toKebabCase(str: string): string {
        return str.replace(/\s+/g, '-').toLowerCase();
    }

    /**
     * 🛠️ INTERNAL: Pluralization (enhanced for common cases)
     */
    private static pluralize(word: string): string {
        const irregulars: Record<string, string> = {
            'person': 'people',
            'child': 'children',
            'man': 'men',
            'woman': 'women',
            'test': 'tests',
            'data': 'data',
            'info': 'info'
        };

        const lower = word.toLowerCase();
        if (irregulars[lower]) {
            return this.preserveCase(word, irregulars[lower]);
        }

        // Standard rules
        if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') ||
            word.endsWith('ch') || word.endsWith('sh')) {
            return word + 'es';
        }

        if (word.endsWith('y') && !/[aeiou]y$/.test(word)) {
            return word.slice(0, -1) + 'ies';
        }

        return word + 's';
    }

    private static preserveCase(original: string, replacement: string): string {
        if (original === original.toUpperCase()) return replacement.toUpperCase();
        if (original === original.toLowerCase()) return replacement.toLowerCase();
        if (original[0] === original[0].toUpperCase()) {
            return replacement[0].toUpperCase() + replacement.slice(1).toLowerCase();
        }
        return replacement;
    }

    /**
     * 🛠️ INTERNAL: Validation
     */
    private static validateNaming(schemaType: string, baseWord: string): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    } {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Critical errors
        if (!schemaType || schemaType.trim().length === 0) {
            errors.push('Schema type cannot be empty');
        }

        if (!baseWord || baseWord.trim().length === 0) {
            errors.push('Could not generate base word from schema type');
        }

        if (schemaType.length < 2) {
            errors.push('Schema type too short (minimum 2 characters)');
        }

        // Warnings
        if (schemaType.includes(' ')) {
            warnings.push('Schema type contains spaces - consider using camelCase or PascalCase');
        }

        if (schemaType.endsWith('s') && !['test', 'class', 'process'].some(suffix => schemaType.toLowerCase().endsWith(suffix))) {
            warnings.push('Schema type appears to be plural - entities should be singular');
        }

        if (schemaType.includes('_') && schemaType.includes('-')) {
            warnings.push('Schema type mixes snake_case and kebab-case - choose one format');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * 🛠️ INTERNAL: Logging
     */
    private static logNamingResult(naming: BulletproofNaming): void {
        if (naming.validation.isValid) {
            console.log(`✅ [BULLETPROOF] Generated naming for "${naming.original}":`);
            console.log(`   Database: ${naming.database.tableName}`);
            console.log(`   TypeORM:  ${naming.typeorm.entityName}`);
            console.log(`   JSON-API: ${naming.jsonapi.resourceType}`);
        } else {
            console.error(`❌ [BULLETPROOF] Failed to generate naming for "${naming.original}":`, naming.validation.errors);
        }

        if (naming.validation.warnings.length > 0) {
            console.warn(`⚠️  [BULLETPROOF] Warnings:`, naming.validation.warnings);
        }
    }

    /**
     * 🧹 UTILITY: Clear cache (for testing)
     */
    static clearCache(): void {
        this.NAMING_CACHE.clear();
        console.log('🧹 [BULLETPROOF] Naming cache cleared');
    }

    /**
     * 📊 UTILITY: Get all cached naming
     */
    static getAllNaming(): Record<string, BulletproofNaming> {
        const result: Record<string, BulletproofNaming> = {};
        this.NAMING_CACHE.forEach((naming, key) => {
            result[key] = naming;
        });
        return result;
    }
}

/**
 * 🧪 TESTING: Verify the bulletproof system works
 */
export class BulletproofTesting {
    static runTests(): void {
        console.log('\n🧪 BULLETPROOF NAMING TESTS');
        console.log('='.repeat(40));
        
        const testCases = [
            'BloodTest',
            'blood_test', 
            'blood-test',
            'employeeOnboardingForm',
            'ComplexEntityName',
            'test',
            'data'
        ];
        
        testCases.forEach(testCase => {
            try {
                console.log(`\n📋 Testing: "${testCase}"`);
                const naming = BBulletproofNaming.generate(testCase);
                console.log(`  ✅ Database: ${naming.database.tableName}`);
                console.log(`  ✅ TypeORM:  ${naming.typeorm.entityName}`);
                console.log(`  ✅ JSON-API: ${naming.jsonapi.resourceType}`);
            } catch (error) {
                console.log(`  ❌ FAILED: ${error.message}`);
            }
        });
        
        console.log('\n🎯 NO MORE WASTED DAYS!');
    }
}
BulletproofTesting.runTests();
/**
 * 🚀 INTEGRATION: Drop-in replacement for your ZoiEntityBuilder
 */

export class ZoiEntityBuilder {
    // Store generated entities to reference them in relationships
    // private static generatedEntities = new Map<string, Function>();

    // Store generated entities to reference them in relationships
    private static generatedEntities = new Map<string, Function>();

    // 🆕 ENHANCED: Internal naming registry (doesn't affect API)
    private static namingRegistry = new Map<string, any>();

    // 🔧 SAME API: No changes to the return signature!
    static createFromJsonSchema(schema: EntitySchema): Function[] {
        console.log("[zoi] Creating entities from schema:", schema.type);

        // 🎯 USE BULLETPROOF NAMING - NO MORE GUESSING!
        // const names = BBulletproofNaming.generate(schema.type);
        // 🔧 ENHANCED: Generate proper names with validation
        const names = NamingConventions.generateNames(schema.type);

        // 🆕 ENHANCED: Store naming info internally for debugging/future use
        this.namingRegistry.set(schema.type, names);

        // console.log(`[zoi] Enhanced naming for '${schema.type}':`, {
        //     tableName: names.database.tableName,
        //     entityName: names.typeorm.entityName,
        //     jsonApiType: names.jsonapi.resourceType
        // });

        const entities: Function[] = [];

        try {
            // Always create main entity first
            const mainEntity = this.createMainEntity(schema, names);
            entities.push(mainEntity);

            // Store it for relationship references
            this.generatedEntities.set(schema.type, mainEntity);

            // Create workflow-specific entities if needed
            if (schema.workflow && this.needsWorkflowTable(schema.workflow)) {
                const workflowEntity = this.createWorkflowEntity(schema, names);
                if (workflowEntity) {
                    entities.push(workflowEntity);

                    // Store workflow entity too
                    const workflowEntityName = this.getWorkflowEntityName(schema, schema.workflow.type);
                    this.generatedEntities.set(workflowEntityName, workflowEntity);
                }
            }

            console.log(`[zoi] ✅ Generated ${entities.length} entities for ${schema.type}`);
            return entities;

        } catch (error) {
            console.error(`[zoi] ❌ Error creating entities for ${schema.type}:`, error);
            return [];
        }
    }

    // 🔧 ENHANCED: Updated to use naming parameter
    private static createMainEntity(schema: EntitySchema, names: any): Function {
        const entityClass = class {
            id!: string;
            createdAt!: Date;
            updatedAt!: Date;
        };

        // Setup all properties (unchanged)
        this.setupMainEntityProperties(entityClass, schema);

        // 🔧 ENHANCED: Apply decorators with proper naming
        this.applyBasicDecorators(entityClass, schema, names);
        this.applyColumnDecorators(entityClass, schema);
        this.applyRelationshipDecorators(entityClass, schema);

        return entityClass;
    }

    // 🔧 ENHANCED: Updated signature to accept names
    private static applyBasicDecorators(entityClass: Function, schema: EntitySchema, names: any) {
        // Primary key and timestamps (unchanged)
        PrimaryGeneratedColumn('uuid')(entityClass.prototype, 'id');
        CreateDateColumn()(entityClass.prototype, 'createdAt');
        UpdateDateColumn()(entityClass.prototype, 'updatedAt');

        console.log(`[zoi] names`, names)

        // Workspace relationship (if scoped) - keep nullable for backward compatibility
        if (schema.workspace_scoped) {
            ManyToOne(() => Workspace, {
                nullable: true,
                onDelete: 'RESTRICT'
            })(entityClass.prototype, 'workspace');
            JoinColumn({ name: 'workspace_id' })(entityClass.prototype, 'workspace');
        }

        // 🔧 CRITICAL FIX: Use proper table name from names object
        Entity({
            name: names.tableName  // 👈 Use generated table name, not hard-coded
        })(entityClass);

        // 🔧 CRITICAL FIX: Set proper entity class name
        Object.defineProperty(entityClass, 'name', {
            value: names.entityName,  // 👈 Use entity name, not table name
            configurable: true
        });

        console.log(`[zoi] 📝 Entity applied: ${names.entityName} -> table: ${names.tableName}`);
    }

    // 🔧 ENHANCED: Updated to use naming parameter  
    private static createWorkflowEntity(schema: EntitySchema, mainNames: any): Function | null {
        if (!schema.workflow) return null;

        // 🔧 ENHANCED: Generate workflow-specific names
        const workflowSuffix = this.getWorkflowSuffix(schema.workflow.type);
        const workflowNames = {
            tableName: schema.workflow.creates_table || `${mainNames.tableName}_${workflowSuffix}`,
            entityName: `${mainNames.entityName}${this.getWorkflowEntitySuffix(schema.workflow.type)}`,
            jsonApiType: `${mainNames.jsonApiType}-${workflowSuffix}`
        };

        // Store workflow naming
        const workflowKey = `${schema.type}_${schema.workflow.type}`;
        this.namingRegistry.set(workflowKey, workflowNames);

        switch (schema.workflow.type) {
            case 'signature_approval':
                return this.createSignatureEntity(schema, workflowNames);
            // case 'approval_chain':
            //     return this.createApprovalEntity(schema, workflowNames);
            // case 'scheduled_process':
            //     return this.createProcessLogEntity(schema, workflowNames);
            // case 'conditional_routing':
            //     return this.createActionLogEntity(schema, workflowNames);
            default:
                console.warn(`[zoi] Unknown workflow type: ${schema.workflow.type}`);
                return null;
        }
    }

    // 🆕 ENHANCED: Get workflow suffix for table names
    private static getWorkflowSuffix(workflowType: string): string {
        switch (workflowType) {
            case 'signature_approval': return 'signatures';
            case 'approval_chain': return 'approvals';
            case 'scheduled_process': return 'process_logs';
            case 'conditional_routing': return 'actions';
            default: return 'workflow_items';
        }
    }

    // 🆕 ENHANCED: Get workflow entity suffix for class names
    private static getWorkflowEntitySuffix(workflowType: string): string {
        switch (workflowType) {
            case 'signature_approval': return 'Signature';
            case 'approval_chain': return 'Approval';
            case 'scheduled_process': return 'ProcessLog';
            case 'conditional_routing': return 'ActionLog';
            default: return 'WorkflowItem';
        }
    }

    // 🔧 ENHANCED: Updated to use naming parameter
    private static createSignatureEntity(schema: EntitySchema, workflowNames: any): Function {
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
        this.applyWorkflowEntityDecorators(signatureClass, schema, workflowNames, signatureFields);

        return signatureClass;
    }

    // Similar updates for other workflow entity creation methods...
    // (createApprovalEntity, createProcessLogEntity, createActionLogEntity)

    // 🔧 ENHANCED: Updated to use naming parameter
    private static applyWorkflowEntityDecorators(
        entityClass: Function,
        schema: EntitySchema,
        workflowNames: any,
        fields: Record<string, FieldDefinition>
    ) {
        // Basic decorators (unchanged)
        PrimaryGeneratedColumn('uuid')(entityClass.prototype, 'id');
        CreateDateColumn()(entityClass.prototype, 'createdAt');
        UpdateDateColumn()(entityClass.prototype, 'updatedAt');

        // Apply field columns (unchanged)
        for (const [fieldName, fieldDef] of Object.entries(fields)) {
            this.applyColumnDecorator(entityClass, fieldName, fieldDef, fieldDef.nullable !== true);
        }

        // Relationship decorators - ALL NULLABLE (unchanged)
        ManyToOne(() => User, { nullable: true })(entityClass.prototype, 'user');
        JoinColumn({ name: 'user_id' })(entityClass.prototype, 'user');

        // Get the main entity class
        const mainEntity = this.generatedEntities.get(schema.type);
        if (mainEntity) {
            ManyToOne(() => mainEntity, { nullable: true })(entityClass.prototype, schema.type.toLowerCase());
            JoinColumn({ name: `${schema.type.toLowerCase()}_id` })(entityClass.prototype, schema.type.toLowerCase());
        }

        // Workspace relationship if scoped - NULLABLE
        if (schema.workspace_scoped) {
            ManyToOne(() => Workspace, { nullable: true })(entityClass.prototype, 'workspace');
            JoinColumn({ name: 'workspace_id' })(entityClass.prototype, 'workspace');
        }

        // 🔧 ENHANCED: Use proper naming from workflowNames
        Entity({ name: workflowNames.tableName })(entityClass);

        Object.defineProperty(entityClass, 'name', {
            value: workflowNames.entityName,
            configurable: true
        });

        console.log(`[zoi] 📝 Workflow entity applied: ${workflowNames.entityName} -> table: ${workflowNames.tableName}`);
    }

    // 🆕 ENHANCED: Utility method to get naming info (for debugging/integration)
    static getNamingInfo(schemaType: string): any {
        return this.namingRegistry.get(schemaType);
    }

    // 🆕 ENHANCED: Get all generated naming info
    static getAllNamingInfo(): Map<string, any> {
        return new Map(this.namingRegistry);
    }

    // 🆕 ENHANCED: Get JSON-API type mapping for integration
    static getJsonApiTypeMapping(): Record<string, string> {
        const mapping: Record<string, string> = {};

        for (const [schemaType, names] of this.namingRegistry) {
            mapping[names.entityName] = names.jsonApiType;
        }

        return mapping;
    }

    // ... rest of your existing methods remain exactly the same ...

    private static needsWorkflowTable(workflow: WorkflowDefinition): boolean {
        const workflowsNeedingTables = [
            'signature_approval',
            'approval_chain',
            'scheduled_process',
            'conditional_routing'
        ];
        return workflowsNeedingTables.includes(workflow.type);
    }

    // ... all other existing methods remain unchanged ...

    /**
     * 🆕 ENHANCED: Clear all caches including naming registry
     */
    static clearCache(): void {
        this.generatedEntities.clear();
        this.namingRegistry.clear();
    }

    ///////////
    // static createFromJsonSchema(schema: EntitySchema): Function[] {
    //     console.log("[zoi] Creating entities from schema:", schema.type);

    //     const entities: Function[] = [];

    //     try {
    //         // Always create main entity first
    //         const mainEntity = this.createMainEntity(schema);
    //         entities.push(mainEntity);

    //         // Store it for relationship references
    //         this.generatedEntities.set(schema.type, mainEntity);

    //         // Create workflow-specific entities if needed
    //         if (schema.workflow && this.needsWorkflowTable(schema.workflow)) {
    //             const workflowEntity = this.createWorkflowEntity(schema);
    //             if (workflowEntity) {
    //                 entities.push(workflowEntity);

    //                 // Store workflow entity too
    //                 const workflowEntityName = this.getWorkflowEntityName(schema, schema.workflow.type);
    //                 this.generatedEntities.set(workflowEntityName, workflowEntity);
    //             }
    //         }

    //         console.log(`[zoi] Generated ${entities.length} entities for ${schema.type}`);
    //         return entities;

    //     } catch (error) {
    //         console.error(`[zoi] Error creating entities for ${schema.type}:`, error);
    //         return [];
    //     }
    // }

    // private static needsWorkflowTable(workflow: WorkflowDefinition): boolean {
    //     const workflowsNeedingTables = [
    //         'signature_approval',
    //         'approval_chain',
    //         'scheduled_process',
    //         'conditional_routing'
    //     ];

    //     return workflowsNeedingTables.includes(workflow.type);
    // }

    // private static createMainEntity(schema: EntitySchema): Function {
    //     const entityClass = class {
    //         id!: string;
    //         createdAt!: Date;
    //         updatedAt!: Date;
    //     };

    //     // Setup all properties
    //     this.setupMainEntityProperties(entityClass, schema);

    //     // Apply all decorators
    //     this.applyBasicDecorators(entityClass, schema);
    //     this.applyColumnDecorators(entityClass, schema);
    //     this.applyRelationshipDecorators(entityClass, schema);
    //     // this.applyWorkflowStatusField(entityClass, schema);

    //     return entityClass;
    // }

    // private static createWorkflowEntity(schema: EntitySchema): Function | null {
    //     if (!schema.workflow) return null;

    //     switch (schema.workflow.type) {
    //         case 'signature_approval':
    //             return this.createSignatureEntity(schema);
    //         case 'approval_chain':
    //             return this.createApprovalEntity(schema);
    //         case 'scheduled_process':
    //             return this.createProcessLogEntity(schema);
    //         case 'conditional_routing':
    //             return this.createActionLogEntity(schema);
    //         default:
    //             console.warn(`[zoi] Unknown workflow type: ${schema.workflow.type}`);
    //             return null;
    //     }
    // }

    // private static createSignatureEntity(schema: EntitySchema): Function {
    //     const signatureClass = class {
    //         id!: string;
    //         createdAt!: Date;
    //         updatedAt!: Date;
    //     };

    //     const signatureFields = {
    //         signature_step: { type: 'string' },
    //         signature_role: { type: 'string' },
    //         signature_data: { type: 'string', nullable: true },
    //         signed_at: { type: 'timestamp', nullable: true },
    //         notes: { type: 'text', nullable: true }
    //     };

    //     this.setupWorkflowEntityProperties(signatureClass, signatureFields, schema);
    //     this.applyWorkflowEntityDecorators(signatureClass, schema, 'signatures', signatureFields);

    //     return signatureClass;
    // }

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

    // private static applyBasicDecorators(entityClass: Function, schema: EntitySchema) {
    //     // Primary key and timestamps
    //     PrimaryGeneratedColumn('uuid')(entityClass.prototype, 'id');
    //     CreateDateColumn()(entityClass.prototype, 'createdAt');
    //     UpdateDateColumn()(entityClass.prototype, 'updatedAt');

    //     // Workspace relationship (if scoped) - MAKE NULLABLE TEMPORARILY
    //     if (schema.workspace_scoped) {
    //         ManyToOne(() => Workspace, {
    //             nullable: true,  // 👈 TEMPORARILY nullable to avoid conflicts
    //             onDelete: 'RESTRICT'
    //         })(entityClass.prototype, 'workspace');
    //         JoinColumn({ name: 'workspace_id' })(entityClass.prototype, 'workspace');
    //     }

    //     // 🔧 CRITICAL FIX: Use exact table name from database
    //     const tableName = 'blood_tests';  // 👈 Hardcode the correct table name

    //     Entity({
    //         name: tableName  // 👈 Explicit table name mapping
    //     })(entityClass);

    //     // 🔧 ALSO FIX: Entity class name should match table for SQL generation
    //     Object.defineProperty(entityClass, 'name', {
    //         value: tableName  // 👈 Use table name, not schema.type
    //     });


    //     // // Entity decorator
    //     // const tableName = schema.tableName || schema.type.toLowerCase();
    //     // Entity(tableName)(entityClass);

    //     // // Set class name for debugging
    //     // Object.defineProperty(entityClass, 'name', { value: schema.type });
    //     // // Object.defineProperty(entityClass, 'name', { value: 'blood_tests' });

    // }

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
        console.log(`[zoi] DEBUG: Applying relationships for ${schema.type}`);

        for (const relName in schema.relationships) {
            const rel = schema.relationships[relName];
            console.log(`[zoi] DEBUG: Processing relationship: ${relName} -> ${rel.target}`);

            if (rel.type === 'many_to_one') {
                // Get the target entity class
                const targetEntity = this.getEntityClass(rel.target);

                if (targetEntity) {
                    console.log(`[zoi] DEBUG: ✅ Adding ManyToOne relationship: ${relName} -> ${rel.target}`);
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
                    console.log(`[zoi] DEBUG: ✅ Adding OneToMany relationship: ${relName} -> ${rel.target}`);
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

    // private static applyWorkflowEntityDecorators(
    //     entityClass: Function,
    //     schema: EntitySchema,
    //     suffix: string,
    //     fields: Record<string, FieldDefinition>
    // ) {
    //     // Basic decorators
    //     PrimaryGeneratedColumn('uuid')(entityClass.prototype, 'id');
    //     CreateDateColumn()(entityClass.prototype, 'createdAt');
    //     UpdateDateColumn()(entityClass.prototype, 'updatedAt');

    //     // Apply field columns
    //     for (const [fieldName, fieldDef] of Object.entries(fields)) {
    //         this.applyColumnDecorator(entityClass, fieldName, fieldDef, fieldDef.nullable !== true);
    //     }

    //     // Relationship decorators - ALL NULLABLE for signature tables
    //     ManyToOne(() => User, { nullable: true })(entityClass.prototype, 'user');
    //     JoinColumn({ name: 'user_id' })(entityClass.prototype, 'user');

    //     // Get the main entity class
    //     const mainEntity = this.generatedEntities.get(schema.type);
    //     if (mainEntity) {
    //         ManyToOne(() => mainEntity, { nullable: true })(entityClass.prototype, schema.type.toLowerCase());
    //         JoinColumn({ name: `${schema.type.toLowerCase()}_id` })(entityClass.prototype, schema.type.toLowerCase());
    //     }

    //     // Workspace relationship if scoped - NULLABLE for signature tables
    //     if (schema.workspace_scoped) {
    //         ManyToOne(() => Workspace, { nullable: true })(entityClass.prototype, 'workspace');
    //         JoinColumn({ name: 'workspace_id' })(entityClass.prototype, 'workspace');
    //     }

    //     // Entity naming
    //     const tableName = schema.workflow?.creates_table || `${schema.tableName || schema.type.toLowerCase()}_${suffix}`;
    //     Entity(tableName)(entityClass);

    //     const className = this.getWorkflowEntityName(schema, schema.workflow?.type || '');
    //     Object.defineProperty(entityClass, 'name', { value: className });
    // }

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
            const entity = this.generatedEntities.get(entityName)!;
            console.log(`[zoi] DEBUG: Found generated entity: ${entity.name}`);
            return entity;
        }

        // // First check generated entities
        // if (this.generatedEntities.has(entityName)) {
        //     return this.generatedEntities.get(entityName)!;
        // }

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
    // static clearCache(): void {
    //     this.generatedEntities.clear();
    // }
}