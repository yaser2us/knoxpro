// zoi-step.executor.ts
import { Injectable } from '@nestjs/common';
import { WorkflowRun } from './entity/workflow.run.entity';
import { GrantAccessStep } from './action/grant.access.step';
import { WaitForStep } from './action/wait.for.step';
import { SendEmailStep } from './action/send.email.step';
import { LogEventStep } from './action/log.event.step';

type StepResult = {
  shouldPause: boolean;
  updatedContext?: any;
};

@Injectable()
export class ZoiStepExecutor {
  async execute(
    run: WorkflowRun,
    step: any,
    document: any
  ): Promise<StepResult> {
    const [stepType, config] = this.extractStepType(step);

    console.log('[ZoiStepExecutor] execute:', stepType, config);
    switch (stepType) {
      case 'grantAccess':
        return GrantAccessStep.execute(config, run, document);
      case 'waitFor':
        return WaitForStep.execute(config, run, document);
      case 'sendEmail':
        return SendEmailStep.execute(config, run, document);
      case 'logEvent':
        return LogEventStep.execute(config, run, document);
      default:
        throw new Error(`Unsupported step type: ${stepType}`);
    }
  }

  private extractStepType(step: any): [string, any] {
    const keys = Object.keys(step || {});
    console.log('[ZoiStepExecutor] extractStepType:', step, keys);
    if (keys.length !== 1) {
      throw new Error(`Invalid step format: ${JSON.stringify(step)}`);
    }
    return [keys[0], step[keys[0]]];
  }
}
