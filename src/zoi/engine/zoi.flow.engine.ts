// src/zoi/engine/zoi-flow.engine.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FlowTemplate } from '../entity/flow.template.entity';
import { Document } from '../entity/document.entity';
import { DocumentFlow } from '../entity/document.flows.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ZoiFlowEngine {
    constructor(
        @InjectRepository(DocumentFlow)
        private flowRepo: Repository<DocumentFlow>,
    ) { }

    async run(flow: FlowTemplate, document: Document) {
        const context = {
            document,
        };

        const rawSteps = flow.steps;

        // Normalize to iterable array
        const steps: any[] = Array.isArray(rawSteps)
            ? rawSteps
            : typeof rawSteps === 'object' && rawSteps !== null
                ? Object.values(rawSteps)
                : [];

        for (const step of steps) {
            if (step.if) {
                const condition = this.evaluateCondition(step.if, context);
                const selected = condition ? step.then : step.else;
                await this.executeStep(selected, context);
                continue;
            }

            await this.executeStep(step, context);
        }

        // Optionally save context and status
        await this.flowRepo.save({
            document,
            flowTemplate: flow,
            stepPointer: 'completed',
            context,
            completed: true,
        });
    }

    private evaluateCondition(condition: any, context: any): boolean {
        const value = this.getFieldValue(condition.field, context);

        if (condition.equals !== undefined) return value === condition.equals;
        if (condition.notEquals !== undefined) return value !== condition.notEquals;
        if (condition.in !== undefined) return condition.in.includes(value);
        if (condition.exists) return this.getFieldValue(condition.exists, context) !== undefined;
        if (condition.and) return condition.and.every((c: any) => this.evaluateCondition(c, context));
        if (condition.or) return condition.or.some((c: any) => this.evaluateCondition(c, context));

        return false;
    }

    private getFieldValue(fieldPath: string, context: any): any {
        return fieldPath.split('.').reduce((acc, key) => acc?.[key], context);
    }

    private async executeStep(step: any, context: any) {
        switch (step.action) {
            case 'grant':
                return this.handleGrant(step, context);
            case 'sendEmail':
                return this.handleSendEmail(step, context);
            case 'waitFor':
                return this.handleWaitFor(step, context);
            case 'human':
                return this.handleHuman(step, context);
            case 'noop':
            default:
                return;
        }
    }

    private async handleGrant(step: any, context: any) {
        // integrate with your access grant engine
        console.log('[Zoi] Grant access to', step.to);
    }

    private async handleSendEmail(step: any, context: any) {
        // integrate with email engine
        console.log('[Zoi] Send email to', this.getFieldValue(step.to, context));
    }

    private async handleWaitFor(step: any, context: any) {
        // simulate condition waiting (in real life, this is event-based)
        console.log('[Zoi] Wait for condition...');
    }

    private async handleHuman(step: any, context: any) {
        // record need for user decision
        console.log('[Zoi] Human decision needed:', step);
        // store contextKey placeholder
        context[step.contextKey] = null;
    }
}
