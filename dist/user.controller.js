"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendUserController = void 0;
const common_1 = require("@nestjs/common");
const json_api_nestjs_1 = require("json-api-nestjs");
const users_1 = require("./Entity/users");
const user_repo_1 = require("./repo/user.repo");
let ExtendUserController = class ExtendUserController extends json_api_nestjs_1.JsonBaseController {
    yourEntityRepo;
    service;
    constructor(yourEntityRepo) {
        super();
        this.yourEntityRepo = yourEntityRepo;
    }
    async aggregate(field, query) {
        console.log(query, '[query]');
        return this.yourEntityRepo.aggregateByField(field);
    }
    getOne(id, query) {
        return super.getOne(id, query);
    }
    patchRelationship(id, relName, input) {
        return super.patchRelationship(id, relName, input);
    }
    postOne(inputData) {
        return super.postOne(inputData);
    }
    getAll(query) {
        console.log(query);
        return super.getAll(query);
    }
    testOne(id) {
        return 'this.exampleService.testMethode(id)';
    }
};
exports.ExtendUserController = ExtendUserController;
__decorate([
    (0, json_api_nestjs_1.InjectService)(),
    __metadata("design:type", Object)
], ExtendUserController.prototype, "service", void 0);
__decorate([
    (0, common_1.Get)('/aggregate'),
    __param(0, (0, common_1.Query)('field')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExtendUserController.prototype, "aggregate", null);
__decorate([
    (0, common_1.Get)(':id/example'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], ExtendUserController.prototype, "testOne", null);
exports.ExtendUserController = ExtendUserController = __decorate([
    (0, json_api_nestjs_1.JsonApi)(users_1.Users),
    __metadata("design:paramtypes", [user_repo_1.YourEntityRepository])
], ExtendUserController);
//# sourceMappingURL=user.controller.js.map