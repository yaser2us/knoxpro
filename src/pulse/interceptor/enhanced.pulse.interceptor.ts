// enhanced-pulse.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, switchMap, from } from 'rxjs';
import { Request } from 'express';
import { PulseAccessService } from '../pulse-access.service';
import { isWhitelisted } from '../pulse.interceptor';

interface JsonApiResponse {
    data: any;
    meta?: any;
    links?: any;
    included?: any[];
}

interface JsonApiResource {
    id: string;
    type: string;
    attributes: any;
    relationships?: any;
}

@Injectable()
export class EnhancedPulseInterceptor implements NestInterceptor {
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

        // For collection access (GET /api/documents), filter results
        if (req.method === 'GET') {
            return next.handle().pipe(
                switchMap(response =>
                    from(this.filterJsonApiResponse(response, user, resourceType, actionType))
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

    private async filterJsonApiResponse(
        response: any,
        user: any,
        resourceType: string,
        actionType: string
    ): Promise<any> {
        if (!response || !response.data) {
            return response;
        }

        // Handle single resource response
        if (!Array.isArray(response.data)) {
            return response;
        }

        // Handle collection response - filter accessible resources
        const accessibleResources: JsonApiResource[] = [];

        for (const resource of response.data) {
            const { granted, grantedBy} = await this.pulse.canAccess({
                role: user.role,
                actorId: user.id,
                workspaceId: user.workspaceId || 'd9f8ec62-bb8b-4f7d-a192-c0a4c71f30dd',
                resourceType: resource.type || resourceType,
                resourceId: resource.id,
                actionType,
                userMetadata: user.metadata,
                resourceMetadata: resource.attributes || {},
            });

            console.log(`Checking access for resource ${resource.id} of type ${resource.type}:`, granted, grantedBy);

            if (granted) {
                // Add available actions to the resource
                const availableActions = await this.getAvailableActionsForResource(
                    user,
                    resource.type || resourceType,
                    resource.id,
                    resource.attributes || {}
                );

                accessibleResources.push({
                    ...resource,
                    meta: {
                        ...resource.meta,
                        availableActions
                    }
                });
            }
        }

        return {
            ...response,
            data: accessibleResources,
            meta: {
                ...response.meta,
                totalAccessible: accessibleResources.length,
                totalFiltered: response.data.length - accessibleResources.length
            }
        };
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