// enhanced-user-context.pipe.ts
import {
    Injectable,
    PipeTransform,
    ArgumentMetadata,
    Inject,
    Scope
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PulseAccessService } from '../../pulse/pulse-access.service';

@Injectable({ scope: Scope.REQUEST })
export class EnhancedUserContextPipe implements PipeTransform {

    constructor(
        @Inject(REQUEST) private readonly request: any,
        @Inject() private readonly pulseAccessService: PulseAccessService
    ) { }

    async transform(query: any, metadata: ArgumentMetadata): Promise<any> {
        console.log('🚰 EnhancedUserContextPipe activated');
        console.log('📥 Original query:', query);

        try {
            console.log('👤 Request user:', this.request.user);
            console.log('🔗 Request headers:', this.request.headers);

            // Extract resource type from query or route
            const resourceType = query.resource || query.resourceType || this.extractResourceFromRoute();
            const workspaceId = query.workspaceId || this.request.user?.workspaceId;
            const userId = this.request.user?.id;

            console.log('🎯 Resource context:', { resourceType, workspaceId, userId });

            // Fetch accessible IDs dynamically
            let accessibleIds: string[] = [];
            
            if (resourceType && workspaceId) {
                try {
                    // Get all access IDs for this resource type in the workspace
                    const accessIds = await this.pulseAccessService.getAccessIdsByWorkspaceAndResource({
                        workspaceId,
                        resourceType
                    });

                    // Get specific resource IDs that the user can access
                    const userAccessibleResources = await this.getUserAccessibleResourceIds(
                        userId,
                        workspaceId,
                        resourceType
                    );

                    accessibleIds = [...accessIds, ...userAccessibleResources];
                    
                    console.log('✅ Fetched accessible IDs:', accessibleIds);
                } catch (error) {
                    console.error('❌ Error fetching accessible IDs:', error);
                    // Fallback to empty array or default IDs
                    accessibleIds = [];
                }
            }

            // Create enhanced query with user context
            const enhancedQuery = {
                ...query,
                context: {
                    // User context from JWT with dynamic access IDs
                    userContext: this.request.user ? {
                        id: this.request.user.id,
                        workspaceId: this.request.user.workspaceId,
                        roles: this.request.user.roles || [],
                        email: this.request.user.email,
                        permissions: this.request.user.permissions || [],
                        accessibleIds, // Dynamic IDs based on actual access grants
                        currentResourceType: resourceType,
                    } : {
                        id: 'anonymous',
                        roles: ['guest'],
                        accessibleIds: [], // Empty for anonymous users
                        currentResourceType: resourceType,
                    },

                    // Access control metadata
                    accessControl: {
                        resourceType,
                        workspaceId,
                        totalAccessibleIds: accessibleIds.length,
                        hasFullAccess: this.checkFullAccess(),
                        accessLevel: this.determineAccessLevel(),
                    },

                    // Request metadata
                    requestId: this.request.headers['x-request-id'] || `req-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    userAgent: this.request.headers['user-agent'],

                    // Network info
                    ipAddress: this.request.ip || this.request.connection?.remoteAddress,
                    origin: this.request.headers['origin'],

                    // Tenant/workspace context
                    tenantId: workspaceId,

                    // API metadata
                    apiVersion: this.request.headers['api-version'] || '1.0',
                    endpoint: this.request.route?.path || this.request.url,
                    method: this.request.method,

                    // Security context
                    sessionId: this.request.sessionID,
                    csrfToken: this.request.headers['x-csrf-token'],

                    // Feature flags based on access level
                    featureFlags: {
                        enableAdvancedSearch: this.request.user?.roles?.includes('admin') || false,
                        enableBetaFeatures: this.request.user?.roles?.includes('beta-tester') || false,
                        enableAuditLogging: true,
                        enableBulkOperations: accessibleIds.length > 5, // Enable bulk ops if user has access to many resources
                        enableResourceCreation: await this.checkCreatePermission(userId, workspaceId, resourceType),
                    }
                }
            };

            console.log('✅ Successfully enhanced query with context');
            console.log('🔧 Context keys:', Object.keys(enhancedQuery.context));
            console.log('🎯 Accessible IDs count:', accessibleIds.length);

            return enhancedQuery;

        } catch (error) {
            console.error('❌ Error in EnhancedUserContextPipe:', error);
            // Return original query with minimal context on error
            return {
                ...query,
                context: {
                    userContext: {
                        id: this.request.user?.id || 'unknown',
                        accessibleIds: [],
                        error: 'Failed to load access context'
                    }
                }
            };
        }
    }

    /**
     * Get specific resource IDs that the user can access (not just access grant IDs)
     */
    private async getUserAccessibleResourceIds(
        userId: string,
        workspaceId: string,
        resourceType: string
    ): Promise<string[]> {
        if (!userId || !workspaceId || !resourceType) return [];

        try {
            // Get all access grants for this user and resource type
            const accessGrants = await this.pulseAccessService.getAccessesByWorkspaceAndResource({
                workspaceId,
                resourceType
            });

            const resourceIds: string[] = [];

            // Extract specific resource IDs from individual access grants
            accessGrants
                .filter(grant => grant.accessType === 'individual' && grant.userId === userId)
                .forEach(grant => {
                    if (grant.resourceId && grant.resourceId !== '*') {
                        resourceIds.push(grant.resourceId);
                    }
                });

            // For policy-based access, you might need to query actual resources
            // This is a simplified example - you'd implement based on your business logic
            const hasPolicyAccess = accessGrants.some(async grant => 
                grant.accessType === 'policy' && 
                await this.evaluateUserPolicyAccess(userId, grant)
            );

            if (hasPolicyAccess) {
                // If user has policy access, they might access all resources of this type
                // You could query your actual resource table here
                const allResourceIds = await this.getAllResourceIdsOfType(resourceType, workspaceId);
                resourceIds.push(...allResourceIds);
            }

            return [...new Set(resourceIds)]; // Remove duplicates

        } catch (error) {
            console.error('Error getting user accessible resource IDs:', error);
            return [];
        }
    }

    /**
     * Extract resource type from the route path
     */
    private extractResourceFromRoute(): string | undefined {
        const path = this.request.route?.path || this.request.url || '';
        
        // Common patterns for extracting resource type from routes
        const resourcePatterns = [
            /\/api\/([^\/]+)/,           // /api/schools -> schools
            /\/pulse\/([^\/\?]+)/,       // /pulse/documents -> documents
            /\/([^\/]+)\/list/,          // /schools/list -> schools
        ];

        for (const pattern of resourcePatterns) {
            const match = path.match(pattern);
            if (match && match[1]) {
                // Convert plural to singular if needed
                return this.singularizeResource(match[1]);
            }
        }

        return undefined;
    }

    /**
     * Convert plural resource names to singular
     */
    private singularizeResource(resource: string): string {
        const singularMap: Record<string, string> = {
            'schools': 'school',
            'documents': 'document',
            'users': 'user',
            'workspaces': 'workspace',
        };

        return singularMap[resource.toLowerCase()] || resource;
    }

    /**
     * Check if user has full access (admin or similar)
     */
    private checkFullAccess(): boolean {
        const userRoles = this.request.user?.roles || [];
        return userRoles.includes('admin') || userRoles.includes('super-admin');
    }

    /**
     * Determine user's access level
     */
    private determineAccessLevel(): 'none' | 'limited' | 'full' | 'admin' {
        if (!this.request.user) return 'none';
        
        const roles = this.request.user.roles || [];
        
        if (roles.includes('admin') || roles.includes('super-admin')) return 'admin';
        if (roles.includes('manager') || roles.includes('editor')) return 'full';
        if (roles.includes('viewer') || roles.includes('member')) return 'limited';
        
        return 'none';
    }

    /**
     * Check if user can create resources of this type
     */
    private async checkCreatePermission(
        userId: string,
        workspaceId: string,
        resourceType: string
    ): Promise<boolean> {
        if (!userId || !workspaceId || !resourceType) return false;

        try {
            const result = await this.pulseAccessService.hasAccessToResourceType({
                userId,
                workspaceId,
                resourceType,
                actionType: 'create'
            });

            return result.hasAccess;
        } catch (error) {
            console.error('Error checking create permission:', error);
            return false;
        }
    }

    /**
     * Evaluate if user matches a policy's conditions
     */
    private async evaluateUserPolicyAccess(userId: string, grant: any): Promise<boolean> {
        // This would use your existing policy evaluation logic
        // Simplified example:
        try {
            const user = await this.pulseAccessService.userRepo.findOne({ where: { id: userId } });
            const userRoles = await this.pulseAccessService.userRoleRepo.find({
                where: { user: { id: userId } },
                relations: ['role']
            });

            const context = {
                ...user?.metadata,
                role: userRoles[0]?.role?.name,
                workspaceId: this.request.user?.workspaceId
            };

            return this.pulseAccessService.evaluateConditions(context, {}, grant.conditions || {});
        } catch (error) {
            return false;
        }
    }

    /**
     * Get all resource IDs of a specific type in workspace
     */
    private async getAllResourceIdsOfType(resourceType: string, workspaceId: string): Promise<string[]> {
        // This would query your actual resource tables
        // Example implementation:
        try {
            // You'd implement this based on your resource structure
            // This is a placeholder
            return [];
        } catch (error) {
            console.error('Error getting all resource IDs:', error);
            return [];
        }
    }
}