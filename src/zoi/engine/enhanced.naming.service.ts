// src/zoi/engine/enhanced.naming.service.ts
export interface NamingContext {
    // Input
    schemaType: string;
    explicitTableName?: string;
    explicitJsonApiType?: string;

    // Generated names
    tableName: string;           // Database table name (snake_case)
    entityName: string;          // TypeORM entity class name (PascalCase)
    jsonApiType: string;         // JSON-API resource type (kebab-case)
    repositoryName: string;      // Repository class name

    // Metadata
    isWorkflowEntity: boolean;
    workflowSuffix?: string;
}

/**
 * Enhanced naming convention service that ensures perfect synchronization
 * between TypeORM entities, database tables, and JSON-API resource types
 */
export class EnhancedNamingService {

    /**
     * Creates a complete naming context from schema input
     */
    static createNamingContext(
        schemaType: string,
        options: {
            explicitTableName?: string;
            explicitJsonApiType?: string;
            isWorkflowEntity?: boolean;
            workflowSuffix?: string;
        } = {}
    ): NamingContext {

        const baseNames = this.generateBaseNames(schemaType);

        return {
            schemaType,
            explicitTableName: options.explicitTableName,
            explicitJsonApiType: options.explicitJsonApiType,

            // Use explicit names if provided, otherwise generate
            tableName: options.explicitTableName || baseNames.tableName,
            entityName: baseNames.entityName + (options.workflowSuffix || ''),
            jsonApiType: options.explicitJsonApiType || baseNames.jsonApiType,
            repositoryName: baseNames.entityName + 'Repository',

            isWorkflowEntity: options.isWorkflowEntity || false,
            workflowSuffix: options.workflowSuffix
        };
    }

    /**
     * Generate all base naming variations from a schema type
     */
    private static generateBaseNames(schemaType: string) {
        // Normalize input by cleaning separators and converting to word array
        const words = this.extractWords(schemaType);

        return {
            // Database table name: snake_case, pluralized
            tableName: this.toSnakeCase(words, true),

            // Entity class name: PascalCase, singular
            entityName: this.toPascalCase(words, false),

            // JSON-API type: kebab-case, pluralized
            jsonApiType: this.toKebabCase(words, true)
        };
    }

    /**
     * Extract words from any input format
     */
    private static extractWords(input: string): string[] {
        return input
            .replace(/([a-z])([A-Z])/g, '$1 $2')  // Split camelCase: camelCase -> camel Case
            .replace(/[-_]/g, ' ')                // Replace separators with spaces
            .toLowerCase()
            .split(/\s+/)                         // Split on whitespace
            .filter(word => word.length > 0);     // Remove empty strings
    }

    /**
     * Convert words to snake_case
     */
    private static toSnakeCase(words: string[], pluralize: boolean = false): string {
        let result = words.join('_');
        return pluralize ? this.pluralize(result) : result;
    }

    /**
     * Convert words to PascalCase
     */
    private static toPascalCase(words: string[], pluralize: boolean = false): string {
        let result = words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
        return pluralize ? this.pluralize(result) : result;
    }

    /**
     * Convert words to kebab-case
     */
    private static toKebabCase(words: string[], pluralize: boolean = false): string {
        let result = words.join('-');
        return pluralize ? this.pluralize(result) : result;
    }

    /**
     * Simple pluralization (can be enhanced with a proper library)
     */
    private static pluralize(word: string): string {
        // Handle special cases
        const irregularPlurals: Record<string, string> = {
            'person': 'people',
            'child': 'children',
            'man': 'men',
            'woman': 'women',
            'tooth': 'teeth',
            'foot': 'feet',
            'mouse': 'mice',
            'goose': 'geese'
        };

        const lowerWord = word.toLowerCase();
        if (irregularPlurals[lowerWord]) {
            // Preserve original case pattern
            return this.preserveCase(word, irregularPlurals[lowerWord]);
        }

        // Regular rules
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
     * Preserve case pattern when replacing words
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
     * Validate that names are properly synchronized
     */
    static validateNaming(context: NamingContext): { valid: boolean; issues: string[] } {
        const issues: string[] = [];

        // Check table name format
        if (!/^[a-z][a-z0-9_]*$/.test(context.tableName)) {
            issues.push(`Table name '${context.tableName}' should be lowercase snake_case`);
        }

        // Check entity name format
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(context.entityName)) {
            issues.push(`Entity name '${context.entityName}' should be PascalCase`);
        }

        // Check JSON-API type format
        if (!/^[a-z][a-z0-9-]*$/.test(context.jsonApiType)) {
            issues.push(`JSON-API type '${context.jsonApiType}' should be lowercase kebab-case`);
        }

        // Check consistency (convert back and compare)
        const wordsFromTable = context.tableName.split('_');
        const wordsFromJsonApi = context.jsonApiType.split('-');

        // Remove plural 's' for comparison
        const normalizeForComparison = (words: string[]) => {
            return words.map(word => word.replace(/s$/, '')).join('');
        };

        if (normalizeForComparison(wordsFromTable) !== normalizeForComparison(wordsFromJsonApi)) {
            issues.push(`Table name and JSON-API type are not consistent: '${context.tableName}' vs '${context.jsonApiType}'`);
        }

        return {
            valid: issues.length === 0,
            issues
        };
    }

    /**
     * Generate naming context for workflow entities
     */
    static createWorkflowNaming(mainContext: NamingContext, workflowType: string): NamingContext {
        const workflowSuffixes: Record<string, string> = {
            'signature_approval': 'Signature',
            'approval_chain': 'Approval',
            'scheduled_process': 'ProcessLog',
            'conditional_routing': 'ActionLog'
        };

        const suffix = workflowSuffixes[workflowType] || 'WorkflowItem';

        return this.createNamingContext(mainContext.schemaType, {
            isWorkflowEntity: true,
            workflowSuffix: suffix,
            explicitTableName: `${mainContext.tableName}_${this.toSnakeCase([suffix], false)}`
        });
    }

    /**
     * Get all naming contexts for a schema (main + workflow entities)
     */
    static getAllNamingContexts(
        schemaType: string,
        workflow?: { type: string }
    ): { main: NamingContext; workflow?: NamingContext } {

        const main = this.createNamingContext(schemaType);

        let workflowContext: NamingContext | undefined;
        if (workflow && this.needsWorkflowTable(workflow.type)) {
            workflowContext = this.createWorkflowNaming(main, workflow.type);
        }

        return { main, workflow: workflowContext };
    }

    private static needsWorkflowTable(workflowType: string): boolean {
        const workflowsNeedingTables = [
            'signature_approval',
            'approval_chain',
            'scheduled_process',
            'conditional_routing'
        ];
        return workflowsNeedingTables.includes(workflowType);
    }
}

// Usage Examples and Test Cases
export class NamingExamples {
    static runExamples() {
        console.log('=== Enhanced Naming Service Examples ===\n');

        // Example 1: Blood Test schema
        const bloodTestContext = EnhancedNamingService.createNamingContext('BloodTest');
        console.log('Blood Test Context:', bloodTestContext);
        console.log('Validation:', EnhancedNamingService.validateNaming(bloodTestContext));
        console.log();

        // Example 2: Complex name with workflow
        const { main, workflow } = EnhancedNamingService.getAllNamingContexts(
            'employee-onboarding-form',
            { type: 'signature_approval' }
        );
        console.log('Employee Onboarding Main:', main);
        console.log('Employee Onboarding Workflow:', workflow);
        console.log();

        // Example 3: Explicit overrides
        const customContext = EnhancedNamingService.createNamingContext('SomeComplexEntity', {
            explicitTableName: 'legacy_complex_table',
            explicitJsonApiType: 'custom-resource-type'
        });
        console.log('Custom Context:', customContext);
        console.log();

        // Example 4: Test various input formats
        const testInputs = [
            'BloodTest',           // PascalCase
            'blood_test',          // snake_case  
            'blood-test',          // kebab-case
            'blood test',          // space separated
            'complexEntityName',   // camelCase
            'BLOOD_TEST'          // SCREAMING_SNAKE_CASE
        ];

        console.log('=== Input Format Tests ===');
        testInputs.forEach(input => {
            const context = EnhancedNamingService.createNamingContext(input);
            console.log(`${input.padEnd(20)} -> Table: ${context.tableName.padEnd(20)} | Entity: ${context.entityName.padEnd(20)} | JSON-API: ${context.jsonApiType}`);
        });
    }
}
