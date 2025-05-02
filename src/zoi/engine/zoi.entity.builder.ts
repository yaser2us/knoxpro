import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import 'reflect-metadata';  // IMPORTANT if not imported yet
import { console } from 'inspector';

const typeMap = {
  integer: 'int',
  number: 'float',
  string: 'varchar',
  boolean: 'bool',
  timestamp: 'timestamp',
  text: 'text',
};

export class ZoiEntityBuilder {
  static createFromJsonSchema(schema: any): Function {
    console.log("[zoi] yasser Creating entity from schema:", schema);//
    const entityClass = class {
      id: string;
      createdAt: Date; // Add createdAt
    };

    for (const key in schema.properties) {
      const prop = schema.properties[key];

      if (key !== 'id' && key !== 'createdAt') {
        Object.defineProperty(entityClass.prototype, key, {
          value: undefined,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
    }

    PrimaryGeneratedColumn('uuid')(entityClass.prototype, 'id');
    CreateDateColumn()(entityClass.prototype, 'createdAt'); // New

    for (const key in schema.properties) {
      if (key === 'id' || key === 'createdAt') continue;
      const prop = schema.properties[key];

      const isRequired = schema.required?.includes(key) ?? false;
      const columnType = typeMap[prop.format] || typeMap[prop.type] || 'varchar';

      Column({ type: columnType, nullable: !isRequired })(entityClass.prototype, key);
    }

    Entity(schema.type)(entityClass); // Use 'type' not 'title' for entity name!

    Object.defineProperty(entityClass, 'name', { value: schema.type });

    return entityClass;
  }
//
  static createFromJsonSchemaV1(schema: any): Function {
    const fields: { [key: string]: any } = {};

    console.log('Creating entity from schema:', schema);
    // 1. Dynamically build the class with real fields
    const entityClass = class {
      id: string; // Ensure 'id' field statically exists
    };

    for (const key in schema.properties) {
      const prop = schema.properties[key];

      if (key !== 'id') {
        // Dynamically define other fields
        Object.defineProperty(entityClass.prototype, key, {
          value: undefined,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
    }
//
    // 2. Decorate fields with correct TypeORM decorators
    PrimaryGeneratedColumn('uuid')(entityClass.prototype, 'id');

    for (const key in schema.properties) {
      if (key === 'id') continue;
      const prop = schema.properties[key];

      const isRequired = schema.required?.includes(key) ?? false;
      const columnType = typeMap[prop.format] || typeMap[prop.type] || 'varchar';

      Column({ type: columnType, nullable: !isRequired })(entityClass.prototype, key);
    }

    // 3. Decorate the class itself
    Entity(schema.title.toLowerCase())(entityClass);

    // 4. Rename the class nicely
    Object.defineProperty(entityClass, 'name', { value: schema.title });

    return entityClass;
  }
}
