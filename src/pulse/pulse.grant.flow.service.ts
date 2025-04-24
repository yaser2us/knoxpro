import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { AccessAction, User } from "./entity";
import { PulseAccessService } from "./pulse-access.service";
import { InjectRepository } from "@nestjs/typeorm";

type AccessGrantFlow = {
    resourceId: string;
    resourceType: string;
    grants: Array<{
        to: string;
        actions: string[];
        grant_if?: Record<string, any>; // ABAC condition
    }>;
};


@Injectable()
export class PulseGrantFlowService {
    constructor(
        @InjectRepository(AccessAction)
        private readonly accessActionRepo: Repository<AccessAction>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly pulseAccessService: PulseAccessService,
    ) { }

    async executeGrantFlow(flow: AccessGrantFlow) {
        for (const grant of flow.grants) {
            const user = await this.userRepo.findOne({ where: { id: grant.to } });
            if (!user) continue;

            const context = user.metadata || {}; // ABAC eval input
            const conditionMet = grant.grant_if
                ? this.pulseAccessService.evaluateConditions(context, {}, grant.grant_if)
                : true;

            if (!conditionMet) {
                console.log(`[PulseFlow] Skipped ${grant.to} — condition failed`);
                continue;
            }

            for (const action of grant.actions) {
                const alreadyGranted = await this.accessActionRepo.findOne({
                    where: {
                        actor: { id: grant.to },
                        resourceId: flow.resourceId,
                        resourceType: flow.resourceType,
                        actionType: action
                    }
                });

                if (alreadyGranted) {
                    console.log(`[PulseFlow] Already granted ${action} to ${grant.to}`);
                    continue;
                }

                await this.accessActionRepo.save({
                    actor: { id: grant.to },
                    resourceId: flow.resourceId,
                    resourceType: flow.resourceType,
                    actionType: action,
                    enabled: true
                });

                console.log(`[PulseFlow] Granted ${action} to ${grant.to}`);
            }
        }
    }
}
