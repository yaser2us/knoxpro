export declare enum CommentKind {
    Comment = "COMMENT",
    Message = "MESSAGE",
    Note = "NOTE"
}
import { IUsers } from '.';
export type IComments = Comments;
export declare class Comments {
    id: number;
    text: string;
    kind: CommentKind;
    createdAt: Date;
    updatedAt: Date;
    createdBy: IUsers;
}
