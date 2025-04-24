import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessAction } from './entity/access.action.entity';

type GrantEvent = {
  resourceId: string;
  resourceType: string;
  userId: string;
  actions?: string[]; // e.g., ['view', 'edit']
};

@Injectable()
export class PulseGrantListener {
  constructor(
    @InjectRepository(AccessAction)
    private readonly accessActionRepo: Repository<AccessAction>,
  ) {}

  @OnEvent('access.auto_grant')
  async handleAutoGrant(event: GrantEvent) {
    const { userId, resourceId, resourceType, actions = ['view'] } = event;

    const grants = actions.map(action => ({
      actor: { id: userId },
      resourceId,
      resourceType,
      actionType: action,
      enabled: true,
    }));

    await this.accessActionRepo.save(grants);
    console.log(`[Pulse] Auto-granted ${actions.join(', ')} to user ${userId} on ${resourceType}:${resourceId}`);
  }
}
