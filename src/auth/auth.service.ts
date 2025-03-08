import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, password: user.userId, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(username: string, password: string): Promise<any | null> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async login(user: any): Promise<{ accessToken: string }> {
    console.log(user, '[login user]')
    const payload = { username: user.username, sub: user.password };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

}
