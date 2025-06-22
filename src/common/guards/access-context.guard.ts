// ============================================
// SOLUTION 1: ACCESS CONTEXT GUARD
// ============================================

// src/common/guards/access-context.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// Extend the Request type to include the 'user' and 'context' properties
declare module 'express' {
  interface Request {
    user?: UserType;
    context?: Record<string, any>;
  }
}
import { PulseAccessService } from '../../pulse/pulse-access.service';

// User type definition
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
export class AccessContextGuard implements CanActivate {
  constructor(private readonly pulseAccessService: PulseAccessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    console.log('🛡️ [GUARD] Access Context Guard activated');
    console.log('🎯 Request:', request.method, request.url);
    console.log('👤 User available:', !!request.user);

    try {
      // Add access context to request
      await this.addContext(request);
      
      console.log('✅ Context added successfully');
      return true; // Always allow - this guard just adds context
      
    } catch (error) {
      console.error('❌ Guard error:', error);
      
      // Set fallback context on error but still allow request
      this.setFallbackContext(request);
      return true;
    }
  }

  /**
   * Add comprehensive access context to the request
   */
  private async addContext(req: Request): Promise<void> {
    try {
      console.log('🔄 Building access context...');

      // NOW we have access to req.user (set by JWT guard)
      const user = req.user as UserType;
      const resourceType = this.extractResourceType(req);
      const workspaceId = (req.query.workspaceId as string) || user?.workspaceId;
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

          const [accessIds] = await Promise.all([
            this.pulseAccessService.getAccessIdsByWorkspaceAndResource({
              workspaceId,
              resourceType
            }),
          ]);

          accessibleIds = accessIds;

          console.log('✅ Fetched access context:', {
            accessibleIds,
            accessGrantIds: accessibleIds.length,
            userResourceIds: userAccessibleResources.length,
            canCreate
          });

        } catch (error) {
          console.error('❌ Error fetching access context:', error);
        }
      }

      // Build comprehensive access context
      req.context = {
        userContext: {
          id: userId || 'anonymous',
          workspaceId: workspaceId || '',
          roles: user?.roles || [],
          email: user?.email || '',
          name: user?.name,
          permissions: user?.permissions || [],
          accessibleIds,
          accessibleResourceIds: userAccessibleResources,
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
          requestId: (req.headers['x-request-id'] as string) || `req-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip || req.socket?.remoteAddress || '',
          endpoint: req.url,
          method: req.method,
          referer: req.headers['referer'] as string,
          origin: req.headers['origin'] as string,
        },
        performance: {
          contextGeneratedAt: new Date().toISOString(),
          cacheHit: false,
        }
      };

      console.log('🎯 Access context ready:', {
        userId: req.context.userContext.id,
        grantIds: req.context.userContext.accessibleIds.length,
        resourceIds: req.context.userContext.accessibleResourceIds.length,
        accessLevel: req.context.accessControl.accessLevel,
        resourceType: req.context.accessControl.resourceType,
        canCreate: req.context.featureFlags.enableResourceCreation,
      });

    } catch (error) {
      console.error('❌ Context building error:', error);
      throw error;
    }
  }

  /**
   * Set fallback context on error
   */
  private setFallbackContext(req: Request): void {
    const user = req.user as UserType;
    
    req.context = {
      userContext: {
        id: user?.id || 'unknown',
        workspaceId: user?.workspaceId || '',
        roles: user?.roles || [],
        email: user?.email || '',
        accessibleIds: [],
        accessibleResourceIds: [],
        permissions: user?.permissions || [],
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
        endpoint: req.url,
        method: req.method,
      },
      performance: {
        contextGeneratedAt: new Date().toISOString(),
        cacheHit: false,
      },
      error: 'Failed to load access context'
    };
  }

  // ... (include all your helper methods from the middleware)
  private extractResourceType(req: Request): string | undefined {
    if (req.query.resource) return req.query.resource as string;
    if (req.query.resourceType) return req.query.resourceType as string;

    const url = req.url;
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
    if (roles.includes('admin') || roles.includes('super-admin')) return true;
    if (roles.includes('manager') && accessibleCount > 1) return true;
    return accessibleCount === 1;
  }
}