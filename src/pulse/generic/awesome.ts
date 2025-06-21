// // access-controlled-get-all.ts
// // Proof of Concept - Mock Access Function + getAll Integration

// import { Query } from '@klerick/json-api-nestjs';
// import { ResourceObject } from '@klerick/json-api-nestjs-shared';
// import { TypeOrmService } from '../service';
// import { ResultQueryExpression } from '../service/typeorm-utils.service';

// // ======================
// // MOCK ACCESS FUNCTION
// // ======================

// interface UserContext {
//   id: string;
//   workspaceId: string;
//   roles: string[];
// }

// interface AccessFunction {
//   (entityType: string, user: UserContext, workspace?: string): AccessChecker;
// }

// interface AccessChecker {
//   (runtimeContext?: any): Promise<string[]>;
// }

// // Mock implementation - returns hardcoded accessible IDs
// const mockAccessFunction: AccessFunction = (entityType, user, workspace) => {
//   return async (runtimeContext?) => {
//     console.log(`🔍 Access check: ${entityType} for user ${user.id} in workspace ${workspace}`);
    
//     // Mock logic based on entity type and user
//     switch (entityType) {
//       case 'Users':
//         if (user.roles.includes('admin')) {
//           return ['1', '2', '3', '4', '5']; // Admin sees all users
//         } else {
//           return ['1', '2']; // Regular user sees limited users
//         }
      
//       case 'Documents':
//         if (user.workspaceId === 'workspace-123') {
//           return ['10', '11', '12']; // User has access to these documents
//         } else {
//           return []; // No access to documents in other workspaces
//         }
      
//       case 'Projects':
//         return ['100', '101']; // User has access to these projects
        
//       default:
//         console.warn(`❌ Unknown entity type: ${entityType}`);
//         return []; // No access by default
//     }
//   };
// };

// // ======================
// // ACCESS CONTROLLED getAll
// // ======================

// export async function accessControlledGetAll<E extends object, IdKey extends string = 'id'>(
//   this: TypeOrmService<E, IdKey>,
//   query: Query<E, IdKey>,
//   accessFunction: AccessFunction,
//   userContext: UserContext
// ): Promise<ResourceObject<E, 'array', null, IdKey>> {
  
//   console.log('🚀 Starting access-controlled getAll...');
  
//   // Step 1: Get entity type from repository metadata
//   const entityType = this.repository.metadata.name;
//   console.log(`📋 Entity type: ${entityType}`);
  
//   // Step 2: Get accessible IDs using access function
//   const accessChecker = accessFunction(entityType, userContext, userContext.workspaceId);
//   const accessibleIds = await accessChecker();
  
//   console.log(`🔑 Accessible IDs for ${entityType}:`, accessibleIds);
  
//   // Step 3: If no access, return empty result immediately
//   if (accessibleIds.length === 0) {
//     console.log('❌ No accessible IDs - returning empty result');
//     return {
//       meta: {
//         pageNumber: query.page.number,
//         totalItems: 0,
//         pageSize: query.page.size,
//       },
//       data: [],
//     };
//   }
  
//   // Step 4: Create access expression for SQL WHERE clause
//   const accessExpression: ResultQueryExpression = {
//     alias: `${this.typeormUtilsService.currentAlias}.${this.typeormUtilsService.currentPrimaryColumn}`,
//     expression: `IN (:...accessibleIds)`,
//     params: {
//       name: 'accessibleIds',
//       val: accessibleIds
//     }
//   };
  
//   console.log('🔧 Access expression:', accessExpression);
  
//   // Step 5: Get original filter expressions
//   const originalTargetExpressions = this.typeormUtilsService.getFilterExpressionForTarget(query);
//   const originalRelationExpressions = this.typeormUtilsService.getFilterExpressionForRelation(query);
  
//   console.log('📊 Original target expressions:', originalTargetExpressions.length);
//   console.log('📊 Original relation expressions:', originalRelationExpressions.length);
  
//   // Step 6: Create combined expressions array with our access control
//   const combinedExpressions = [
//     ...originalTargetExpressions,
//     ...originalRelationExpressions,
//     accessExpression  // 🎯 Our access control injection!
//   ];
  
//   console.log('🔗 Total expressions (including access):', combinedExpressions.length);
  
//   // Step 7: Now we need to call the original getAll logic but with our modified expressions
//   // For this POC, let's manually build the query to see if our logic works
  
//   return await this.executeAccessControlledQuery(query, combinedExpressions);
// }

// // ======================
// // QUERY EXECUTION HELPER
// // ======================

// async function executeAccessControlledQuery<E extends object, IdKey extends string = 'id'>(
//   this: TypeOrmService<E, IdKey>,
//   query: Query<E, IdKey>,
//   expressions: ResultQueryExpression[]
// ): Promise<ResourceObject<E, 'array', null, IdKey>> {
  
//   console.log('⚡ Executing access-controlled query...');
  
//   const { page } = query;
//   const skip = (page.number - 1) * page.size;
  
//   // Build query with access control
//   const queryBuilder = this.repository
//     .createQueryBuilder(this.typeormUtilsService.currentAlias);
  
//   // Apply all expressions (original filters + our access control)
//   for (const i in expressions) {
//     const { params, alias, expression } = expressions[i];
    
//     const expressionParts: string[] = [];
//     if (alias) {
//       expressionParts.push(alias);
//     }
//     expressionParts.push(expression);
    
//     // Add WHERE clause
//     queryBuilder[i === '0' ? 'where' : 'andWhere'](expressionParts.join(' '));
    
//     // Set parameters
//     if (params) {
//       if (Array.isArray(params)) {
//         for (const { name, val } of params) {
//           queryBuilder.setParameters({ [name]: val });
//         }
//       } else {
//         queryBuilder.setParameters({ [params.name]: params.val });
//       }
//     }
//   }
  
//   // Apply pagination
//   queryBuilder.offset(skip).limit(page.size);
  
//   // Get count for pagination meta
//   const totalItems = await queryBuilder.getCount();
  
//   // Get actual data
//   const resultData = await queryBuilder.getMany();
  
//   console.log(`✅ Query executed: ${resultData.length} items returned, ${totalItems} total`);
  
//   // Transform data using the existing transformer
//   const { included, data } = this.transformDataService.transformData(resultData, query);
  
//   return {
//     meta: {
//       pageNumber: page.number,
//       totalItems,
//       pageSize: page.size,
//     },
//     data,
//     ...(included ? { included } : {}),
//   };
// }

// // ======================
// // FACTORY INTEGRATION
// // ======================

// export function createAccessControlledTypeOrmService<E extends object, IdKey extends string = 'id'>(
//   originalService: TypeOrmService<E, IdKey>,
//   userContext: UserContext
// ): TypeOrmService<E, IdKey> {
  
//   console.log('🏭 Creating access-controlled TypeORM service...');
  
//   // Clone the original service
//   const accessControlledService = Object.create(originalService);
  
//   // Override only the getAll method
//   accessControlledService.getAll = function(query: Query<E, IdKey>) {
//     return accessControlledGetAll.call(this, query, mockAccessFunction, userContext);
//   };
  
//   console.log('✅ Access-controlled service created');
//   return accessControlledService;
// }

// // ======================
// // USAGE EXAMPLE
// // ======================

// export function testAccessControlledGetAll() {
//   console.log('🧪 Testing access-controlled getAll...');
  
//   // Mock user context
//   const adminUser: UserContext = {
//     id: 'user-123',
//     workspaceId: 'workspace-123',
//     roles: ['admin']
//   };
  
//   const regularUser: UserContext = {
//     id: 'user-456', 
//     workspaceId: 'workspace-123',
//     roles: ['user']
//   };
  
//   // Mock query
//   const mockQuery = {
//     filter: { target: null, relation: null },
//     fields: null,
//     include: null,
//     sort: null,
//     page: { size: 10, number: 1 }
//   };
  
//   console.log('👨‍💼 Admin user access check:');
//   const adminChecker = mockAccessFunction('Users', adminUser, adminUser.workspaceId);
//   adminChecker().then(ids => console.log('Admin accessible IDs:', ids));
  
//   console.log('👤 Regular user access check:');
//   const userChecker = mockAccessFunction('Users', regularUser, regularUser.workspaceId);
//   userChecker().then(ids => console.log('User accessible IDs:', ids));
  
//   console.log('📄 Document access check:');
//   const docChecker = mockAccessFunction('Documents', adminUser, adminUser.workspaceId);
//   docChecker().then(ids => console.log('Document accessible IDs:', ids));
// }

// // ======================
// // INTEGRATION NOTES
// // ======================

// /*
// INTEGRATION STEPS:

// 1. REPLACE THE FACTORY:
//    In your TypeOrmJsonApiModule.forRoot(), replace:
   
//    OrmServiceFactory()
   
//    with:
   
//    {
//      provide: ORM_SERVICE,
//      useFactory: (originalService, userContext) => {
//        return createAccessControlledTypeOrmService(originalService, userContext);
//      },
//      inject: [TypeOrmService, 'USER_CONTEXT']
//    }

// 2. PROVIDE USER CONTEXT:
//    Add a provider for user context:
   
//    {
//      provide: 'USER_CONTEXT',
//      useFactory: (request) => ({
//        id: request.user.id,
//        workspaceId: request.workspace.id,
//        roles: request.user.roles
//      }),
//      inject: [REQUEST]
//    }

// 3. TEST ENDPOINT:
//    GET /api/users?page[size]=5&page[number]=1
   
//    Should now return only accessible users based on the user's context!

// 4. DEBUG OUTPUT:
//    Check console for detailed logging of:
//    - Access function calls
//    - Accessible IDs returned
//    - SQL expressions generated
//    - Query execution results

// 5. NEXT STEPS:
//    - Replace mockAccessFunction with real database lookup
//    - Add access control to getOne, postOne, patchOne methods
//    - Add proper error handling for access denied scenarios
//    - Add caching for access lookups
// */