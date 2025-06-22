// ============================================
// STEP 2: FIXED GLOBAL INTERCEPTOR
// ============================================

// src/common/interceptors/global-access-context.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Response } from 'express';
import { PulseAccessService } from '../../pulse/pulse-access.service'; // Adjust path as needed

// User type definition for function parameters
interface UserType {
    id: string;
    workspaceId?: string;
    roles?: string[];
    email?: string;
    permissions?: string[];
    name?: string;
    domain?: string;
    metadata?: Record<string, any>;
    [key: string]: any;
}

@Injectable()
export class GlobalAccessContextInterceptor implements NestInterceptor {
    constructor(private readonly pulseAccessService: PulseAccessService) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest<any>();
        const response = context.switchToHttp().getResponse<Response>();

        console.log('🌐 [wowo] interceptor Global Access Interceptor activated');
        console.log('🎯 Request:', request.method, request.url);

        const startTime = Date.now();

        // Add access context to request before handler execution
        await this.addcontext(request);

        console.log('🎯 Request: after', request.context);

        return next.handle().pipe(
            // Log execution time
            tap(() => {
                const duration = Date.now() - startTime;
                console.log(`⏱️ Request processed in ${duration}ms`);
            }),

            // Enhance response with access context metadata
            map(data => {
                const context = request.context;

                // If it's a JSON response, add metadata
                if (this.shouldEnhanceResponse(request, data)) {
                    return {
                        ...data,
                        _meta: {
                            requestId: context?.requestMetadata?.requestId,
                            timestamp: context?.requestMetadata?.timestamp,
                            accessLevel: context?.accessControl?.accessLevel,
                            totalAccessibleIds: context?.accessControl?.totalAccessibleIds,
                            totalAccessibleResources: context?.accessControl?.totalAccessibleResources,
                            resourceType: context?.accessControl?.resourceType,
                            workspaceId: context?.accessControl?.workspaceId,
                            featureFlags: context?.featureFlags,
                            processingTime: `${Date.now() - startTime}ms`,
                            context
                        }
                    };
                }

                // Return original data if we shouldn't enhance
                return data;
            }),
        );
    }

    /**
     * Add comprehensive access context to the request
     */
    private async addcontext(request: any): Promise<void> {
        try {
            console.log('🔄 Building access context...');

            // Extract context information
            const user = request.user;
            const resourceType = this.extractResourceType(request);
            const workspaceId = (request.query.workspaceId as string) || user?.workspaceId;
            const userId = user?.id;

            console.log('📋 Context Info:', { userId, workspaceId, resourceType });

            // Initialize default values
            let accessibleIds: string[] = [];
            let canCreate = false;
            let userAccessibleResources: string[] = [];

            // Fetch dynamic access information if we have the required data
            if (userId && workspaceId && resourceType) {
                try {
                    console.log('🔍 Fetching access data...');

                    // Parallel execution for better performance
                    const [accessIds] = await Promise.all([
                        // Get all access grant IDs for this resource type in the workspace
                        this.pulseAccessService.getAccessIdsByWorkspaceAndResource({
                            workspaceId,
                            resourceType
                        }),

                        // Check if user can create resources of this type
                        // this.pulseAccessService.hasAccessToResourceType({
                        //   userId,
                        //   workspaceId,
                        //   resourceType,
                        //   actionType: 'create'
                        // }),

                        // Get detailed access information for the user
                        // this.getUserAccessibleResourceIds(userId, workspaceId, resourceType)
                    ]);

                    accessibleIds = accessIds;
                    //   canCreate = createPermission.hasAccess;
                    //   userAccessibleResources = userResources;

                    console.log('✅ Fetched access context:', {
                        accessibleIds,
                        accessGrantIds: accessibleIds.length,
                        userResourceIds: userAccessibleResources.length,
                        canCreate
                    });

                } catch (error) {
                    console.error('❌ Error fetching access context:', error);
                    // Continue with empty arrays - don't fail the request
                }
            }

            // Build comprehensive access context
            request.context = {
                userContext: {
                    id: '32343232', // || userId || 'anonymous',
                    workspaceId: workspaceId || '',
                    // roles: user?.roles || [],
                    "roles": [
                        "manager"                                                                                           
                    ],
                    email: user?.email || '',
                    name: user?.name,
                    permissions: user?.permissions || [],
                    accessibleIds, // Grant IDs from access_actions and access_policies
                    accessibleResourceIds: userAccessibleResources, // Actual resource IDs user can access
                    currentResourceType: resourceType,
                },
                accessControl: {
                    resourceType,
                    workspaceId,
                    accessibleIds,
                    totalAccessibleIds: accessibleIds.length,
                    totalAccessibleResources: userAccessibleResources.length,
                    hasFullAccess: this.checkFullAccess(user),
                    accessLevel: this.determineAccessLevel(user),
                },
                featureFlags: {
                    enableAdvancedSearch: user?.roles?.includes('admin') || false,
                    enableBetaFeatures: user?.roles?.includes('beta-tester') || false,
                    enableAuditLogging: true,
                    enableBulkOperations: accessibleIds.length > 5,
                    enableResourceCreation: canCreate,
                    enableExport: this.checkExportPermission(user, accessibleIds.length),
                    enableAdvancedFilters: user?.roles?.includes('power-user') || false,
                },
                requestMetadata: {
                    requestId: (request.headers['x-request-id'] as string) || `req-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    userAgent: request.headers['user-agent'],
                    ipAddress: request.ip || request.socket?.remoteAddress || '',
                    endpoint: request.url,
                    method: request.method,
                    referer: request.headers['referer'] as string,
                    origin: request.headers['origin'] as string,
                },

                // Additional context for debugging/monitoring
                performance: {
                    contextGeneratedAt: new Date().toISOString(),
                    cacheHit: false, // You could implement caching later
                }
            };

            console.log('🎯 Access context ready:', {
                userId: request.context.userContext.id,
                grantIds: request.context.userContext.accessibleIds.length,
                resourceIds: request.context.userContext.accessibleResourceIds.length,
                accessLevel: request.context.accessControl.accessLevel,
                resourceType: request.context.accessControl.resourceType,
                canCreate: request.context.featureFlags.enableResourceCreation,
            });

            console.log('🎯 Access context only ready:', request.context);

        } catch (error) {
            console.error('❌ Global interceptor error:', error);

            // Fallback context on error
            request.context = {
                userContext: {
                    id: request.user?.id || 'unknown',
                    workspaceId: '',
                    roles: [],
                    email: '',
                    accessibleIds: [],
                    accessibleResourceIds: [],
                    permissions: [],
                },
                accessControl: {
                    totalAccessibleIds: 0,
                    totalAccessibleResources: 0,
                    hasFullAccess: false,
                    accessLevel: 'none',
                },
                featureFlags: {
                    enableAdvancedSearch: false,
                    enableBetaFeatures: false,
                    enableAuditLogging: true,
                    enableBulkOperations: false,
                    enableResourceCreation: false,
                    enableExport: false,
                    enableAdvancedFilters: false,
                },
                requestMetadata: {
                    requestId: `req-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    endpoint: request.url,
                    method: request.method,
                },
                performance: {
                    contextGeneratedAt: new Date().toISOString(),
                    cacheHit: false,
                },
                error: 'Failed to load access context'
            };
        }
    }

    /**
     * Get specific resource IDs that the user can access (not just grant IDs)
     */
    private async getUserAccessibleResourceIds(
        userId: string,
        workspaceId: string,
        resourceType: string
    ): Promise<string[]> {
        if (!userId || !workspaceId || !resourceType) return [];

        try {
            // Get detailed access information
            const accessGrants = await this.pulseAccessService.getAccessesByWorkspaceAndResource({
                workspaceId,
                resourceType
            });

            const resourceIds: string[] = [];

            // Extract specific resource IDs from individual access grants for this user
            accessGrants
                .filter(grant => grant.accessType === 'individual' && grant.userId === userId)
                .forEach(grant => {
                    if (grant.resourceId && grant.resourceId !== '*') {
                        resourceIds.push(grant.resourceId);
                    }
                });

            // Check if user has policy-based access
            const policyGrants = accessGrants.filter(grant => grant.accessType === 'policy');

            for (const policyGrant of policyGrants) {
                const hasAccess = await this.evaluateUserPolicyAccess(userId, workspaceId, policyGrant);
                if (hasAccess) {
                    // If user has policy access, they can access all resources of this type
                    resourceIds.push('*'); // Indicates policy-based access to all resources
                    break;
                }
            }

            return [...new Set(resourceIds)]; // Remove duplicates

        } catch (error) {
            console.error('Error getting user accessible resource IDs:', error);
            return [];
        }
    }

    /**
     * Evaluate if user matches a policy's conditions
     */
    private async evaluateUserPolicyAccess(
        userId: string,
        workspaceId: string,
        policyGrant: any
    ): Promise<boolean> {
        try {
            // Use the existing policy evaluation from PulseAccessService
            const simulationResult = await this.pulseAccessService.simulateAccess({
                actorId: userId,
                workspaceId,
                resourceType: policyGrant.resourceId || '*',
                actionType: policyGrant.actionType,
                userMetadata: {},
                resourceMetadata: {}
            });

            return simulationResult.granted;
        } catch (error) {
            console.error('Error evaluating policy access:', error);
            return false;
        }
    }

    /**
     * Extract resource type from request URL or query parameters
     */
    private extractResourceType(request: any): string | undefined {
        // First check query parameters
        if (request.query.resource) {
            return request.query.resource as string;
        }

        if (request.query.resourceType) {
            return request.query.resourceType as string;
        }

        // Then check URL patterns
        const url = request.url;
        const resourcePatterns = [
            { pattern: /\/api\/schools/, resource: 'school' },
            { pattern: /\/api\/documents/, resource: 'document' },
            { pattern: /\/api\/users/, resource: 'user' },
            { pattern: /\/api\/workspaces/, resource: 'workspace' },
            { pattern: /\/api\/flow-templates/, resource: 'flow-template' },
            { pattern: /\/api\/document-templates/, resource: 'document-template' },
            { pattern: /\/pulse\/.*\?.*resource=([^&]+)/, resource: '$1' },
            { pattern: /\/([^\/]+)\/list/, resource: '$1' },
            { pattern: /\/api\/([^\/\?]+)/, resource: '$1' },
        ];

        for (const { pattern, resource } of resourcePatterns) {
            const match = url.match(pattern);
            if (match) {
                if (resource.startsWith('$')) {
                    // Use capture group
                    const captureIndex = parseInt(resource.substring(1));
                    return this.singularizeResource(match[captureIndex]);
                } else {
                    return resource;
                }
            }
        }

        return undefined;
    }

    private singularizeResource(resource: string): string {
        const singularMap: Record<string, string> = {
            'schools': 'school',
            'documents': 'document',
            'users': 'user',
            'workspaces': 'workspace',
            'flow-templates': 'flow-template',
            'document-templates': 'document-template',
        };

        return singularMap[resource.toLowerCase()] || resource;
    }

    private checkFullAccess(user: UserType | undefined): boolean {
        if (!user) return false;
        const roles = user.roles || [];
        return roles.includes('admin') || roles.includes('super-admin') || roles.includes('owner');
    }

    private determineAccessLevel(user: UserType | undefined): 'none' | 'limited' | 'full' | 'admin' {
        if (!user) return 'none';

        const roles = user.roles || [];

        if (roles.includes('admin') || roles.includes('super-admin') || roles.includes('owner')) return 'admin';
        if (roles.includes('manager') || roles.includes('editor')) return 'full';
        if (roles.includes('viewer') || roles.includes('member')) return 'limited';

        return 'none';
    }

    private checkExportPermission(user: UserType | undefined, accessibleCount: number): boolean {
        if (!user) return false;

        const roles = user.roles || [];

        // Admins can always export
        if (roles.includes('admin') || roles.includes('super-admin')) return true;

        // Managers can export if they have access to multiple items
        if (roles.includes('manager') && accessibleCount > 1) return true;

        // Others can export only single items
        return accessibleCount === 1;
    }

    /**
     * Determine if we should enhance the response with metadata
     */
    private shouldEnhanceResponse(request: Request, data: any): boolean {
        // Don't enhance if it's not a JSON response
        if (typeof data !== 'object' || data === null) return false;

        // Don't enhance if it's already an array (like your /my-grants endpoint)
        if (Array.isArray(data)) return false;

        // Don't enhance if response already has _meta
        if (data._meta) return false;

        // Don't enhance for file downloads or streams
        const contentType = request.headers['accept'] || '';
        if (contentType.includes('application/octet-stream') ||
            contentType.includes('text/csv') ||
            contentType.includes('application/pdf')) return false;

        // Check for specific endpoints that shouldn't be enhanced
        const skipEnhancementPaths = [
            '/health',
            '/metrics',
            '/status',
            '/ping'
        ];

        return !skipEnhancementPaths.some(path => request.url.includes(path));
    }
}