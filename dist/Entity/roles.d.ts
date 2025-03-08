import { IUsers } from '.';
export type IRoles = Roles;
export declare class Roles {
    id: number;
    name: string;
    key: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
    users: IUsers[];
}
