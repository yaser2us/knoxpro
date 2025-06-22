// // Fixed Generic Controller with correct TypeScript types
// import { 
//     JsonApi, 
//     JsonBaseController, 
//     InjectService, 
//     JsonApiService,
//     Query,
//     ResourceObject,
//     excludeMethod,
//     PostData,
//     PatchData
//   } from 'json-api-nestjs';
//   import { Controller, Inject, ForbiddenException, BadRequestException } from '@nestjs/common';
//   import { ObjectLiteral } from 'typeorm';
//   import { PulseAccessService } from '../pulse-access.service';
  
//   // Fixed: Add ObjectLiteral constraint and correct method signatures
//   export class GenericAccessController<T extends ObjectLiteral = any> extends JsonBaseController<T> {
//     @InjectService() 
//     public service: JsonApiService<T>;
  
//     constructor(
//       @Inject('ENTITY_NAME') private readonly entityName: string,
//       @Inject(PulseAccessService) private readonly pulseAccess: PulseAccessService
//     ) {
//       super();
//     }
  
//     // Fixed: Correct method signature for getAll
//     public override async getAll(query: Query<T>): Promise<ResourceObject<T, 'array'>> {
//       const user = this.getCurrentUser();
      
//       if (!user) {
//         throw new ForbiddenException('Authentication required');
//       }
  
//       console.log(`🔍 [${this.entityName}] getAll - User:`, user.id);
  
//       // Apply access filters for this entity type
//       const filteredQuery = await this.applyAccessFilters(query, user);
      
//       console.log(`🔒 [${this.entityName}] Filtered query:`, filteredQuery);
  
//       return this.service.getAll(filteredQuery);
//     }
  
//     // Fixed: Correct method signature for getOne
//     public override async getOne(id: string, query: Query<T>): Promise<ResourceObject<T, 'object'>> {
//       const user = this.getCurrentUser();
      
//       if (!user) {
//         throw new ForbiddenException('Authentication required');
//       }
  
//       console.log(`🔍 [${this.entityName}] getOne - ID: ${id}, User: ${user.id}`);
  
//       // Check individual resource access
//       const hasAccess = await this.pulseAccess.canAccess({
//         role: user.role,
//         actorId: user.id,
//         workspaceId: user.workspaceId,
//         resourceId: id,
//         resourceType: this.entityName,
//         actionType: 'view',
//         userMetadata: user.metadata
//       });
  
//       if (!hasAccess.granted) {
//         throw new ForbiddenException(`Access denied to ${this.entityName} ${id}`);
//       }
  
//       return this.service.getOne(id, query);
//     }
  
//     // Fixed: Correct method signature for postOne (only takes PostData<T>)
//     public override async postOne(inputData: PostData<T>): Promise<ResourceObject<T, 'object'>> {
//       const user = this.getCurrentUser();
      
//       if (!user) {
//         throw new ForbiddenException('Authentication required');
//       }
  
//       console.log(`➕ [${this.entityName}] postOne - User: ${user.id}`);
  
//       // Check create permission
//       const hasAccess = await this.pulseAccess.canAccess({
//         role: user.role,
//         actorId: user.id,
//         workspaceId: user.workspaceId,
//         resourceType: this.entityName,
//         actionType: 'create',
//         userMetadata: user.metadata
//       });
  
//       if (!hasAccess.granted) {
//         throw new ForbiddenException(`Create access denied for ${this.entityName}`);
//       }
  
//       // Add workspace and owner info automatically
//       if (inputData.data?.attributes) {
//         (inputData.data.attributes as any).workspaceId = user.workspaceId;
//         if (this.hasOwnerField(this.entityName)) {
//           (inputData.data.attributes as any).createdBy = user.id;
//         }
//         (inputData.data.attributes as any).createdAt = new Date();
//       }
  
//       return this.service.postOne(inputData);
//     }
  
//     // Fixed: Correct method signature for patchOne (takes id and PatchData<T>)
//     public override async patchOne(id: string | number, inputData: PatchData<T>): Promise<ResourceObject<T, 'object'>> {
//       const user = this.getCurrentUser();
      
//       if (!user) {
//         throw new ForbiddenException('Authentication required');
//       }
  
//       console.log(`✏️ [${this.entityName}] patchOne - ID: ${id}, User: ${user.id}`);
  
//       const hasAccess = await this.pulseAccess.canAccess({
//         role: user.role,
//         actorId: user.id,
//         workspaceId: user.workspaceId,
//         resourceId: id.toString(),
//         resourceType: this.entityName,
//         actionType: 'edit',
//         userMetadata: user.metadata
//       });
  
//       if (!hasAccess.granted) {
//         throw new ForbiddenException(`Edit access denied for ${this.entityName} ${id}`);
//       }
  
//       // Add updated timestamp
//       if (inputData.data?.attributes) {
//         (inputData.data.attributes as any).updatedAt = new Date();
//       }
  
//       return this.service.patchOne(id, inputData);
//     }
  
//     // Fixed: Correct method signature for deleteOne (only takes id)
//     public override async deleteOne(id: string | number): Promise<void> {
//       const user = this.getCurrentUser();
      
//       if (!user) {
//         throw new ForbiddenException('Authentication required');
//       }
  
//       console.log(`🗑️ [${this.entityName}] deleteOne - ID: ${id}, User: ${user.id}`);
  
//       const hasAccess = await this.pulseAccess.canAccess({
//         role: user.role,
//         actorId: user.id,
//         workspaceId: user.workspaceId,
//         resourceId: id.toString(),
//         resourceType: this.entityName,
//         actionType: 'delete',
//         userMetadata: user.metadata
//       });
  
//       if (!hasAccess.granted) {
//         throw new ForbiddenException(`Delete access denied for ${this.entityName} ${id}`);
//       }
  
//       return this.service.deleteOne(id);
//     }
  
//     // Fixed: Correct Query<T> type constraint
//     private async applyAccessFilters(query: Query<T>, user: any): Promise<Query<T>> {
//       try {
//         const grantedTypes = await this.pulseAccess.getGrantedResourceTypes(user.id, user.workspaceId);
//         const entityGrants = grantedTypes.filter(g => g.resourceType === this.entityName);
  
//         console.log(`🔑 [${this.entityName}] User grants:`, entityGrants);
  
//         const filters: any = {};
  
//         // Role-based access (most permissive)
//         if (entityGrants.some(g => g.grantedBy === 'role_permission')) {
//           console.log(`🔓 [${this.entityName}] Role-based access granted`);
//           filters.workspaceId = { eq: user.workspaceId };
//         } else if (this.hasOwnerField(this.entityName)) {
//           // Owner-based access
//           console.log(`👤 [${this.entityName}] Owner-based access applied`);
//           filters.createdBy = { eq: user.id };
//         } else {
//           // Very restrictive for entities without owner field
//           console.log(`🚫 [${this.entityName}] No access - applying restrictive filter`);
//           filters.id = { eq: 'non-existent-id' };
//         }
  
//         return {
//           ...query,
//           filter: {
//             ...query.filter,
//             ...filters
//           }
//         };
//       } catch (error) {
//         console.error(`❌ [${this.entityName}] Error applying access filters:`, error);
//         // Fail secure - no access
//         return {
//           ...query,
//           filter: {
//             ...query.filter,
//             id: { eq: 'non-existent-id' }
//           }
//         };
//       }
//     }
  
//     private hasOwnerField(entityName: string): boolean {
//       // You can make this configurable per entity
//       const entitiesWithOwner = ['document', 'nasser', 'project', 'task', 'note'];
//       return entitiesWithOwner.includes(entityName);
//     }
  
//     private getCurrentUser(): any {
//       // Get user from request context
//       // This is a simplified implementation - you'd use your auth system
//       return {
//         id: 'user-123',
//         role: 'user',
//         workspaceId: 'workspace-456',
//         metadata: {}
//       };
//     }
//   }
  
//   // Alternative approach: Create the controller class dynamically without inheritance issues
//   export function createGenericAccessController<T extends ObjectLiteral>(
//     EntityClass: new () => T,
//     entityName: string
//   ): any {
//     @JsonApi(EntityClass, {
//       allowMethod: excludeMethod([]),
//       overrideRoute: entityName,
//       requiredSelectField: false
//     })
//     @Controller(`api/${entityName}`)
//     class DynamicAccessController extends JsonBaseController<T> {
//       @InjectService() 
//       public service: JsonApiService<T>;
  
//       constructor(
//         @Inject(PulseAccessService) private readonly pulseAccess: PulseAccessService
//       ) {
//         super();
//       }
  
//       public override async getAll(query: Query<T>): Promise<ResourceObject<T, 'array'>> {
//         const user = this.getCurrentUser();
        
//         if (!user) {
//           throw new ForbiddenException('Authentication required');
//         }
  
//         console.log(`🔍 [${entityName}] getAll - User:`, user.id);
  
//         const filteredQuery = await this.applyAccessFilters(query, user);
        
//         return this.service.getAll(filteredQuery);
//       }
  
//       public override async getOne(id: string, query: Query<T>): Promise<ResourceObject<T, 'object'>> {
//         const user = this.getCurrentUser();
        
//         if (!user) {
//           throw new ForbiddenException('Authentication required');
//         }
  
//         const hasAccess = await this.pulseAccess.canAccess({
//           role: user.role,
//           actorId: user.id,
//           workspaceId: user.workspaceId,
//           resourceId: id,
//           resourceType: entityName,
//           actionType: 'view',
//           userMetadata: user.metadata
//         });
  
//         if (!hasAccess.granted) {
//           throw new ForbiddenException(`Access denied to ${entityName} ${id}`);
//         }
  
//         return this.service.getOne(id, query);
//       }
  
//       public override async postOne(inputData: PostData<T>): Promise<ResourceObject<T, 'object'>> {
//         const user = this.getCurrentUser();
        
//         if (!user) {
//           throw new ForbiddenException('Authentication required');
//         }
  
//         const hasAccess = await this.pulseAccess.canAccess({
//           role: user.role,
//           actorId: user.id,
//           workspaceId: user.workspaceId,
//           resourceType: entityName,
//           actionType: 'create',
//           userMetadata: user.metadata
//         });
  
//         if (!hasAccess.granted) {
//           throw new ForbiddenException(`Create access denied for ${entityName}`);
//         }
  
//         // Add workspace and owner info
//         if (inputData.data?.attributes) {
//           (inputData.data.attributes as any).workspaceId = user.workspaceId;
//           (inputData.data.attributes as any).createdBy = user.id;
//           (inputData.data.attributes as any).createdAt = new Date();
//         }
  
//         return this.service.postOne(inputData);
//       }
  
//       public override async patchOne(id: string | number, inputData: PatchData<T>): Promise<ResourceObject<T, 'object'>> {
//         const user = this.getCurrentUser();
        
//         if (!user) {
//           throw new ForbiddenException('Authentication required');
//         }
  
//         const hasAccess = await this.pulseAccess.canAccess({
//           role: user.role,
//           actorId: user.id,
//           workspaceId: user.workspaceId,
//           resourceId: id.toString(),
//           resourceType: entityName,
//           actionType: 'edit',
//           userMetadata: user.metadata
//         });
  
//         if (!hasAccess.granted) {
//           throw new ForbiddenException(`Edit access denied for ${entityName} ${id}`);
//         }
  
//         if (inputData.data?.attributes) {
//           (inputData.data.attributes as any).updatedAt = new Date();
//         }
  
//         return this.service.patchOne(id, inputData);
//       }
  
//       public override async deleteOne(id: string | number): Promise<void> {
//         const user = this.getCurrentUser();
        
//         if (!user) {
//           throw new ForbiddenException('Authentication required');
//         }
  
//         const hasAccess = await this.pulseAccess.canAccess({
//           role: user.role,
//           actorId: user.id,
//           workspaceId: user.workspaceId,
//           resourceId: id.toString(),
//           resourceType: entityName,
//           actionType: 'delete',
//           userMetadata: user.metadata
//         });
  
//         if (!hasAccess.granted) {
//           throw new ForbiddenException(`Delete access denied for ${entityName} ${id}`);
//         }
  
//         return this.service.deleteOne(id);
//       }
  
//       private async applyAccessFilters(query: Query<T>, user: any): Promise<Query<T>> {
//         try {
//           const grantedTypes = await this.pulseAccess.getGrantedResourceTypes(user.id, user.workspaceId);
//           const entityGrants = grantedTypes.filter(g => g.resourceType === entityName);
  
//           const filters: any = {};
  
//           if (entityGrants.some(g => g.grantedBy === 'role_permission')) {
//             filters.workspaceId = { eq: user.workspaceId };
//           } else if (this.hasOwnerField(entityName)) {
//             filters.createdBy = { eq: user.id };
//           } else {
//             filters.id = { eq: 'non-existent-id' };
//           }
  
//           return {
//             ...query,
//             filter: {
//               ...query.filter,
//               ...filters
//             }
//           };
//         } catch (error) {
//           console.error(`❌ [${entityName}] Error applying access filters:`, error);
//           return {
//             ...query,
//             filter: {
//               ...query.filter,
//               id: { eq: 'non-existent-id' }
//             }
//           };
//         }
//       }
  
//       private hasOwnerField(entityName: string): boolean {
//         const entitiesWithOwner = ['document', 'nasser', 'project', 'task', 'note'];
//         return entitiesWithOwner.includes(entityName);
//       }
  
//       private getCurrentUser(): any {
//         // You'll need to implement this to get user from request context
//         return {
//           id: 'user-123',
//           role: 'user',
//           workspaceId: 'workspace-456',
//           metadata: {}
//         };
//       }
//     }
  
//     // Set a meaningful name for the class
//     Object.defineProperty(DynamicAccessController, 'name', { 
//       value: `${entityName.charAt(0).toUpperCase() + entityName.slice(1)}Controller` 
//     });
  
//     return DynamicAccessController;
//   }
  
//   // Usage example with the factory function
//   import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
  
//   // Your existing entities
//   @Entity('users')
//   export class User extends ObjectLiteral {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;
  
//     @Column()
//     name: string;
  
//     @Column()
//     email: string;
  
//     @Column({ name: 'workspace_id' })
//     workspaceId: string;
//   }
  
//   @Entity('nasser')
//   export class Nasser extends ObjectLiteral {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;
  
//     @Column()
//     title: string;
  
//     @Column({ name: 'workspace_id' })
//     workspaceId: string;
  
//     @Column({ name: 'created_by' })
//     createdBy: string;
//   }
  
//   // Create controllers using the factory
//   const UserController = createGenericAccessController(User, 'user');
//   const NasserController = createGenericAccessController(Nasser, 'nasser');
  
//   // Service for creating dynamic entities and controllers
//   @Injectable()
//   export class DynamicEntityService {
//     private registeredControllers = new Map<string, any>();
  
//     async createEntity(entityDefinition: {
//       name: string;
//       tableName: string;
//       workspaceId: string;
//       fields: any[];
//     }): Promise<void> {
//       const { name } = entityDefinition;
  
//       // 1. Create TypeORM entity class
//       const EntityClass = this.createEntityClass(entityDefinition);
  
//       // 2. Create controller using the factory
//       const ControllerClass = createGenericAccessController(EntityClass, name);
  
//       // 3. Store reference
//       this.registeredControllers.set(name, ControllerClass);
  
//       console.log(`✅ Created entity and controller for: ${name}`);
//       console.log(`📍 Available at: /api/${name}`);
//     }
  
//     private createEntityClass(entityDefinition: any): any {
//       const { tableName, fields } = entityDefinition;
  
//       @Entity(tableName)
//       class DynamicEntity extends ObjectLiteral {
//         @PrimaryGeneratedColumn('uuid')
//         id: string;
  
//         @Column({ name: 'workspace_id' })
//         workspaceId: string;
  
//         @Column({ name: 'created_by', nullable: true })
//         createdBy: string;
  
//         @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//         createdAt: Date;
  
//         @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//         updatedAt: Date;
//       }
  
//       // Add custom fields
//       for (const field of fields) {
//         const columnOptions = this.getColumnOptions(field);
//         Column(columnOptions)(DynamicEntity.prototype, field.name);
//       }
  
//       return DynamicEntity;
//     }
  
//     private getColumnOptions(field: any): any {
//       const options: any = { nullable: !field.required };
  
//       switch (field.type) {
//         case 'string': options.type = 'varchar'; break;
//         case 'number': options.type = 'decimal'; break;
//         case 'boolean': options.type = 'boolean'; break;
//         case 'date': options.type = 'timestamp'; break;
//         case 'json': options.type = 'jsonb'; break;
//         default: options.type = 'varchar';
//       }
  
//       return options;
//     }
  
//     getController(entityName: string): any {
//       return this.registeredControllers.get(entityName);
//     }
//   }
  
//   // Module setup
//   @Module({
//     imports: [
//       JsonApiModule.forRoot(TypeOrmJsonApiModule, {
//         entities: [User, Nasser], // Static entities
//         controllers: [
//           UserController,
//           NasserController
//         ],
//         options: {
//           requiredSelectField: false,
//           debug: process.env.NODE_ENV === 'development'
//         }
//       }),
//       PulseModule
//     ],
//     providers: [
//       DynamicEntityService
//     ]
//   })
//   export class FixedApiModule {}