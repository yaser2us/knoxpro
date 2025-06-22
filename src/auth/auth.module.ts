import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from './constants';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';


// import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtStrategy } from './strategy/jwt.v2.strategy';

// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';

import { AuthController } from './auth.v2.controller';
import { AuthService } from './auth.v2.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile, User, Workspace } from 'src/core/entity';

@Module({
  imports: [
    // Register entities for dependency injection
    TypeOrmModule.forFeature([User, Profile, Workspace]),
    // Import PassportModule for authentication
    PassportModule,
    UsersModule,
    // JWT module configuration
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { 
        expiresIn: '24h', // Extended to 24 hours for better UX
        issuer: 'pulse-api',
        audience: 'pulse-app'
      },
    }),
    // JwtModule.register({
    //   global: true,
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '1h' },
    // }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtModule, // Export for use in other modules
  ],
})
export class AuthModule {}
