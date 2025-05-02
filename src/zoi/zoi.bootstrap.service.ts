import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { DataSource, EntitySchema, Repository } from "typeorm";
import { DocumentTemplate } from "./entity";
import { createEntityFromJsonSchema } from "./engine/dynamic.entity.engine";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ZoiBootstrapService implements OnApplicationBootstrap {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(DocumentTemplate)
    private readonly templateRepo: Repository<DocumentTemplate>,
    
  ) {}

  // async bootstrap() {
  //   const templates = await this.templateRepo.find();

  //   const dynamicEntities: EntitySchema[] = [];

  //   for (const template of templates) {
  //     const entity = createEntityFromJsonSchema({
  //       type: template.type,
  //       schema: template.schema,
  //     });
  //     dynamicEntities.push(entity);
  //   }

  //   console.log("[zoi] Dynamic entities created:", dynamicEntities);

  //   // Register all dynamic entities into TypeORM
  //   // this.dataSource.options.entities.push(...dynamicEntities);
  //   (this.dataSource.options.entities as (Function | string | EntitySchema<any>)[]).push(...dynamicEntities);

  //   console.log("[zoi] Dynamic entities registered with TypeORM", this.dataSource.options.entities);
  //   // Optional: synchronize schema
  //   await this.dataSource.synchronize(false); // only in dev, production must handle migrations manually
  // }

  async onApplicationBootstrap() {
    // const repo = this.dataSource.getRepository(DocumentTemplate);
    // const templates = await repo.find({ where: { isActive: true } });

    // for (const t of templates) {
    //   await this.hotReload.reloadTemplate(t, this.entityParamMap);
    // }

    console.log(`[Zoi] Hot reloaded templates`);
  }

  async bootstrap() {
    const templates = await this.templateRepo.find();
  
    const dynamicEntities: EntitySchema[] = [];
  
    for (const template of templates) {
      const entity = createEntityFromJsonSchema({
        type: template.type,
        schema: template.schema,
      });
      dynamicEntities.push(entity);
    }
  
    const originalEntities = Array.isArray(this.dataSource.options.entities)
    ? this.dataSource.options.entities
    : [];

    const newEntities = [...originalEntities, ...dynamicEntities];
  
    // ❗ We must re-initialize the datasource
    await this.dataSource.destroy(); // Close old connection
    this.dataSource.setOptions({ entities: newEntities }); // Set updated entities
    await this.dataSource.initialize(); // Reinitialize connection
  
    await this.dataSource.synchronize(false); // Then synchronize
  }
  
}
