import { IAddresses, IRoles, IComments, IBookList } from '.';
export type IUsers = Users;
export declare class Users {
    id: number;
    login: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    addresses: IAddresses;
    manager: IUsers;
    roles: IRoles[];
    comments: IComments[];
    books: IBookList[];
}
