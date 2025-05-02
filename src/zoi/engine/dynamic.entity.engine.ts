import { EntitySchema } from 'typeorm';

export function createEntityFromJsonSchema(template: {
  type: string;
  schema: Record<string, any>;
}): EntitySchema {
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

  const properties = template.schema.properties || {};
  const requiredFields = new Set(template.schema.required || []);

  for (const [fieldName, fieldDefRaw] of Object.entries(properties)) {
    const fieldDef = fieldDefRaw as any; // or stricter later

    let columnType: any = 'varchar'; // default

    if (fieldDef.type === 'string') {
      if (fieldDef.format === 'date-time' || fieldDef.format === 'date') {
        columnType = 'timestamp';
      } else {
        columnType = 'varchar';
      }
    } else if (fieldDef.type === 'number' || fieldDef.type === 'integer') {
      columnType = 'int';
    } else if (fieldDef.type === 'boolean') {
      columnType = 'boolean';
    }

    columns[fieldName] = {
      type: columnType,
      nullable: !requiredFields.has(fieldName),
    };
  }

  return new EntitySchema({
    name: template.type,
    tableName: template.type,
    columns,
  });
}
