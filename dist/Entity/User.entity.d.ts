export declare enum CommentKind {
    Comment = "COMMENT",
    Message = "MESSAGE",
    Note = "NOTE"
}
export type IUser = Users;
export declare class Users {
    id: number;
    text: string;
    kind: CommentKind;
    createdAt: Date;
    updatedAt: Date;
}
