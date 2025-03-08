import { JsonBaseController, JsonApiService, Query as QueryType, QueryOne, ResourceObject, EntityRelation, PatchRelationshipData, ResourceObjectRelationships, PostData } from 'json-api-nestjs';
import { Users } from './Entity/users';
import { YourEntityRepository } from './repo/user.repo';
export declare class ExtendUserController extends JsonBaseController<Users> {
    private readonly yourEntityRepo;
    service: JsonApiService<Users>;
    constructor(yourEntityRepo: YourEntityRepository);
    aggregate(field: string, query: QueryType<Users>): Promise<any[]>;
    getOne(id: string | number, query: QueryOne<Users>): Promise<ResourceObject<Users>>;
    patchRelationship<Rel extends EntityRelation<Users>>(id: string | number, relName: Rel, input: PatchRelationshipData): Promise<ResourceObjectRelationships<Users, Rel>>;
    postOne(inputData: PostData<Users>): Promise<ResourceObject<Users>>;
    getAll(query: QueryType<Users>): Promise<ResourceObject<Users, 'array'>>;
    testOne(id: string): string;
}
