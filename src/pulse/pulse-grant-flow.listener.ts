import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PulseGrantFlowService } from './pulse.grant.flow.service';

type AccessGrantFlow = {
  resourceId: string;
  resourceType: string;
  grants: Array<{
    to: string;
    actions: string[];
    grant_if?: Record<string, any>;
  }>;
};

@Injectable()
export class PulseGrantFlowListener {
  private readonly logger = new Logger(PulseGrantFlowListener.name);

  constructor(private readonly pulseGrantFlowService: PulseGrantFlowService) {}

  @OnEvent('pulse.flow_grant', { async: true })
  async handleFlowGrantEvent(payload: AccessGrantFlow) {
    this.logger.log(`[PulseFlow] Received grant flow for ${payload.resourceType}:${payload.resourceId}`);

    try {
      await this.pulseGrantFlowService.executeGrantFlow(payload);
      this.logger.log(`[PulseFlow] Completed grant flow for ${payload.resourceType}:${payload.resourceId}`);
    } catch (err) {
      this.logger.error(`[PulseFlow] Grant flow failed: ${err.message}`, err.stack);
    }
  }
}
