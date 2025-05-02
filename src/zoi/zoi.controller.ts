// src/zoi/zoi.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { ZoiSchemaService } from './zoi.schema.service';
import { DynamicEntityRegistry } from './dynamic.entity.registry';
import { DocumentTemplate } from './entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/zoi')
export class ZoiController {
    constructor(
        @InjectRepository(DocumentTemplate)
        private readonly templateRepo: Repository<DocumentTemplate>,
        private readonly zoiSchemaService: ZoiSchemaService) { }

    @Post()
    async createResource(@Body() body: CreateResourceRequest) {
        const { name, fields } = body;

        if (!name || !fields || typeof fields !== 'object') {
            throw new Error('Invalid request: name and fields are required.');
        }
        

        const template = this.templateRepo.create({
            name: name, 
            type: name, 
            schema: fields, 
            uiHints: undefined, 
            isActive: true, 
            createdAt: new Date(), 
            workspace: { id: "d9f8ec62-bb8b-4f7d-a192-c0a4c71f30dd" }
        });

        await this.templateRepo.save(template);

        const tableName = name.trim().toLowerCase().replace(/\s+/g, '_');

        // 1. Create physical table
        await this.zoiSchemaService.createPhysicalTable(tableName, fields.properties);

        // 2. Create dynamic EntitySchema
        const entitySchema = this.zoiSchemaService.createDynamicEntitySchema(tableName, fields.properties);

        // 3. Register entity into memory (for future hot-reload etc.)
        DynamicEntityRegistry.register(entitySchema);

        // 4. Register into TypeORM live
        await this.zoiSchemaService.registerEntityLive(entitySchema);

        // (Optional) 5. In future we register dynamic controller here too!

        return {
            message: `Resource '${name}' created successfully.`,
            tableName,
        };
    }
}

// Interface for request body
interface CreateResourceRequest {
    name: string;
    fields: Record<string, any>;
}
