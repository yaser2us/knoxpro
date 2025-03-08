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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles('readOwn','users-get-one')
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
