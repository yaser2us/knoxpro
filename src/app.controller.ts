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
import { decryptAESKey, decryptPayload, getPublicKey } from './common/security';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
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
    return {
      type,
      body,
      ...file
    };
  }
}
