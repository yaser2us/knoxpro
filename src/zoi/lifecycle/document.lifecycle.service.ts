// src/zoi/lifecycle/document-lifecycle.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entity/document.entity';
import { FlowTemplate } from '../entity/flow.template.entity';
import { ZoiFlowEngine } from '../engine/zoi.flow.engine';

@Injectable()
export class DocumentLifecycleService implements OnModuleInit {
    constructor(
        @InjectRepository(Document)
        private readonly docRepo: Repository<Document>,
        @InjectRepository(FlowTemplate)
        private readonly flowRepo: Repository<FlowTemplate>,
        private readonly flowEngine: ZoiFlowEngine,
    ) { }

    async onModuleInit() {
        // Optional: subscribe to events if using domain event pattern
    }

    async onDocumentCreated(document: Document) {
        const template = await this.flowRepo.findOne({
            where: {
                appliesTo: document.type,
                trigger: 'document.created',
            },
        });

        if (!template) return;
        await this.flowEngine.run(template, document);
    }
}
