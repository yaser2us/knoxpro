import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UsersService) {
        super({
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConstants.secret, // Replace with your own secret key
        });
    }

    async validate(payload: any): Promise<any> {
        console.log('[JwtStrategy]', payload)
        const user = await this.userService.findOne(payload.username);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}