// // ============================================
// // APPROACH 1: GLOBAL MIDDLEWARE (RECOMMENDED)
// // ============================================

// // global-access-context.middleware.ts
// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { PulseAccessService } from '../../pulse/pulse-access.service';

// // Extend Express Request type to include our context
// declare global {
//   namespace Express {
//     interface Request {
//       accessContext?: {
//         userContext: {
//           id: string;
//           workspaceId: string;
//           roles: string[];
//           email: string;
//           accessibleIds: string[];
//           currentResourceType?: string;
//         };
//         accessControl: {
//           resourceType?: string;
//           workspaceId?: string;
//           totalAccessibleIds: number;
//           hasFullAccess: boolean;
//           accessLevel: 'none' | 'limited' | 'full' | 'admin';
//         };
//         featureFlags: {
//           enableAdvancedSearch: boolean;
//           enableBetaFeatures: boolean;
//           enableAuditLogging: boolean;
//           enableBulkOperations: boolean;
//           enableResourceCreation: boolean;
//         };
//         requestMetadata: {
//           requestId: string;
//           timestamp: string;
//           userAgent?: string;
//           ipAddress?: string;
//           endpoint: string;
//           method: string;
//         };
//       };
//     }
//   }
// }

// @Injectable()
// export class GlobalAccessContextMiddleware implements NestMiddleware {
//   constructor(private readonly pulseAccessService: PulseAccessService) {}

//   async use(req: Request, res: Response, next: NextFunction) {

//     console.log('🌐 Global Access Context Middleware activated');
//     console.log('🎯 Request:', req.method, req.url);

//     try {
//       // Extract context information
//       const user = req.user as any; // Your JWT user object
//       const resourceType = this.extractResourceType(req);
//       const workspaceId = req.query.workspaceId as string || user?.workspaceId;
//       const userId = user?.id;

//       console.log('📋 Context Info:', { userId, workspaceId, resourceType });

//       // Initialize default context
//       let accessibleIds: string[] = [];
//       let canCreate = false;

//       // Fetch dynamic access information if we have the required data
//       if (userId && workspaceId && resourceType) {
//         try {
//           // Get all accessible resource IDs for this user/workspace/resource type
//           accessibleIds = await this.pulseAccessService.getAccessIdsByWorkspaceAndResource({
//             workspaceId,
//             resourceType
//           });

//           // Check if user can create resources of this type
//           const createPermission = await this.pulseAccessService.hasAccessToResourceType({
//             userId,
//             workspaceId,
//             resourceType,
//             actionType: 'create'
//           });
//           canCreate = createPermission.hasAccess;

//           console.log('✅ Fetched access context:', { 
//             accessibleIdsCount: accessibleIds.length, 
//             canCreate 
//           });

//         } catch (error) {
//           console.error('❌ Error fetching access context:', error);
//         }
//       }

//       // Build comprehensive access context
//       req.accessContext = {
//         userContext: {
//           id: userId || 'anonymous',
//           workspaceId: workspaceId || '',
//           roles: user?.roles || [],
//           email: user?.email || '',
//           accessibleIds,
//           currentResourceType: resourceType,
//         },
//         accessControl: {
//           resourceType,
//           workspaceId,
//           totalAccessibleIds: accessibleIds.length,
//           hasFullAccess: this.checkFullAccess(user),
//           accessLevel: this.determineAccessLevel(user),
//         },
//         featureFlags: {
//           enableAdvancedSearch: user?.roles?.includes('admin') || false,
//           enableBetaFeatures: user?.roles?.includes('beta-tester') || false,
//           enableAuditLogging: true,
//           enableBulkOperations: accessibleIds.length > 5,
//           enableResourceCreation: canCreate,
//         },
//         requestMetadata: {
//           requestId: req.headers['x-request-id'] as string || `req-${Date.now()}`,
//           timestamp: new Date().toISOString(),
//           userAgent: req.headers['user-agent'],
//           ipAddress: req.ip || req.connection?.remoteAddress || '',
//           endpoint: req.url,
//           method: req.method,
//         }
//       };

//       console.log('🎯 Access context ready:', {
//         userId: req.accessContext.userContext.id,
//         accessibleIds: req.accessContext.userContext.accessibleIds.length,
//         accessLevel: req.accessContext.accessControl.accessLevel,
//         resourceType: req.accessContext.accessControl.resourceType
//       });

//     } catch (error) {
//       console.error('❌ Global middleware error:', error);
      
//       // Fallback context on error
//       req.accessContext = {
//         userContext: {
//           id: req.user?.['id'] || 'unknown',
//           workspaceId: '',
//           roles: [],
//           email: '',
//           accessibleIds: [],
//         },
//         accessControl: {
//           totalAccessibleIds: 0,
//           hasFullAccess: false,
//           accessLevel: 'none',
//         },
//         featureFlags: {
//           enableAdvancedSearch: false,
//           enableBetaFeatures: false,
//           enableAuditLogging: true,
//           enableBulkOperations: false,
//           enableResourceCreation: false,
//         },
//         requestMetadata: {
//           requestId: `req-${Date.now()}`,
//           timestamp: new Date().toISOString(),
//           endpoint: req.url,
//           method: req.method,
//         },
//       };
//     }

//     next();
//   }

//   /**
//    * Extract resource type from request URL or query parameters
//    */
//   private extractResourceType(req: Request): string | undefined {
//     // First check query parameters
//     if (req.query.resource) {
//       return req.query.resource as string;
//     }

//     if (req.query.resourceType) {
//       return req.query.resourceType as string;
//     }

//     // Then check URL patterns
//     const url = req.url;
//     const resourcePatterns = [
//       { pattern: /\/api\/schools/, resource: 'school' },
//       { pattern: /\/api\/documents/, resource: 'document' },
//       { pattern: /\/api\/users/, resource: 'user' },
//       { pattern: /\/api\/workspaces/, resource: 'workspace' },
//       { pattern: /\/pulse\/.*\?.*resource=([^&]+)/, resource: '$1' },
//       { pattern: /\/([^\/]+)\/list/, resource: '$1' },
//       { pattern: /\/api\/([^\/\?]+)/, resource: '$1' },
//     ];

//     for (const { pattern, resource } of resourcePatterns) {
//       const match = url.match(pattern);
//       if (match) {
//         if (resource.startsWith('$')) {
//           // Use capture group
//           const captureIndex = parseInt(resource.substring(1));
//           return this.singularizeResource(match[captureIndex]);
//         } else {
//           return resource;
//         }
//       }
//     }

//     return undefined;
//   }

//   private singularizeResource(resource: string): string {
//     const singularMap: Record<string, string> = {
//       'schools': 'school',
//       'documents': 'document',
//       'users': 'user',
//       'workspaces': 'workspace',
//     };

//     return singularMap[resource.toLowerCase()] || resource;
//   }

//   private checkFullAccess(user: any): boolean {
//     if (!user) return false;
//     const roles = user.roles || [];
//     return roles.includes('admin') || roles.includes('super-admin');
//   }

//   private determineAccessLevel(user: any): 'none' | 'limited' | 'full' | 'admin' {
//     if (!user) return 'none';
    
//     const roles = user.roles || [];
    
//     if (roles.includes('admin') || roles.includes('super-admin')) return 'admin';
//     if (roles.includes('manager') || roles.includes('editor')) return 'full';
//     if (roles.includes('viewer') || roles.includes('member')) return 'limited';
    
//     return 'none';
//   }
// }