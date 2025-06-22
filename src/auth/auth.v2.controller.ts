// src/auth/auth.controller.ts
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    ValidationPipe,
    UseGuards,
  } from '@nestjs/common';
  import { AuthService } from './auth.v2.service';
  import { Public } from '../common/decorators/public.decorator';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto';
  import { AuthResponseDto } from './dto/auth-response.dto';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) { }
  
    /**
     * Register new user endpoint
     * POST /auth/register
     */
    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(
      @Body(ValidationPipe) registerDto: RegisterDto
    ): Promise<AuthResponseDto> {
      console.log('[Register] Attempting registration for:', registerDto.email);
      
      try {
        const result = await this.authService.register(registerDto);
        console.log('[Register] Success for user:', result.user.id);
        return result;
      } catch (error) {
        console.error('[Register] Error:', error.message);
        throw error;
      }
    }
  
    /**
     * Login user endpoint
     * POST /auth/login
     */
    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
      @Body(ValidationPipe) loginDto: LoginDto
    ): Promise<AuthResponseDto> {
      console.log('[Login] Attempting login for:', loginDto.email);
      
      try {
        const result = await this.authService.login(loginDto);
        console.log('[Login] Success for user:', result.user.id);
        return result;
      } catch (error) {
        console.error('[Login] Error:', error.message);
        throw error;
      }
    }
  
    /**
     * Get current user profile
     * GET /auth/profile
     */
    @Get('profile')
    @HttpCode(HttpStatus.OK)
    async getProfile(@Request() req): Promise<any> {
      console.log('[Profile] Request for user:', req.user?.id);
      
      // The user object is populated by JWT strategy
      const user = req.user;
      
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        status: user.status,
        workspaceId: user.workspace?.id,
        profile: {
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
          phoneNumber: user.profile?.phoneNumber,
          profileImage: user.profile?.profileImage,
          bio: user.profile?.bio,
          timezone: user.profile?.timezone,
          locale: user.profile?.locale
        },
        workspace: {
          id: user.workspace?.id,
          name: user.workspace?.name,
          slug: user.workspace?.slug,
          type: user.workspace?.type,
          description: user.workspace?.description
        },
        lastLoginAt: user.lastLoginAt,
        metadata: user.metadata
      };
    }
  
    /**
     * Refresh token endpoint
     * POST /auth/refresh
     */
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Request() req): Promise<{ accessToken: string }> {
      console.log('[Refresh] Token refresh for user:', req.user?.id);
      
      const user = req.user;
      const token = await this.authService.generateToken(user, user.workspace);
      
      return {
        accessToken: token
      };
    }
  
    /**
     * Logout endpoint (client-side token invalidation)
     * POST /auth/logout
     */
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req): Promise<{ message: string }> {
      console.log('[Logout] User logout:', req.user?.id);
      
      // In a real application, you might want to:
      // 1. Add token to blacklist
      // 2. Update last logout time
      // 3. Clear any server-side sessions
      
      return {
        message: 'Logged out successfully'
      };
    }
  
    // ========================================
    // LEGACY ENDPOINTS (for backward compatibility)
    // ========================================
  
    /**
     * Legacy signin endpoint
     * @deprecated Use /auth/login instead
     */
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signIn(@Body() signInDto: Record<string, any>) {
      console.log('[SignIn] Legacy signin:', signInDto.username);
      return this.authService.signIn(signInDto.username, signInDto.password);
    }
  
    /**
     * Legacy login endpoint with different format
     * @deprecated Use /auth/login instead
     */
    @Public()
    @Post('login-legacy')
    async loginLegacy(@Body() signInDto: Record<string, any>): Promise<any> {
      console.log('[LoginLegacy] Legacy login:', signInDto.username);
      const username = signInDto.username;
      const password = signInDto.password;
      const token = await this.authService.signIn(username, password);
      return { token };
    }
  }