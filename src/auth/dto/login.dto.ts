// src/auth/dto/login.dto.ts

import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;
  
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
  }