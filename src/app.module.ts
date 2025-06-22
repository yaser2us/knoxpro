import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JsonApiModule } from '@yaser2us/json-api-nestjs';
import { TypeOrmJsonApiModule } from "@yaser2us/json-api-nestjs-typeorm"
// import { JsonApiQuery } from 'nestjs-json-api';

// import {
//   // Users,
//   // Addresses,
//   // Comments,
//   // Roles,
//   // BookList,
//   User,
//   UserRole,
//   Role,
//   Tenant,
//   Permission,
//   AuditLog,
//   TenantSetting,
// } from './Entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource, DataSourceOptions, EntitySchema } from 'typeorm';
import { join } from 'path';
import * as process from 'process';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ExtendUserController } from './user.controller';
import { YourEntityRepository } from './repo/user.repo';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CombinedSlugService, QueryParamSlugService, SubdomainSlugService } from './common/slug.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE, RouterModule } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { SecurityModule } from './security/security.module';
import { RsaService } from 'src/security/security.service';
import { AccessControlInterceptor } from './common/interceptors/access.control.interceptor';

import dataSource, { config } from './database';

import { UUIDValidationPipe } from './common/pipe/uuid.pipe';
import { PulseInterceptor } from "./pulse/pulse.interceptor";
import { ZoiModule } from './zoi/zoi.module';

import {
  AccessAction,
  AccessEvent,
  ResourceAction,
  ResourceType,
  Role,
  RolePermission,
  User,
  UserRole,
  Workspace,
} from "./pulse/entity"

import { PulseModule } from './pulse/pulse.module';
//
import { Document, DocumentAttachment, DocumentFlow, DocumentSignature, DocumentTemplate, FlowTemplate } from './zoi/entity';
// import { DynamicEntityRegistry } from './zoi/dynamic.entity.registry';
// import { ZoiDynamicJsonApiModule } from './zoi/ZoiDynamicJsonApiModule';
// import { ZoiDocumentInterceptor } from './zoi/zoi.document.interceptor';
// const config: DataSourceOptions = {
//   type: 'postgres', //process.env['DB_TYPE'] as 'postgres' | 'postgres',
//   host: "localhost", // process.env['DB_HOST'],
//   port: 5432, //parseInt(`${process.env['DB_PORT']}`, 5432),
//   username: "postgres", //process.env['DB_USERNAME'],
//   password: "Odenza@2025", //process.env['DB_PASSWORD'],
//   database: "yasser", //process.env['DB_NAME'],
//   logging: 'all', //process.env['DB_LOGGING'] === '1',
//   entities: [join(__dirname, '/Entity/*{.ts,.js}')],
//   // migrations: [join(__dirname, '/migrations/**/*{.ts,.js}')],
//   // entities: [join(__dirname, '/entities/**/*{.ts,.js}')],
//   // ...(process.env['DB_TYPE'] === 'mysql' ? { connectorPackage: 'mysql2' } : {}),
// };

// const dataSource = new DataSource({ ...config });

import { WinstonLoggerService } from './common/logger/winston-logger.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { winstonConfig } from './common/logger/logger.config';
import { LoggerModule } from './common/logger/logger.module';
import { YasserNasser, Profile } from './core/entity';
import { School } from './core/entity/school.entity';
import { EnhancedPulseInterceptor } from './pulse/interceptor/enhanced.pulse.interceptor';
import { CorrectedPulseInterceptor } from './pulse/interceptor/enhanced.pulse.interceptor.v2';
import { EnhancedUserContextPipe } from './common/pipe/enhanced-user-context.pipe';
import { GlobalAccessContextInterceptor } from './common/interceptors/global-access-context.interceptor';
import { AccessContextGuard } from './common/guards/access-context.guard';
const entities: (Function | EntitySchema)[] = [
  User,
  Profile,
  Workspace,
  Role,
  UserRole,
  ResourceType,
  ResourceAction,
  RolePermission,
  AccessAction,
  AccessEvent,
  Document,
  DocumentAttachment,
  DocumentFlow,
  DocumentSignature,
  DocumentTemplate
];

@Module({
  imports: [
    RouterModule.register([]), // 👈 This line ensures ROUTES and ModulesContainer are initialized
    WinstonModule.forRoot(winstonConfig),
    LoggerModule,
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    SecurityModule,
    PulseModule,
    ZoiModule,
    // CacheModule.register({
    //   ttl: 3600, // Cache expiration time in seconds (1 hour)
    //   max: 1000, // Maximum items in cache
    // }),
    MulterModule.register({
      dest: './mocks/uploads', // Set the destination folder for uploaded files
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './mocks/uploads');
        },
        filename: (req, file, cb) => {

          // Access dynamic variable from the request body (e.g., req.body.dynamicName)
          const dynamicName = req.body.kind || 'defaultName';

          const fileExt = path.extname(file.originalname);
          const newFileName = `${dynamicName}_${Date.now()}${fileExt}`;

          cb(null, newFileName);

          // const fileExt = path.extname(file.originalname);
          // const randomName = Array(32)
          //   .fill(null)
          //   .map(() => Math.round(Math.random() * 16).toString(16))
          //   .join('');
          // cb(null, `${randomName}${fileExt}`);
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...config,
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
    }),
    // ZoiDynamicJsonApiModule.forRootAsync(),
    JsonApiModule.forRoot(TypeOrmJsonApiModule, {
      ...dataSource,
      entities: [
        School,
        User,
        Profile,
        Workspace,
        YasserNasser,
        Role,
        UserRole,
        ResourceType,
        ResourceAction,
        RolePermission,
        AccessAction,     // ✅ Add this
        AccessEvent,       // ✅ And this
        Document,
        DocumentAttachment,
        DocumentFlow,
        DocumentSignature,
        DocumentTemplate,
        FlowTemplate
      ],
      // controllers: [ExtendUserController],
      // providers: [YourEntityRepository],
      options: {
        debug: true,
        requiredSelectField: false,
        operationUrl: 'operation',
        pipeForId: UUIDValidationPipe,
        pipeForQuery: EnhancedUserContextPipe,  // ✨ Use custom pipe
        enableContext: true
      },
    }),
  ],
  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: CombinedSlugService,
      useFactory: () =>
        new CombinedSlugService([
          new QueryParamSlugService(),
          new SubdomainSlugService(),
        ]),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Access Context Guard runs second (after JWT)
    {
      provide: APP_GUARD,
      useClass: AccessContextGuard,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: AccessControlInterceptor, // ✅ Register interceptor globally
    // },

    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CorrectedPulseInterceptor //EnhancedPulseInterceptor //PulseInterceptor, // ✅ Register interceptor globally
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: GlobalAccessContextInterceptor,
    // },
    // {
    //   provide: APP_PIPE,
    //   useClass: EnhancedUserContextPipe,//
    // }
    // {
    //   provide: 'WinstonLoggerService',
    //   useClass: WinstonLoggerService
    // }
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ZoiDocumentInterceptor
    // }
    // EnhancedUserContextPipe
  ],
  exports: [
    // YourEntityRepository,
  ], // Export if needed in other modules
})
export class AppModule { }
