"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const json_api_nestjs_1 = require("json-api-nestjs");
const Entity_1 = require("./Entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const path_1 = require("path");
const config_1 = require("@nestjs/config");
const user_controller_1 = require("./user.controller");
const user_repo_1 = require("./repo/user.repo");
const config = {
    type: 'postgres',
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Odenza@2025",
    database: "yasser",
    logging: 'all',
    entities: [(0, path_1.join)(__dirname, '/Entity/*{.ts,.js}')],
};
const dataSource = new typeorm_2.DataSource({ ...config });
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                ...config,
            }),
            json_api_nestjs_1.JsonApiModule.forRoot(json_api_nestjs_1.TypeOrmJsonApiModule, {
                ...dataSource,
                entities: [
                    Entity_1.Users,
                    Entity_1.Addresses,
                    Entity_1.Comments,
                    Entity_1.Roles,
                    Entity_1.BookList,
                ],
                controllers: [user_controller_1.ExtendUserController],
                providers: [user_repo_1.YourEntityRepository],
                options: {
                    debug: true,
                    requiredSelectField: false,
                    operationUrl: 'operation',
                },
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map