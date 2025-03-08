import { Repository } from 'typeorm';
import { Users } from '../Entity/users';
import { Query } from 'json-api-nestjs';
export declare class YourEntityRepository extends Repository<Users> {
    private readonly repo;
    constructor(repo: Repository<Users>);
    aggregateByField(field: string): Promise<any[]>;
    aggregateByFieldSort(query: Query<Users>, field: string): Promise<any[]>;
}
