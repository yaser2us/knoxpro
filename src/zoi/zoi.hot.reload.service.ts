// import { Injectable } from "@nestjs/common";
// import { DataSource } from "typeorm";
// import { DocumentTemplate } from "./entity/document.template.entity";
// import { createEntityFromJsonSchema } from "./engine/dynamic.entity.engine";
// import { patchEntityParamMap } from "./engine/zoi.orm.helper";

// @Injectable()
// export class ZoiHotReloadService {
//     constructor(private readonly dataSource: DataSource) { }

//     async reloadTemplate(template: DocumentTemplate, map: EntityParamMap) {
//         const entity = createEntityFromJsonSchema(template);
//         const manager = this.dataSource.manager;

//         const exists = await manager.query(
//             `SELECT to_regclass('${template.type}') IS NOT NULL AS exists`
//         );
//         if (!exists[0]?.exists) {
//             // table doesn't exist → create
//             const baseSQL = `CREATE TABLE "${template.type}" (id UUID PRIMARY KEY DEFAULT uuid_generate_v4())`;
//             await manager.query(baseSQL);
//         }

//         await patchEntityParamMap(manager, map, entity.options.target as Function);
//     }
// }
