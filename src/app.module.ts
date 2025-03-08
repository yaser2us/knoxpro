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
  providers: [AppService],
  // exports: [YourEntityRepository], // Export if needed in other modules
})
export class AppModule { }
