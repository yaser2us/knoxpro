// pulse.module.ts
import { Module } from '@nestjs/common';

import { PulseAccessService } from './pulse-access.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessAction, AccessPolicy, RolePermission, User, UserRole } from './entity';
import { PulseGrantListener } from './pulse-grant.listener';
import { PulseGrantFlowService } from './pulse.grant.flow.service';
import { PulseGrantFlowListener } from './pulse-grant-flow.listener';
import { PulseAccessController } from './pulse-access.controller';
import { PulseWorkflowListener } from './listeners/pulse-workflow.listener';
// import { PulseInterceptor } from './pulse.interceptor';
//
@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            AccessAction,        // ✅ must be here
            UserRole,            // ✅ must be here
            RolePermission,      // ✅ must be here
            AccessPolicy,
            // optionally other entities
        ]),
    ],
    controllers: [
        PulseAccessController
    ],
    providers: [
        PulseAccessService,
        PulseGrantListener,
        PulseGrantFlowService,
        PulseGrantFlowListener,
        PulseWorkflowListener
    ],
    exports: [
        PulseAccessService,
        PulseGrantFlowService
    ],
})
export class PulseModule { }
