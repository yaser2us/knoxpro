// src/zoi/zoi-schema.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource, EntitySchema } from 'typeorm';

@Injectable()
export class ZoiSchemaService {
    constructor(private readonly dataSource: DataSource) { }

    async createPhysicalTable(tableName: string, fields: Record<string, any>) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        let createQuery = `CREATE TABLE "${tableName}" (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP DEFAULT NOW(),`;

        for (const [fieldName, fieldDef] of Object.entries(fields)) {
            if (fieldDef.type === 'string') {
                createQuery += `"${fieldName}" VARCHAR,`;
            } else if (fieldDef.type === 'number' || fieldDef.type === 'integer') {
                createQuery += `"${fieldName}" INT,`;
            } else if (fieldDef.type === 'boolean') {
                createQuery += `"${fieldName}" BOOLEAN,`;
            } else if (fieldDef.type === 'date-time') {
                createQuery += `"${fieldName}" TIMESTAMP,`;
            }
        }

        createQuery = createQuery.replace(/,$/, '') + ')';

        await queryRunner.query(createQuery);
        await queryRunner.release();
    }

    createDynamicEntitySchema(tableName: string, fields: Record<string, any>) {
        const columns: Record<string, any> = {
            id: {
                type: 'uuid',
                primary: true,
                generated: 'uuid',
            },
            createdAt: {
                type: 'timestamp',
                createDate: true,
            },
        };

        for (const [fieldName, fieldDef] of Object.entries(fields)) {
            if (fieldDef.type === 'string') {
                columns[fieldName] = { type: 'varchar', nullable: true };
            } else if (fieldDef.type === 'number' || fieldDef.type === 'integer') {
                columns[fieldName] = { type: 'int', nullable: true };
            } else if (fieldDef.type === 'boolean') {
                columns[fieldName] = { type: 'boolean', nullable: true };
            } else if (fieldDef.type === 'date-time') {
                columns[fieldName] = { type: 'timestamp', nullable: true };
            }
        }

        return new EntitySchema({
            name: tableName,
            tableName: tableName,
            columns,
        });
    }

    async registerEntityLive(entity: EntitySchema<any>) {
        const originalEntities = Array.isArray(this.dataSource.options.entities)
            ? this.dataSource.options.entities
            : [];

        const newEntities = [...originalEntities, entity];

        await this.dataSource.destroy();
        this.dataSource.setOptions({ entities: newEntities });
        await this.dataSource.initialize();
    }

}
