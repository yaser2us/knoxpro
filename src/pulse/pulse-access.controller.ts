import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Headers,
    Req,
    Res,
    Request,
    Response,
    Query,
    UploadedFile,
    UseInterceptors,
    ParseFilePipeBuilder,
    UploadedFiles,
    UseGuards,
    Inject
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { PulseAccessService } from './pulse-access.service';

interface AccessInsightDto {
    userId: string;
    name: string;
    actions: string[];
    grantedBy: 'access_action' | 'role_permission' | 'policy' | 'workspace_policy';
    role?: string;
    matchedPolicy?: string;
    expiresAt?: Date;
}

class AccessCheckInputDto {
    actorId: string;

    workspaceId: string;

    resourceId?: string;

    resourceType: string;

    actionType: string;

    userMetadata?: Record<string, any>;

    resourceMetadata?: Record<string, any>;
}

interface SimulatedAccessResult {
    granted: boolean;
    grantedBy?: 'access_action' | 'role_permission' | 'policy';
    details: {
        direct: boolean;
        roleMatched: boolean;
        roles: string[];
        matchedPolicy?: string;
        failedPolicyConditions?: Array<{
            policy: string;
            context: Record<string, any>;
            conditions: Record<string, any>;
        }>;
        matchedPolicyConditions?: Array<{
            key: string;
            expected: any;
            actual: any;
            result: boolean;
          }>;
    };
}

@Controller("pulse")
export class PulseAccessController {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly pulseAccessService: PulseAccessService
    ) { }

    @Get()
    getHello(): string {
        return Date.now().toString();
    }

    @Get('access-insight')
    async getAccessInsight(
        @Query('resourceId') resourceId: string,
        @Query('resourceType') resourceType: string,
        @Query('actionType') actionType?: string
    ): Promise<AccessInsightDto[]> {
        return this.pulseAccessService.getAccessInsight({
            resourceId,
            resourceType,
            actionType
        });
    }

    @Get('access-grants')
    async listGrantedResourceTypes(
        @Query('userId') userId: string,
        @Query('workspaceId') workspaceId: string
    ): Promise<{ resourceType: string; actionType: string; grantedBy: string }[]> {
        return this.pulseAccessService.getGrantedResourceTypes(userId, workspaceId);
    }

    @Get('access-grants/grouped')
    async getGrantsGroupedByResource(): Promise<any[]> {
        return this.pulseAccessService.getAccessGrantsGrouped();
    }


    @Get('access-grants/resource/grouped')
    async getAccessGrantsGroupedByResource(
        @Query('resourceType') resourceType?: string
    ): Promise<any[]> {
        return this.pulseAccessService.getAccessGrantsGroupedByResource({ resourceType });
    }

    @Post('simulate-access')
    async simulateAccess(@Body() dto: AccessCheckInputDto): Promise<SimulatedAccessResult> {
        return this.pulseAccessService.simulateAccess(dto);
    }

}
