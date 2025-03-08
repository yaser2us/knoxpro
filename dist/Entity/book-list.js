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
exports.BookList = void 0;
const typeorm_1 = require("typeorm");
const users_1 = require("./users");
let BookList = class BookList {
    id;
    text;
    createdAt;
    updatedAt;
    users;
};
exports.BookList = BookList;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], BookList.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: false,
    }),
    __metadata("design:type", String)
], BookList.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'created_at',
        type: 'timestamp',
        nullable: true,
        default: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], BookList.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        nullable: true,
        default: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], BookList.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => users_1.Users, (item) => item.books),
    __metadata("design:type", Array)
], BookList.prototype, "users", void 0);
exports.BookList = BookList = __decorate([
    (0, typeorm_1.Entity)('book_list')
], BookList);
//# sourceMappingURL=book-list.js.map