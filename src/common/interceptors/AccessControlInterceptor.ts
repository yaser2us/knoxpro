import {
    CallHandler,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { AccessControl } from 'accesscontrol';
import { readFile } from '../read.file';

@Injectable()
export class AccessControlInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        console.log('[AccessControlInterceptor] path', req.route?.path);

        // ✅ Define routes to be whitelisted (no permission check needed)
        const whitelist = ['/api/auth/login', 'api/auth/register'];

        if (whitelist.includes(req.route?.path)) {
            // ✅ Skip permission check for whitelisted routes
            return next.handle();
        }
        // Determine the resource and action from the request
        // const resource = req.baseUrl.replace('/', ''); // Example: /users -> "users"
        // ✅ Extract resource name dynamically (e.g., "/users/:id" -> "users")
        const pathParts = req.route?.path?.split('/') || [];
        const resource = req.route?.path; //pathParts.length > 1 ? pathParts[2] : '';

        const method = req.method.toLowerCase(); // GET, POST, PUT, DELETE

        let action = '';
        switch (method) {
            case 'get':
                action = 'readAny';
                break;
            case 'post':
                action = 'createAny';
                break;
            case 'put':
            case 'patch':
                action = 'updateAny';
                break;
            case 'delete':
                action = 'deleteAny';
                break;
            default:
                throw new ForbiddenException('Unsupported request method');
        }

        console.log('[AccessControlInterceptor] action', action, resource, pathParts);

        const { params, user = {} } = req;

        const configType = await readFile("task");
        const configJSON = configType; //JSON.parse(configType);
        const {
            rule,
            schema,
            relationships,
            transform: { create = {} },
            roles = []
        } = configJSON;

        if (!user || !user.role) {
            throw new Error('User role is missing');
        }

        const ac = new AccessControl(roles);
        const permission = ac.can(user.role?.toLowerCase())[action](resource);
        if (!permission.granted) {
            throw new ForbiddenException('Access denied');
        }

        return next.handle().pipe(
            map((data) => {

                if (permission.granted) {
                    try {
                        console.log('[AccessControlInterceptor], granted', data);
                        return permission.filter(data); // ✅ Apply field-level filtering
                    } catch (e) {
                        console.log(e, '[AccessControlInterceptor] error')
                        throw new ForbiddenException('Access denied');
                    }
                }

                if (permission.granted && data.userId === user.id) {
                    return permission.filter(data); // ✅ Filter fields for own data
                }

                // return {}; // Return empty object if access is denied
                throw new ForbiddenException('Access denied');
            }),
        );
    }
}
