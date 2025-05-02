import { EntityManager } from "typeorm";

export async function patchEntityParamMap(
    entityManager: EntityManager,
    entityParamMap: Map<any, any>,
    entityClass: Function,
) {
    const repo = entityManager.getRepository(entityClass);

    entityParamMap.set(entityClass, {
        props: repo.metadata.columns.map(c => c.propertyName),
        primaryColumnName: repo.metadata.primaryColumns[0]?.propertyName,
        primaryColumnType: 'uuid',
        typeName: entityClass.name,
        className: entityClass.name,
        relations: repo.metadata.relations.map(r => r.propertyName),
        propsType: {}, propsNullable: {}, propsArrayType: {}, relationProperty: {}
    });
}
