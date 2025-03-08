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
exports.Addresses = void 0;
const typeorm_1 = require("typeorm");
const _1 = require(".");
let Addresses = class Addresses {
    id;
    city;
    state;
    country;
    createdAt;
    updatedAt;
    user;
};
exports.Addresses = Addresses;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Addresses.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 70,
        nullable: true,
        default: 'NULL',
    }),
    __metadata("design:type", String)
], Addresses.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 70,
        nullable: true,
        default: 'NULL',
    }),
    __metadata("design:type", String)
], Addresses.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 68,
        nullable: true,
        default: 'NULL',
    }),
    __metadata("design:type", String)
], Addresses.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'created_at',
        type: 'timestamp',
        nullable: true,
        default: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Addresses.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        nullable: true,
        default: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Addresses.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => _1.Users, (item) => item.addresses),
    __metadata("design:type", Object)
], Addresses.prototype, "user", void 0);
exports.Addresses = Addresses = __decorate([
    (0, typeorm_1.Entity)('addresses')
], Addresses);
//# sourceMappingURL=addresses.js.map