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
import { pathToRegexp, match }  from 'path-to-regexp';
//

type WhitelistRule = {
  method: string;        // 'GET' | 'POST' | 'PUT' | ...
  path: string;          // e.g., '/api/flow-template/:id'
  matcher: ReturnType<typeof match>; // compiled matcher
};

export const rawWhitelistPaths: Omit<WhitelistRule, 'matcher'>[] = [
  { method: 'POST', path: '/api/auth/login' },
  { method: 'POST', path: '/api/auth/register' },
  { method: 'POST', path: '/auth/refresh-token' },

  { method: 'GET', path: '/health' },
  { method: 'GET', path: '/status' },
  { method: 'GET', path: '/docs' },
  { method: 'GET', path: '/openapi' },

  { method: 'POST', path: '/api/upload/donation' },

  { method: 'GET', path: '/api/pulse/access-insight' },
  { method: 'GET', path: '/api/pulse/access-grants' },
  { method: 'GET', path: '/api/pulse/access-grants/grouped' },
  { method: 'GET', path: '/api/pulse/access-grants/resource/grouped' },
  { method: 'POST', path: '/api/pulse/simulate-access' },

  { method: 'ALL', path: '/api/zoi' },
  { method: 'ALL', path: '/api/Workspace' },
  { method: 'ALL', path: '/api/object' },
  { method: 'ALL', path: '/api/nasser' },
  { method: 'PATCH', path: '/api/nasser/:id' },
  
  { method: 'GET', path: '/api/user' },
  { method: 'GET', path: '/api/user/:id' },

  { method: 'GET', path: '/api/flow-template' },
  { method: 'POST', path: '/api/flow-template' },
  { method: 'GET', path: '/api/flow-template/:id' },

  { method: 'GET', path: '/api/document' },
  { method: 'GET', path: '/api/document/:id' },

  { method: 'GET', path: '/api/workspace' },
  { method: 'GET', path: '/api/workspace/:id' },

  { method: 'GET', path: '/api/workflow-template' },
  { method: 'GET', path: '/api/workflow-template/:id' },
  { method: 'POST', path: '/api/workflow-template' },

];


const publicPathFile = path.resolve('mocks/public-paths.json');
const PUBLIC_PATHS = new Set<string>(JSON.parse(fs.readFileSync(publicPathFile, 'utf-8')));

export const WHITELIST_RULES: WhitelistRule[] = rawWhitelistPaths.map((rule) => ({
  ...rule,
  matcher: match(rule.path, { decode: decodeURIComponent }),
}));

const WHITELIST_PATTERNS = WHITELIST_RULES.map((rule) => ({
  method: rule.method.toUpperCase(),
  regexp: pathToRegexp(rule.path),
}));

// Create matcher functions at startup
for (const rule of WHITELIST_RULES) {
  rule.matcher = match(rule.path, { decode: decodeURIComponent });
}

export function isWhitelisted(reqMethod: string, reqPath: string): boolean {
  return WHITELIST_RULES.some((rule) => {
    const methodMatches = rule.method === 'ALL' || rule.method === reqMethod;
    const pathMatches = rule.matcher(reqPath) !== false;
    return methodMatches && pathMatches;
  });
}

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

    if (isWhitelisted(req.method, req.path)) {
      return next.handle();
    }

    // if (PUBLIC_PATHS.has(req.path)) return next.handle();

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
