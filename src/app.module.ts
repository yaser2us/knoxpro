import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JsonApiModule, TypeOrmJsonApiModule } from 'json-api-nestjs';
import {
  Users,
  Addresses,
  Comments,
  Roles,
  BookList,
} from './Entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as process from 'process';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExtendUserController } from './user.controller';
import { YourEntityRepository } from './repo/user.repo';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CombinedSlugService, QueryParamSlugService, SubdomainSlugService } from './common/slug.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { SecurityModule } from './security/security.module';


const config: DataSourceOptions = {
  type: 'postgres', //process.env['DB_TYPE'] as 'postgres' | 'postgres',
  host: "localhost", // process.env['DB_HOST'],
  port: 5432, //parseInt(`${process.env['DB_PORT']}`, 5432),
  username: "postgres", //process.env['DB_USERNAME'],
  password: "Odenza@2025", //process.env['DB_PASSWORD'],
  database: "yasser", //process.env['DB_NAME'],
  logging: 'all', //process.env['DB_LOGGING'] === '1',
  entities: [join(__dirname, '/Entity/*{.ts,.js}')],
  // migrations: [join(__dirname, '/migrations/**/*{.ts,.js}')],
  // entities: [join(__dirname, '/entities/**/*{.ts,.js}')],
  // ...(process.env['DB_TYPE'] === 'mysql' ? { connectorPackage: 'mysql2' } : {}),
};

const dataSource =  new DataSource({ ...config });



@Module({
  imports: [
    AuthModule,
    UsersModule,
    SecurityModule,
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
    }),
    JsonApiModule.forRoot(TypeOrmJsonApiModule, {
      ...dataSource,
      entities: [
        Users,
        Addresses,
        Comments,
        Roles,
        BookList,
      ],
      controllers: [ExtendUserController],
      providers: [YourEntityRepository],
      options: {
        debug: true,
        requiredSelectField: false,
        operationUrl: 'operation',
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
  ],
  // exports: [YourEntityRepository], // Export if needed in other modules
})
export class AppModule { }
