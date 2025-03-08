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
exports.Users = void 0;
const typeorm_1 = require("typeorm");
const _1 = require(".");
let Users = class Users {
    id;
    login;
    firstName;
    lastName;
    isActive;
    createdAt;
    updatedAt;
    addresses;
    manager;
    roles;
    comments;
    books;
};
exports.Users = Users;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Users.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Users.prototype, "login", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'first_name',
        type: 'varchar',
        length: 100,
        nullable: true,
        default: 'NULL',
    }),
    __metadata("design:type", String)
], Users.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'last_name',
        type: 'varchar',
        length: 100,
        nullable: true,
        default: 'NULL',
    }),
    __metadata("design:type", String)
], Users.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_active',
        type: 'boolean',
        width: 1,
        nullable: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Users.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'created_at',
        type: 'timestamp',
        nullable: true,
        default: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Users.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        nullable: true,
        default: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Users.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => _1.Addresses, (item) => item.id),
    (0, typeorm_1.JoinColumn)({
        name: 'addresses_id',
    }),
    __metadata("design:type", Object)
], Users.prototype, "addresses", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Users, (item) => item.id),
    (0, typeorm_1.JoinColumn)({
        name: 'manager_id',
    }),
    __metadata("design:type", Object)
], Users.prototype, "manager", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => _1.Roles, (item) => item.users),
    (0, typeorm_1.JoinTable)({
        name: 'users_have_roles',
        inverseJoinColumn: {
            referencedColumnName: 'id',
            name: 'roles_id',
        },
        joinColumn: {
            referencedColumnName: 'id',
            name: 'users_id',
        },
    }),
    __metadata("design:type", Array)
], Users.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => _1.Comments, (item) => item.createdBy),
    __metadata("design:type", Array)
], Users.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => _1.BookList, (item) => item.users),
    (0, typeorm_1.JoinTable)({
        name: 'users_have_book',
        inverseJoinColumn: {
            referencedColumnName: 'id',
            name: 'book_list_id',
        },
        joinColumn: {
            referencedColumnName: 'id',
            name: 'users_id',
        },
    }),
    __metadata("design:type", Array)
], Users.prototype, "books", void 0);
exports.Users = Users = __decorate([
    (0, typeorm_1.Entity)('users')
], Users);
//# sourceMappingURL=users.js.map