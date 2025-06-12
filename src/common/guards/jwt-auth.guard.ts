import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';

//   @Injectable()
//   export class JwtAuthGuard extends AuthGuard('jwt') {
//     canActivate(context: ExecutionContext) {
//       // Add your custom authentication logic here
//       // for example, call super.logIn(request) to establish a session.
//       return super.canActivate(context);
//     }

//     handleRequest(err, user, info) {
//       // You can throw an exception based on either "info" or "err" arguments
//       if (err || !user) {
//         throw err || new UnauthorizedException();
//       }
//       return user;
//     }
//   }

export const ROUTE_ACCESS_CONFIG = {
    whitelist: [
        { method: 'POST', path: '/auth/login' },
        { method: 'POST', path: '/auth/register' },
        { method: 'GET', path: '/api' },
        { method: 'GET', path: '/api/public-key' },
        // { method: 'POST', path: '/api/decrypt' },
        // { method: 'POST', path: '/api/security/decrypt' },
        // { method: 'POST', path: '/api/security/encrypt' },
        // { method: 'GET', path: '/api/security/init' },
    ],
    blacklist: [
        { method: 'GET', path: '/admin' },
        { method: 'POST', path: '/admin/create' },
    ],
};

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {

        const req = context.switchToHttp().getRequest();
        const { method, route } = req;

        // ✅ Check if the route is Whitelisted (No JWT required)
        const isWhitelisted = ROUTE_ACCESS_CONFIG.whitelist.some(
            // (item) => item.method === method && route?.path.startsWith(item.path),
            (item) => item.method.includes(method.toUpperCase()) && route?.path === item.path,
            // route.methods.includes(method.toUpperCase()) && originalUrl.startsWith(route.path),
        );

        if (isWhitelisted) {
            // console.log(`[JwtAuthGuard] Allowed: ${method} ${route?.path} (Whitelisted) ${isWhitelisted}`);
            // console.log(route?.path.startsWith('/api'), '[JwtAuthGuard] route?.path.startsWith(item.path)')
            return true; // ✅ Allow access without JWT
        }

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        // console.log(isPublic, '[JwtAuthGuard]')

        if (isPublic) {
            return true;
        }

        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        // console.log('[JwtAuthGuard] user', user)
        return user;
    }

}
