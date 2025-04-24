// pulse.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { PulseAccessService } from './pulse-access.service';
import * as fs from 'fs';
import * as path from 'path';
//
const publicPathFile = path.resolve('mocks/public-paths.json');
const PUBLIC_PATHS = new Set<string>(JSON.parse(fs.readFileSync(publicPathFile, 'utf-8')));

function mapHttpMethodToAction(method: string): string {
  switch (method.toUpperCase()) {
    case 'GET': return 'view';
    case 'POST': return 'create';
    case 'PUT':
    case 'PATCH': return 'edit';
    case 'DELETE': return 'delete';
    default: return 'view';
  }
}

function extractResourceFromPath(pathname: string): { resourceType: string; resourceId?: string } {
  const parts = pathname.split('/').filter(Boolean); // remove empty strings

  // Expected format: /api/<resource-name>/:id
  const apiIndex = parts.indexOf('api');
  if (apiIndex !== -1 && parts.length > apiIndex + 1) {
    const resourceType = parts[apiIndex + 1];
    const resourceId = parts[apiIndex + 2]; // optional
    return { resourceType, resourceId };
  }

  return { resourceType: 'unknown' };
}


@Injectable()
export class PulseInterceptor implements NestInterceptor {
  constructor(private readonly pulse: PulseAccessService) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const { user = {} } = req;

    if (PUBLIC_PATHS.has(req.path)) return next.handle();

    if (!user) throw new ForbiddenException('Unauthorized user');

    const { resourceType, resourceId } = extractResourceFromPath(req.path);
    const actionType = mapHttpMethodToAction(req.method);

    console.log('[paulse]', {
      actorId: user.id,
      workspaceId: user.workspaceId,
      resourceType,
      resourceId,
      actionType,
      userMetadata: user.metadata, // ✅ important
    })

    const { granted: hasAccess, grantedBy } = await this.pulse.canAccess({
      actorId: user.id,
      workspaceId: 'd9f8ec62-bb8b-4f7d-a192-c0a4c71f30dd', //user.workspaceId,
      resourceType,
      resourceId,
      actionType,
      userMetadata: user.metadata, // ✅ important
    });

    //
    console.log('Access check:', hasAccess, user, req.path, grantedBy)

    if (!hasAccess) throw new ForbiddenException('Access denied by Pulse');

    return next.handle();
  }
}
