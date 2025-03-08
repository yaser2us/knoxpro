// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Entity, Column, PrimaryGeneratedColumn, ObjectType } from 'typeorm';

// Define a base class with common columns
@Entity()
class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Add other common columns here
}
// Function to create TypeORM entity dynamically from JSON schema
function createEntityFromSchema(schema: Record<string, any>, entityName: string): ObjectType<any> {
  @Entity({ name: entityName })
  class DynamicEntity extends BaseEntity {
    // @PrimaryGeneratedColumn()
    // id: number;

    constructor(data: any) {
      super(); // Call the constructor of the base class
      console.log('[yasser]]', data, schema)
      Object.assign(this, schema);

      // Object.keys(schema).forEach((key) => {
      //   const columnType = schema[key].type;
      //   // Set the property and apply @Column dynamically
      //   Object.defineProperty(this, key, {
      //     value: key,
      //   });

      //   if (key !== 'id') {
      //     Column(columnType,{ name: key});
      //   }
      // });
      console.log('[yasser] this', this)
    }
  }

  return DynamicEntity;
}

// Example JSON schema
const jsonSchema = {
  // id: { type: 'number' },
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  isActive: { type: "boolean"}
};

const entityName = 'DynamicEntity';

// Create the dynamic entity
const User = createEntityFromSchema(jsonSchema, entityName);

export { User };


@Entity()
class UserX {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
}