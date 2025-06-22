// // src/auth/strategy/jwt.strategy.ts
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, ExtractJwt } from 'passport-jwt';
// import { AuthService } from '../auth.v2.service';
// import { jwtConstants } from '../constants';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//     constructor(private authService: AuthService) {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             ignoreExpiration: false,
//             secretOrKey: jwtConstants.secret,
//             issuer: 'pulse-api',
//             audience: 'pulse-app',
//         });
//     }

//     async validate(payload: any): Promise<any> {
//         console.log('[JwtStrategy] Validating payload:', {
//             sub: payload.sub,
//             email: payload.email,
//             workspaceId: payload.workspaceId
//         });

//         // Validate user exists and is active
//         const user = await this.authService.validateUser(payload.sub);

//         if (!user) {
//             console.error('[JwtStrategy] User not found or inactive:', payload.sub);
//             throw new UnauthorizedException('Invalid token or user inactive');
//         }

//         // Return user object that will be attached to request.user
//         return {
//             id: user.id,
//             email: user.email,
//             username: user.username,
//             status: user.status,
//             workspaceId: user.workspace?.id,
//             profile: user.profile,
//             workspace: user.workspace,
//             metadata: user.metadata,
//             // Add computed properties for easier access
//             fullName: `${user.profile?.firstName} ${user.profile?.lastName}`.trim(),
//             isActive: user.status === 'active'
//         };
//     }
// }

// src/auth/strategy/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.v2.service';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
            issuer: 'pulse-api',
            audience: 'pulse-app',
        });
    }

    async validate(payload: any): Promise<any> {
        console.log('[JwtStrategy] Validating payload:', {
            sub: payload.sub,
            email: payload.email,
            workspaceId: payload.workspaceId,
            username: payload.username
        });

        // Handle different token formats for backward compatibility
        const userId = payload.sub || payload.id;
        
        if (!userId) {
            console.error('[JwtStrategy] No user ID in token payload');
            throw new UnauthorizedException('Invalid token format');
        }

        // Validate user exists and is active
        const user = await this.authService.validateUser(userId);
        
        if (!user) {
            console.error('[JwtStrategy] User not found or inactive:', userId);
            throw new UnauthorizedException('Invalid token or user inactive');
        }

        // Enhanced user object for request.user
        const userObject = {
            // Core user info
            id: user.id,
            email: user.email,
            username: user.username,
            status: user.status,
            
            // Workspace info
            workspaceId: user.workspaceId || user.workspace?.id,
            workspace: user.workspace,
            
            // Profile info
            profile: user.profile,
            
            // Metadata and additional info
            metadata: user.metadata,
            lastLoginAt: user.lastLoginAt,
            
            // Computed properties for easier access
            fullName: user.profile ? `${user.profile.firstName} ${user.profile.lastName}`.trim() : user.username,
            isActive: user.status === 'active',
            
            // Token info for audit trails
            tokenPayload: {
                iat: payload.iat,
                exp: payload.exp,
                iss: payload.iss,
                aud: payload.aud
            },
            
            // Add roles if available (for future use)
            roles: user.roles?.map(r => r.role?.name) || [],
            
            // Workspace context
            workspaceContext: {
                id: user.workspaceId || user.workspace?.id,
                name: user.workspace?.name,
                type: user.workspace?.type,
                slug: user.workspace?.slug
            }
        };

        console.log('[JwtStrategy] User validated successfully:', {
            userId: userObject.id,
            email: userObject.email,
            workspaceId: userObject.workspaceId,
            fullName: userObject.fullName
        });

        return userObject;
    }
}