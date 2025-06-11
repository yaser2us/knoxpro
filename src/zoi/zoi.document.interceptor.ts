// src/zoi/zoi-document.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { ZoiFlowEngine } from './engine/zoi.flow.engine';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowTemplate } from './entity/workflow.template.entity';
import { WorkflowRun } from './entity/workflow.run.entity';

@Injectable()
export class ZoiDocumentInterceptor implements NestInterceptor {
    constructor(
        private readonly zoiFlowEngine: ZoiFlowEngine,
        @InjectRepository(WorkflowTemplate)
        private readonly templateRepo: Repository<WorkflowTemplate>,
        @InjectRepository(WorkflowRun)
        private readonly runRepo: Repository<WorkflowRun>
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const eventType = method === 'POST' ? 'document.created' : method === 'PATCH' ? 'document.updated' : null;

        const resourceType = request?.body?.data?.type || null;

        return next.handle().pipe(
            // tap(async (responseBody) => {
            //   if (!eventType) return;

            //   const payload = responseBody?.data;
            //   if (!payload || !payload.id || !payload.attributes) {
            //     console.warn('[Zoi] Interceptor: missing id or attributes in response.data');
            //     return;
            //   }

            //   const document = {
            //     id: payload.id,
            //     ...payload.attributes
            //   };

            //   const allTemplates = await this.templateRepo.find({ where: { is_active: true } });

            //   for (const template of allTemplates) {
            //     const triggers = Array.isArray(template.triggers)
            //       ? template.triggers
            //       : typeof template.triggers === 'string'
            //         ? JSON.parse(template.triggers)
            //         : [template.triggers];

            //     const shouldRun = triggers.some(trig =>
            //       trig.event === eventType &&
            //       this.matchConditions(trig.conditions, document)
            //     );

            //     if (shouldRun) {
            //       console.log(`[Zoi] Running workflow '${template.name}' for document ${document.id}`);
            //       await this.zoiFlowEngine.run(template, document);
            //     }
            //   }
            // })
            // inside intercept()
            tap(async (responseBody) => {
                const method = request.method;


                const payload = responseBody?.data;
                if (!payload || !payload.id || !payload.attributes) return;

                const document = {
                    id: payload.id,
                    ...payload.attributes,
                    type: resourceType
                };

                const eventType = method === 'POST' ? `document.${document.type}.created`
                    : method === 'PATCH' ? `document.${document.type}.updated`
                        : null;
                console.log(`[Zoi] 0 Checking eventType`, eventType, document, request?.body?.data?.type)


                if (!eventType) return;

                const allTemplates = await this.templateRepo.find({ where: { is_active: true } });

                for (const template of allTemplates) {
                    const triggers = Array.isArray(template.triggers)
                        ? template.triggers
                        : typeof template.triggers === 'string'
                            ? JSON.parse(template.triggers)
                            : [template.triggers];
                    //
                    const shouldTrigger = triggers.some(trig => {
                        console.log(`[Zoi] 1 Checking workflow condition`, trig.conditions, eventType, trig.event)
                        console.log(`[Zoi] 2 Checking workflow condition eventType`, trig.event === eventType)
                        console.log(`[Zoi] 2 - 1 Checking workflow condition trig.event`, eventType)
                        console.log(`[Zoi] 3 Checking workflow condition matchConditions`, this.matchConditions(trig.conditions, document))
                        return trig.event === eventType &&
                            this.matchConditions(trig.conditions, document)
                    }
                    );

                    console.log(`[Zoi] 4 Checking workflow '${template.name}' for document ${document.id}: ${shouldTrigger}`);



                    if (!shouldTrigger) continue;

                    if (eventType === `document.${document.type}.created`) {
                        await this.zoiFlowEngine.run(template, document);
                    } else {
                        // Try to resume existing run
                        const run = await this.runRepo.findOne({
                            where: {
                                template: { id: template.id },
                                document_id: document.id,
                                status: 'waiting'
                            },
                            relations: ['template']
                        });

                        console.log(`[Zoi] -1 run Resuming workflow ${template.name} on document ${document.id}`, run);

                        if (run) {
                            console.log(`[Zoi] 0000 run Resuming workflow ${template.name} on document ${document.id}`);
                            await this.zoiFlowEngine.resume(run, document);
                        }
                    }
                }
            })

        );
    }

    private matchConditions(conditions: any, document: any): boolean {
        if (!conditions) return true;
        console.log('[Zoi] 5 Matching conditions:', conditions, document);

        try {
            return Object.entries(conditions).every(([key, val]) => {
                const value = key.split('.').reduce((acc, k) => acc?.[k], { document: { ...document } });
                if (typeof val === 'object' && val !== null && '$in' in val && Array.isArray((val as any).$in)) {
                    return (val as any).$in.includes(value);
                }
                console.log('[Zoi] 6 Matching condition:', key, value, val);
                console.log('[Zoi] 7 Matching condition result:', value === val);

                return value === val;
            });
        } catch (e) {
            console.warn('[Zoi] Failed condition match:', e);
            return false;
        }
    }
}
