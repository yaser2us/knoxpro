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
exports.Roles = void 0;
const typeorm_1 = require("typeorm");
const _1 = require(".");
let Roles = class Roles {
    id;
    name;
    key;
    isDefault;
    createdAt;
    updatedAt;
    users;
};
exports.Roles = Roles;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Roles.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 128,
        nullable: true,
        default: 'NULL',
    }),
    __metadata("design:type", String)
], Roles.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 128,
        nullable: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Roles.prototype, "key", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_default',
        type: 'boolean',
        default: 'false',
    }),
    __metadata("design:type", Boolean)
], Roles.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'created_at',
        type: 'timestamp',
        nullable: true,
        default: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Roles.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        nullable: true,
        default: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Roles.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => _1.Users, (item) => item.roles),
    __metadata("design:type", Array)
], Roles.prototype, "users", void 0);
exports.Roles = Roles = __decorate([
    (0, typeorm_1.Entity)('roles')
], Roles);
//# sourceMappingURL=roles.js.map