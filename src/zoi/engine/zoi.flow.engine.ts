// zoi-flow.engine.ts
import { Injectable } from '@nestjs/common';
import { WorkflowRun } from '../entity/workflow.run.entity';
import { WorkflowTemplate } from '../entity/workflow.template.entity';
import { WorkflowLog } from '../entity/workflow.log.entity';
import { ZoiStepExecutor } from '../zoi.flow.step.executor';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ZoiFlowEngine {
  constructor(
    @InjectRepository(WorkflowRun)
    private runRepo: Repository<WorkflowRun>,
    @InjectRepository(WorkflowTemplate)
    private templateRepo: Repository<WorkflowTemplate>,
    @InjectRepository(WorkflowLog)
    private logRepo: Repository<WorkflowLog>,
    private stepExecutor: ZoiStepExecutor
  ) { }

  // async run(template: WorkflowTemplate, document: any): Promise<WorkflowRun> {
  //   const existing = await this.runRepo.findOne({
  //     where: {
  //       document_id: document.id,
  //       template: { id: template.id }
  //     }
  //   });

  //   console.log('[debug] document:', document);

  //   if (existing) return existing;

  //   const run = this.runRepo.create({
  //     document_id: document.id,
  //     template,
  //     version: template.version,
  //     status: 'running',
  //     current_step_index: 0,
  //     context: {}
  //   });

  //   await this.runRepo.save(run);

  //   await this.logRepo.save(this.logRepo.create({
  //     workflow_run: run,
  //     step_index: 0,
  //     type: 'triggered',
  //     message: 'Workflow started',
  //     actor_user_id: null,
  //     metadata: { template_name: template.name }
  //   }));

  //   const dsl = typeof template.dsl === 'string' ? JSON.parse(template.dsl) : template.dsl;
  //   const firstStep = dsl.steps;
  //   console.log('[debug] firstStep:', firstStep, template.dsl.steps);
  //   const { shouldPause, updatedContext } = await this.stepExecutor.execute(run, firstStep[0], document);

  //   run.current_step_index = shouldPause ? 0 : 1;
  //   run.status = shouldPause ? 'waiting' : 'running';
  //   run.context = updatedContext;

  //   return await this.runRepo.save(run);
  // }

  async run(template: WorkflowTemplate, document: any): Promise<WorkflowRun> {
    const existing = await this.runRepo.findOne({
      where: {
        document_id: document.id,
        template: { id: template.id }
      }
    });

    if (existing) return existing;

    const run = this.runRepo.create({
      document_id: document.id,
      template,
      version: typeof template.version === 'string' ? template.version : '1.0.0',
      status: 'running',
      current_step_index: 0,
      context: {}
    });

    await this.runRepo.save(run);

    await this.logRepo.save(this.logRepo.create({
      workflow_run: run,
      step_index: 0,
      type: 'triggered',
      message: 'Workflow started',
      actor_user_id: null,
      metadata: { template_name: template.name }
    }));

    const dsl = typeof template.dsl === 'string' ? JSON.parse(template.dsl) : template.dsl;
    const steps = dsl?.steps || [];

    let index = 0;
    let shouldPause = false;
    let context = run.context;

    while (index < steps.length && !shouldPause) {
      const step = steps[index];
      const result = await this.stepExecutor.execute(run, step, document);

      context = result.updatedContext ?? context;
      shouldPause = result.shouldPause;

      if (!shouldPause) {
        index++;
      }
    }

    run.current_step_index = index;
    run.status = shouldPause ? 'waiting' : 'completed';
    run.context = context;

    return await this.runRepo.save(run);
  }

  private async _executeSteps(
    run: WorkflowRun,
    template: WorkflowTemplate,
    document: any,
    startIndex: number
  ): Promise<WorkflowRun> {
    const dsl = typeof template.dsl === 'string' ? JSON.parse(template.dsl) : template.dsl;
    const steps = dsl?.steps || [];

    let index = startIndex;
    let shouldPause = false;
    let context = run.context;

    while (index < steps.length && !shouldPause) {
      const step = steps[index];
      const result = await this.stepExecutor.execute(run, step, document);

      context = result.updatedContext ?? context;
      shouldPause = result.shouldPause;

      if (!shouldPause) {
        index++;
      }
    }

    run.current_step_index = index;
    run.status = shouldPause ? 'waiting' : 'completed';
    run.context = context;

    return run;
  }

  async resume(run: WorkflowRun, document: any): Promise<WorkflowRun> {
    if (run.status !== 'waiting') {
      throw new Error(`WorkflowRun ${run.id} is not paused. Cannot resume.`);
    }

    const template = run.template;

    const updatedRun = await this._executeSteps(run, template, document, run.current_step_index);

    return await this.runRepo.save(updatedRun);
  }

}
