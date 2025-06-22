// import {
//     Get,
//     Param,
//     Inject,
//     Query,
//     UseInterceptors,
//     UseFilters,
//     UseGuards,
// } from '@nestjs/common';

// import {
//     JsonApi,
//     JsonBaseController,
//     InjectService,
//     JsonApiService,
//     Query as QueryType,
//     QueryOne,
//     // ResourceObject,
//     // EntityRelation,
//     PatchRelationshipData,
//     // ResourceObjectRelationships,
//     PostData,
// } from '@yaser2us/json-api-nestjs';
// //   import { ExamplePipe } from '../../service/example.pipe';
// //   import { ExampleService } from '../../service/example.service';
// //   import { ControllerInterceptor } from '../../service/controller.interceptor';
// //   import { MethodInterceptor } from '../../service/method.interceptor';
// //   import {
// //     HttpExceptionFilter,
// //     HttpExceptionMethodFilter,
// //   } from '../../service/http-exception.filter';
// //   import { GuardService, EntityName } from '../../service/guard.service';

// import { Users } from './Entity/legacy/users';
// import { Roles } from './common/decorators/roles.decorator';
// //   import { AtomicInterceptor } from '../../service/atomic.interceptor';
// import { YourEntityRepository } from './repo/user.repo';
// import { RolesGuard } from './common/guards/roles.guard';
// import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
// //   @UseGuards(GuardService)
// //   @UseFilters(new HttpExceptionFilter())
// //   @UseInterceptors(ControllerInterceptor)
// @JsonApi(Users)
// export class ExtendUserController extends JsonBaseController<Users> {
//     @InjectService() public service: JsonApiService<Users>;

//     constructor(private readonly yourEntityRepo: YourEntityRepository) {
//         super();
//     }
//     //@Query('field') field: string,
//     // @UseGuards(RolesGuard)
//     // @UseGuards(JwtAuthGuard)
//     // @Roles('readOwn','users-aggregate')
//     @Get('/aggregate')
//     async aggregate(@Query('field') field: string, query: QueryType<Users>) {
//         console.log(query, '[query]')
//         // const field = query.fields || "isActive"
//         return this.yourEntityRepo.aggregateByField(field);
//     }

//     // @Inject(ExampleService) protected exampleService: ExampleService;
//     // @UseGuards(RolesGuard)
//     // @UseGuards(JwtAuthGuard)
//     // @Roles('readOwn','users-get-one')
//     getOne(
//         id: string | number,
//         query: QueryOne<Users>
//     ): Promise<ResourceObject<Users>> {
//         return super.getOne(id, query);
//     }

//     patchRelationship<Rel extends EntityRelation<Users>>(
//         id: string | number,
//         relName: Rel,
//         input: PatchRelationshipData
//     ): Promise<ResourceObjectRelationships<Users, Rel>> {
//         return super.patchRelationship(id, relName, input);
//     }

//     // @UseInterceptors(AtomicInterceptor)
//     postOne(inputData: PostData<Users>): Promise<ResourceObject<Users>> {
//         return super.postOne(inputData);
//     }

//     // @EntityName('Users')
//     // @UseFilters(HttpExceptionMethodFilter)
//     // @UseInterceptors(MethodInterceptor)
//     getAll(
//         query: QueryType<Users>
//     ): Promise<ResourceObject<Users, 'array'>> {
//         console.log(query)
//         return super.getAll(query);
//     }

//     @Get(':id/example')
//     testOne(@Param('id') id: string): string {
//         return 'this.exampleService.testMethode(id)';
//     }
// }
