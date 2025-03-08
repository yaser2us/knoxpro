import { IUsers } from '.';
export type IAddresses = Addresses;
export declare class Addresses {
    id: number;
    city: string;
    state: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
    user: IUsers;
}
