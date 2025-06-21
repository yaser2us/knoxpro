// ============================================
// STEP 2: ALTERNATIVE APPROACH WITH REQUEST INJECTION
// ============================================

// enhanced-user-context.pipe.ts (better approach)

import {
    Injectable,
    PipeTransform,
    ArgumentMetadata,
    Inject,
    Scope
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

// ============================================
// NORMALIZE FILTER OPERATORS
// ============================================

function normalizeFilterOperators(filters: any): any {
    if (!filters || typeof filters !== 'object') {
        return filters;
    }

    const normalized: any = {};

    Object.entries(filters).forEach(([field, operators]) => {
        if (operators && typeof operators === 'object') {
            const normalizedOperators: any = {};

            Object.entries(operators).forEach(([operator, value]) => {
                // Convert JSON API operators to library format
                switch (operator) {
                    case 'eq':
                        normalizedOperators.$eq = value;
                        break;
                    case 'ne':
                        normalizedOperators.$ne = value;
                        break;
                    case 'like':
                        normalizedOperators.$like = value;
                        break;
                    case 'in':
                        normalizedOperators.$in = value;
                        break;
                    case 'gt':
                        normalizedOperators.$gt = value;
                        break;
                    case 'lt':
                        normalizedOperators.$lt = value;
                        break;
                    case 'gte':
                        normalizedOperators.$gte = value;
                        break;
                    case 'lte':
                        normalizedOperators.$lte = value;
                        break;
                    // Already normalized operators
                    case '$eq':
                    case '$ne':
                    case '$like':
                    case '$in':
                    case '$gt':
                    case '$lt':
                    case '$gte':
                    case '$lte':
                        normalizedOperators[operator] = value;
                        break;
                    default:
                        // this.logger.warn(`⚠️ Unknown operator: ${operator}, keeping as-is`);
                        normalizedOperators[operator] = value;
                        break;
                }
            });

            normalized[field] = normalizedOperators;
        } else {
            // Simple value, wrap in $eq
            normalized[field] = { $eq: operators };
        }
    });

    // this.logger.debug('🔄 Normalized operators:', normalized);
    return normalized;
}

// ============================================
// OPTIONAL: Standalone structure normalizer (if needed elsewhere)
// ============================================

function normalizeFilterStructure(query: any): any {
    if (!query.filter?.target) {
        // Already in correct format or no filters
        return query;
    }

    const normalizedQuery = { ...query };
    normalizedQuery.filter = normalizeFilterOperators(query.filter.target);

    // this.logger.debug('🔄 Normalized filter structure from target to direct');
    return normalizedQuery;
}

function normalizeFilterStructureSort(query: any): any {
    if (!query.sort?.target) {
        // Already in correct format or no filters
        return query;
    }

    const normalizedQuery = { ...query };
    normalizedQuery.sort = normalizeFilterOperators(query.sort.target);

    // this.logger.debug('🔄 Normalized filter structure from target to direct');
    return normalizedQuery;
}

// ============================================
// TRANSFORMATION EXAMPLES
// ============================================

/*
EXAMPLE 1: Simple filter
INPUT (JSON API format):
{
  filter: {
    target: {
      name: { eq: "haft tie" }
    }
  }
}
 
OUTPUT (Library format):
{
  filter: {
    name: { $eq: "haft tie" },
    workspaceId: { $eq: "workspace123" },
    id: { $in: [1, 2, 3] }
  }
}
 
EXAMPLE 2: Complex filters
INPUT:
{
  filter: {
    target: {
      name: { like: "school" },
      students: { gt: 100 },
      status: { in: ["active", "pending"] }
    }
  }
}
 
OUTPUT:
{
  filter: {
    name: { $like: "school" },
    students: { $gt: 100 },
    status: { $in: ["active", "pending"] },
    workspaceId: { $eq: "workspace123" },
    id: { $in: [1, 2, 3] }
  }
}
 
EXAMPLE 3: Wildcard access (no ID filtering)
INPUT:
{
  filter: {
    target: {
      name: { eq: "bingo" }
    }
  }
}
 
OUTPUT (for wildcard user):
{
  filter: {
    name: { $eq: "bingo" },
    workspaceId: { $eq: "workspace123" }
    // No ID filtering for wildcard access
  }
}
*/

// ============================================
// CLEAN AND SIMPLE APPROACH
// ============================================

/*
BENEFITS OF THIS APPROACH:
 
✅ High-level solution - just normalize structure
✅ Preserves ALL original JSON API library features  
✅ Single point of filter transformation
✅ Works for all access scenarios (wildcard, specific, none)
✅ Easy to debug - clear transformation steps
✅ Minimal code changes required
✅ No need to reimplement JSON API features
 
HOW IT WORKS:
1. Extract filters from query.filter.target
2. Add access control filters (tenant, ID, user)
3. Convert operators (eq → $eq, like → $like, etc.)
4. Create new query with normalized filter structure
5. Pass to existing JSON API library
 
RESULT: Your library gets exactly the filter format it expects,
with all access control and user filters properly injected!
*/

@Injectable({ scope: Scope.REQUEST })
export class EnhancedUserContextPipe implements PipeTransform {

    constructor(
        @Inject(REQUEST) private readonly request: any
    ) { }

    transform(query: any, metadata: ArgumentMetadata): any {
        console.log('🚰 EnhancedUserContextPipe activated');
        console.log('📥 Original query:', JSON.stringify(query, null, 4));

        console.log('🔄 normalized', normalizeFilterStructureSort(query))

        try {
            console.log('👤 Request user:', this.request.user);
            console.log('🔗 Request headers:', this.request.headers);
            console.log('🔗 Request context:', this.request.context);

            // Create enhanced query with user context
            const enhancedQuery = {
                ...query,
                // ...normalizeFilterStructure(query),
                // ...normalizeFilterStructureSort(normalizeFilterStructure(query)),
                context: this.request.context || {}, // Use existing context or create a new one
                // context: {
                //     // User context from JWT
                //     userContext: this.request.user ? {
                //         id: this.request.user.id,
                //         workspaceId: this.request.user.workspaceId,
                //         roles: this.request.user.roles || [],
                //         email: this.request.user.email,
                //         permissions: this.request.user.permissions || [],
                //         // accessibleIds: ['1', '2', '3', '4', '5', '15', '17', '18', '19', '13', '11', '25', '27'], // Specific records user can access
                //     } : {
                //         id: 'user-456',
                //         roles: ['manager'],
                //         // accessibleIds: ['1', '2', '3', '4', '5', '15', '17', '18', '19', '13', '11', '25', '27'], // Specific records user can access
                //         departmentId: 42
                //     },

                //     // Request metadata
                //     requestId: this.request.headers['x-request-id'] || `req-${Date.now()}`,
                //     timestamp: new Date().toISOString(),
                //     userAgent: this.request.headers['user-agent'],

                //     // Network info
                //     ipAddress: this.request.ip || this.request.connection?.remoteAddress,
                //     origin: this.request.headers['origin'],

                //     // Tenant/workspace context
                //     tenantId: this.request.headers['x-tenant-id'] || this.request.user?.workspaceId,

                //     // API metadata
                //     apiVersion: this.request.headers['api-version'] || '1.0',
                //     endpoint: this.request.route?.path || this.request.url,
                //     method: this.request.method,

                //     // Security context
                //     sessionId: this.request.sessionID,
                //     csrfToken: this.request.headers['x-csrf-token'],

                //     // Feature flags (you could add async loading here)
                //     featureFlags: {
                //         // Default flags - you could make this dynamic
                //         enableAdvancedSearch: this.request.user?.roles?.includes('admin') || false,
                //         enableBetaFeatures: this.request.user?.roles?.includes('beta-tester') || false,
                //         enableAuditLogging: true
                //     }
                // }
                
                // "fields": null,
                // "filter": {
                //     "target": {
                //         "name": {
                //             "regexp": "Ya"
                //         }
                //     },
                //     "relation": null
                // },
                // "include": null,
                // "sort": {
                //         "name": "ASC"
                // },
                // "page": {
                //     "size": 20,
                //     "number": 1
                // }

            };

            console.log('✅ [wowo] pipes Successfully enhanced query with context');
            console.log('🔧 Context keys:', Object.keys(enhancedQuery));
            console.log('🔧 Context keys:', Object.keys(enhancedQuery.context));
            console.log('🔧 Context keys:', enhancedQuery.context);

            return enhancedQuery;

        } catch (error) {
            console.error('❌ Error in EnhancedUserContextPipe:', error);
            // Return original query on error
            return query;
        }
    }
}