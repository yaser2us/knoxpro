import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: Record<string, any>) {
    console.log('[signIn]', signInDto)
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() signInDto: Record<string, any>): Promise<any> {
    console.log('[signIn user]', signInDto)
    const username = signInDto.username;
    const password = signInDto.password;
    const token = await this.authService.login({username, password});
    return { token };
  }
//////
  // @Post('register')
  // async register(@Request() req): Promise<any> {
  //   const { username, password } = req.body;
  //   const user = await this.authService.register(username, password);
  //   return { user };
  // }
}
