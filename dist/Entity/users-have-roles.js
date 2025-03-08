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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersHaveRoles = void 0;
const typeorm_1 = require("typeorm");
let UsersHaveRoles = class UsersHaveRoles {
    id;
    userId;
    roleId;
    createdAt;
    updatedAt;
};
exports.UsersHaveRoles = UsersHaveRoles;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UsersHaveRoles.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'users_id',
        type: 'int',
        nullable: false,
        unique: false,
    }),
    __metadata("design:type", Number)
], UsersHaveRoles.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'roles_id',
        type: 'int',
        nullable: false,
        unique: false,
    }),
    __metadata("design:type", Number)
], UsersHaveRoles.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'created_at',
        type: 'timestamp',
        nullable: true,
        default: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], UsersHaveRoles.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        nullable: true,
        default: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], UsersHaveRoles.prototype, "updatedAt", void 0);
exports.UsersHaveRoles = UsersHaveRoles = __decorate([
    (0, typeorm_1.Entity)('users_have_roles')
], UsersHaveRoles);
//# sourceMappingURL=users-have-roles.js.map