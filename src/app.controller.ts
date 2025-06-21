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
import { AppService } from './app.service';
import { RolesGuard } from './common/guards/roles.guard';
import { Roles } from './common/decorators/roles.decorator';
import { LocalAuthGuard } from './common/guards/passport.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PokemonGuard } from './common/guards/pokemon.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { decryptAESKey, decryptPayload, getPublicKey } from './common/security';
import EventBus from './zoi/events/event-bus';
import { YasserNasser } from './core/entity';
@Controller()
export class AppController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly appService: AppService
  ) { }

  @Get('pipe-test')
  testPipe(@Query() query: any) {
    console.log('🧪 Testing pipe - received query:', query);

    return {
      message: 'Pipe test successful',
      originalQuery: query,
      hasContext: !!query.context,
      userContextExists: !!query.context?.userContext,
      contextKeys: query.context ? Object.keys(query.context) : [],
      timestamp: new Date().toISOString()
    };
  }

  @Get('hellow')
  getHello(@Query('id') workflowRunId: string, @Query('done') done: string): string {

    if (done === 'true') {
      EventBus.emit('workflow.step.completed', {
        payload: {
          workflowRunId: workflowRunId, // From your workflow
          stepId: 'log_completion',
          status: 'completed',
          result: {
            success: true,
            message: 'Task completed successfully',
            data: {
              YasserNasser: "hoooraaaaaa"
            }
          },
          executedBy: 'pulse-module',
          timestamp: new Date().toISOString()
        }
      });
    } else {
      // After signature is processed successfully
      EventBus.emit('approval.granted', {
        id: `approval_${Date.now()}`,
        type: 'approval.granted',
        timestamp: new Date().toISOString(),
        source: 'signature-api',
        payload: {
          workflowRunId: workflowRunId, // From your workflow
          stepId: 'wait_for_signature', // The step that's waiting
          approved: true,
          approver: 'trainer_user_id',
          comments: 'Document signed successfully'
        }
      });
    }

    return this.appService.getHello();
  }

  @Get('public-key')
  getPublicKey() {
    return { publicKey: getPublicKey() };
  }

  @Post('decrypt')
  decryptData(@Body() body: { aesKey: string; encryptedPayload: string; iv: string }) {
    try {
      // Step 1: Decrypt AES Key
      const aesKey = decryptAESKey(body.aesKey);

      // Step 2: Decrypt Payload
      const decryptedData = decryptPayload(body.encryptedPayload, aesKey, body.iv);

      console.log('Decrypted Data:', decryptedData);
      return { success: true, data: decryptedData };
    } catch (error) {
      console.log('Decrypted Error:', error);
      return { success: false, message: 'Decryption failed' };
    }
  }

  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './mocks/uploads',
      filename: (req, file, callback) => {
        console.log(req.params, '[req]');
        const { resource } = req.params;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, resource + '-' + uniqueSuffix + extname(file.originalname));
      },
    })
  }))
  @Post('upload/:resource')
  async uploadFile(
    @Param('resource') type: string, @Req() request: Request,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {

    console.log(file, '[file]');

    this.eventEmitter.emit('access.auto_grant', {
      resourceId: "uploaded-file",
      resourceType: type,
      userId: "8e1dd9b4-dc1e-4140-9c92-39a5db38bc11",
      actions: ['view', 'edit'] // 👈 Optional override
    });

    this.eventEmitter.emit('pulse.flow_grant', {
      resourceId: "uploaded-file-workflow-lol",
      resourceType: 'lab_report',
      grants: [
        {
          to: "8e1dd9b4-dc1e-4140-9c92-39a5db38bc11",
          actions: ['view'],
          grant_if: { role: 'doctor' }
        }
      ]
    });



    return {
      type,
      body,
      ...file
    };
  }
}
