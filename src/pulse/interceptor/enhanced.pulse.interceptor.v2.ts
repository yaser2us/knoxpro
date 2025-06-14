// corrected-pulse.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { switchMap, from } from 'rxjs';
import { Request } from 'express';
import { PulseAccessService } from '../pulse-access.service';
import { isWhitelisted } from '../pulse.interceptor';

@Injectable()
export class CorrectedPulseInterceptor implements NestInterceptor {
    constructor(private readonly pulse: PulseAccessService) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const { user = {} } = req;

        if (isWhitelisted(req.method, req.path)) {
            return next.handle();
        }

        if (!user) throw new ForbiddenException('Unauthorized user');

        const { resourceType, resourceId } = this.extractResourceFromPath(req.path);
        const actionType = this.mapHttpMethodToAction(req.method);

        // For individual resource access (GET /api/documents/123)
        if (resourceId) {
            const { granted } = await this.pulse.canAccess({
                role: user.role,
                actorId: user.id,
                workspaceId: user.workspaceId || 'd9f8ec62-bb8b-4f7d-a192-c0a4c71f30dd',
                resourceType,
                resourceId,
                actionType,
                userMetadata: user.metadata,
            });

            if (!granted) {
                throw new ForbiddenException('Access denied by Pulse');
            }

            return next.handle();
        }

        // For collection access (GET /api/documents), we need to handle pagination correctly
        if (req.method === 'GET') {
            // Extract pagination parameters from request
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            // For now, let's try the "fetch more and filter" approach with corrected meta
            return next.handle().pipe(
                switchMap(response =>
                    from(this.handlePaginatedResponse(response, user, resourceType, actionType, page, limit, req))
                )
            );
        }

        // For POST requests, check if user can create
        if (req.method === 'POST') {
            const { granted } = await this.pulse.canAccess({
                role: user.role,
                actorId: user.id,
                workspaceId: user.workspaceId || 'd9f8ec62-bb8b-4f7d-a192-c0a4c71f30dd',
                resourceType,
                actionType: 'create',
                userMetadata: user.metadata,
                resourceMetadata: req.body?.data?.attributes || {},
            });

            if (!granted) {
                throw new ForbiddenException('Create access denied by Pulse');
            }

            return next.handle();
        }

        return next.handle();
    }

    private async handlePaginatedResponse(
        response: any,
        user: any,
        resourceType: string,
        actionType: string,
        requestedPage: number,
        requestedLimit: number,
        req: Request
    ): Promise<any> {
        if (!response || !response.data) {
            return response;
        }

        // Handle single resource response
        if (!Array.isArray(response.data)) {
            return response;
        }

        // Strategy 1: Quick fix - fetch more pages until we have enough accessible items
        const accessibleResources = await this.fetchEnoughAccessibleItems(
            response,
            user,
            resourceType,
            actionType,
            requestedLimit,
            req
        );

        // Calculate correct pagination metadata
        const totalAccessibleCount = await this.getTotalAccessibleCount(user, resourceType, req);

        const startIndex = (requestedPage - 1) * requestedLimit;
        const endIndex = startIndex + requestedLimit;
        const paginatedAccessibleResources = accessibleResources.slice(startIndex, endIndex);

        return {
            ...response,
            data: paginatedAccessibleResources,
            meta: {
                pageNumber: requestedPage,
                pageSize: requestedLimit,
                totalItems: totalAccessibleCount, // Corrected: only count accessible items
                totalPages: Math.ceil(totalAccessibleCount / requestedLimit),
                hasNextPage: requestedPage < Math.ceil(totalAccessibleCount / requestedLimit),
                hasPreviousPage: requestedPage > 1,
                accessControl: {
                    strategy: 'filtered_pagination',
                    originalTotal: response.meta?.totalItems || response.data.length,
                    accessibleTotal: totalAccessibleCount,
                    filtered: (response.meta?.totalItems || response.data.length) - totalAccessibleCount
                }
            }
        };
    }

    private async fetchEnoughAccessibleItems(
        initialResponse: any,
        user: any,
        resourceType: string,
        actionType: string,
        neededCount: number,
        req: Request
    ): Promise<any[]> {
        const accessibleItems: any[] = [];
        let currentItems = initialResponse.data;
        let fetchedPages = 1;
        const maxPages = 10; // Prevent infinite loops

        while (accessibleItems.length < neededCount && fetchedPages <= maxPages && currentItems.length > 0) {
            // Check access for current batch
            for (const item of currentItems) {
                const { granted } = await this.pulse.canAccess({
                    role: user.role,
                    actorId: user.id,
                    workspaceId: user.workspaceId || 'd9f8ec62-bb8b-4f7d-a192-c0a4c71f30dd',
                    resourceType: item.type || resourceType,
                    resourceId: item.id,
                    actionType,
                    userMetadata: user.metadata,
                    resourceMetadata: item.attributes || {},
                });

                if (granted) {
                    // Add available actions to the resource
                    const availableActions = await this.getAvailableActionsForResource(
                        user,
                        item.type || resourceType,
                        item.id,
                        item.attributes || {}
                    );

                    accessibleItems.push({
                        ...item,
                        meta: {
                            ...item.meta,
                            availableActions
                        }
                    });
                }

                if (accessibleItems.length >= neededCount) break;
            }

            // If we need more items, fetch the next page
            if (accessibleItems.length < neededCount && currentItems.length > 0) {
                fetchedPages++;
                const nextPageItems = await this.fetchNextPage(req, fetchedPages);
                currentItems = nextPageItems;
            } else {
                break;
            }
        }

        return accessibleItems;
    }

    private async fetchNextPage(req: Request, page: number): Promise<any[]> {
        // This is a simplified approach - in reality you'd need to make another query
        // to your database or call your repository again with the next page
        // For now, return empty array to prevent infinite loops
        console.log(`Would fetch page ${page} for additional items`);
        return [];
    }

    private async getTotalAccessibleCount(user: any, resourceType: string, req: Request): Promise<number> {
        // This is the tricky part - we need to count total accessible items without fetching all
        // 
        // Option 1: Cache this value and update when permissions change
        // Option 2: Use a separate optimized query that applies access filters at DB level
        // Option 3: Use approximation based on user's general access level

        // For now, let's use a simple approximation
        const userPermissions = await this.pulse.getGrantedResourceTypes(user.id, user.workspaceId);
        const hasGeneralAccess = userPermissions.some(p =>
            p.resourceType === resourceType &&
            ['view', '*'].includes(p.actionType) &&
            p.grantedBy === 'role_permission'
        );

        if (hasGeneralAccess) {
            // User has role-based access, likely can see most/all resources in workspace
            // Query your actual resource count here
            return await this.getWorkspaceResourceCount(resourceType, user.workspaceId);
        } else {
            // User has limited access, count their specific grants
            return await this.getUserSpecificResourceCount(user.id, resourceType);
        }
    }

    private async getWorkspaceResourceCount(resourceType: string, workspaceId: string): Promise<number> {
        // You'd implement this to query your actual resource tables
        // This is a placeholder
        console.log(`Counting ${resourceType} in workspace ${workspaceId}`);
        return 50; // Placeholder
    }

    private async getUserSpecificResourceCount(userId: string, resourceType: string): Promise<number> {
        // Count direct grants + policy-based access
        // This is more complex and might require caching
        console.log(`Counting accessible ${resourceType} for user ${userId}`);
        return 10; // Placeholder
    }

    private async getAvailableActionsForResource(
        user: any,
        resourceType: string,
        resourceId: string,
        resourceAttributes: any
    ): Promise<string[]> {
        const actions = ['view', 'edit', 'delete', 'share'];
        const availableActions: string[] = [];

        for (const action of actions) {
            const { granted } = await this.pulse.canAccess({
                role: user.role,
                actorId: user.id,
                workspaceId: user.workspaceId || 'd9f8ec62-bb8b-4f7d-a192-c0a4c71f30dd',
                resourceType,
                resourceId,
                actionType: action,
                userMetadata: user.metadata,
                resourceMetadata: resourceAttributes,
            });

            if (granted) {
                availableActions.push(action);
            }
        }

        return availableActions;
    }

    private extractResourceFromPath(pathname: string): { resourceType: string; resourceId?: string } {
        const parts = pathname.split('/').filter(Boolean);
        const apiIndex = parts.indexOf('api');

        if (apiIndex !== -1 && parts.length > apiIndex + 1) {
            const resourceType = parts[apiIndex + 1];
            const resourceId = parts[apiIndex + 2];
            return { resourceType, resourceId };
        }

        return { resourceType: 'unknown' };
    }

    private mapHttpMethodToAction(method: string): string {
        switch (method.toUpperCase()) {
            case 'GET': return 'view';
            case 'POST': return 'create';
            case 'PUT':
            case 'PATCH': return 'edit';
            case 'DELETE': return 'delete';
            default: return 'view';
        }
    }
}