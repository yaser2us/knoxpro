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
    const payload = {
      username: user.username, sub: user.password,
      "id": "8e1dd9b4-dc1e-4140-9c92-39a5db38bc11",  // doctor-x
      "workspaceId": "d9f8ec62-bb8b-4f7d-a192-c0a4c71f30dd",
      "metadata": {
        "geo": "MY",
        "specialty": "blood"

      }
    };
    console.log(payload, '[login] payload')

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

}
