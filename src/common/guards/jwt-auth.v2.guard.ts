// src/common/guards/jwt-auth.guard.ts
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';

export const ROUTE_ACCESS_CONFIG = {
    whitelist: [
        // Auth endpoints - public access
        { method: 'POST', path: '/auth/login' },
        { method: 'POST', path: '/auth/register' },
        { method: 'POST', path: '/auth/signin' }, // Legacy endpoint
        { method: 'POST', path: '/auth/login-legacy' }, // Legacy endpoint
        
        // API endpoints - public access
        { method: 'GET', path: '/api' },
        { method: 'GET', path: '/api/public-key' },
        
        // Health check endpoints
        { method: 'GET', path: '/health' },
        { method: 'GET', path: '/status' },
        
        // Documentation endpoints
        { method: 'GET', path: '/docs' },
        { method: 'GET', path: '/api-docs' },
        
        // Security endpoints that might be public
        // { method: 'POST', path: '/api/decrypt' },
        // { method: 'POST', path: '/api/security/decrypt' },
        // { method: 'POST', path: '/api/security/encrypt' },
        // { method: 'GET', path: '/api/security/init' },
    ],
    blacklist: [
        // Admin endpoints - always require authentication
        { method: 'GET', path: '/admin' },
        { method: 'POST', path: '/admin/create' },
        { method: 'PUT', path: '/admin' },
        { method: 'DELETE', path: '/admin' },
        
        // Sensitive API endpoints
        { method: 'DELETE', path: '/api/users' },
        { method: 'DELETE', path: '/api/workspaces' },
    ],
};

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const { method, route, url } = req;
        const requestMethod = method?.toUpperCase();
        const requestPath = route?.path || url;

        console.log(`[JwtAuthGuard] Checking: ${requestMethod} ${requestPath}`);

        // ✅ Step 1: Check if the route is explicitly Blacklisted (Always require JWT)
        const isBlacklisted = ROUTE_ACCESS_CONFIG.blacklist.some(
            (item) => item.method === requestMethod && requestPath === item.path,
        );

        if (isBlacklisted) {
            console.log(`[JwtAuthGuard] Blacklisted: ${requestMethod} ${requestPath} - JWT Required`);
            return super.canActivate(context);
        }

        // ✅ Step 2: Check if the route is Whitelisted (No JWT required)
        const isWhitelisted = ROUTE_ACCESS_CONFIG.whitelist.some(
            (item) => item.method === requestMethod && requestPath === item.path,
        );

        if (isWhitelisted) {
            console.log(`[JwtAuthGuard] Whitelisted: ${requestMethod} ${requestPath} - Access Granted`);
            return true; // ✅ Allow access without JWT
        }

        // ✅ Step 3: Check @Public() decorator on controller/method
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            console.log(`[JwtAuthGuard] Public decorator: ${requestMethod} ${requestPath} - Access Granted`);
            return true;
        }

        // ✅ Step 4: Default behavior - require JWT authentication
        console.log(`[JwtAuthGuard] Protected: ${requestMethod} ${requestPath} - JWT Required`);
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const { method, route, url } = req;
        const requestPath = route?.path || url;

        // Enhanced error handling with more context
        if (err) {
            console.error(`[JwtAuthGuard] Auth Error on ${method} ${requestPath}:`, err.message);
            throw err;
        }

        console.log(`[JwtAuthGuard] User found:`, user);

        if (!user) {
            console.error(`[JwtAuthGuard] No user found for ${method} ${requestPath}:`, info?.message || 'Unknown error');
            throw new UnauthorizedException({
                message: 'Authentication required',
                error: 'Unauthorized',
                statusCode: 401,
                timestamp: new Date().toISOString(),
                path: requestPath,
                details: info?.message || 'Invalid or missing authentication token'
            });
        }

        // ✅ User validation passed
        console.log(`[JwtAuthGuard] Auth Success: ${method} ${requestPath} - User: ${user.id} (${user.email})`);

        // Add additional context to user object for downstream use
        user.requestPath = requestPath;
        user.requestMethod = method;
        user.authenticatedAt = new Date().toISOString();

        return user;
    }

    // Override getRequest to add custom logic if needed
    getRequest(context: ExecutionContext) {
        return context.switchToHttp().getRequest();
    }
}