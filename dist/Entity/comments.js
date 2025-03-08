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
exports.Comments = exports.CommentKind = void 0;
const typeorm_1 = require("typeorm");
var CommentKind;
(function (CommentKind) {
    CommentKind["Comment"] = "COMMENT";
    CommentKind["Message"] = "MESSAGE";
    CommentKind["Note"] = "NOTE";
})(CommentKind || (exports.CommentKind = CommentKind = {}));
const _1 = require(".");
let Comments = class Comments {
    id;
    text;
    kind;
    createdAt;
    updatedAt;
    createdBy;
};
exports.Comments = Comments;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Comments.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: false,
    }),
    __metadata("design:type", String)
], Comments.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CommentKind,
        nullable: false,
    }),
    __metadata("design:type", String)
], Comments.prototype, "kind", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'created_at',
        type: 'timestamp',
        nullable: true,
        default: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Comments.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        nullable: true,
        default: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Comments.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => _1.Users, (item) => item.id),
    (0, typeorm_1.JoinColumn)({
        name: 'created_by',
    }),
    __metadata("design:type", Object)
], Comments.prototype, "createdBy", void 0);
exports.Comments = Comments = __decorate([
    (0, typeorm_1.Entity)('comments')
], Comments);
//# sourceMappingURL=comments.js.map