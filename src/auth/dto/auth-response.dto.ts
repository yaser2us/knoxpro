// src/auth/dto/auth-response.dto.ts
import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    status: string;
    workspaceId: string;
    profile: {
      firstName: string;
      lastName: string;
      phoneNumber?: string;
    };
    workspace: {
      id: string;
      name: string;
      slug: string;
      type: string;
    };
  };
}