import { IUsers } from './users';
export type IBookList = BookList;
export declare class BookList {
    id: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    users: IUsers[];
}
