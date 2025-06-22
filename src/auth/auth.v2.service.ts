// src/auth/auth.service.ts
import { 
    Injectable, 
    UnauthorizedException, 
    ConflictException, 
    BadRequestException,
    NotFoundException 
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import * as bcrypt from 'bcrypt';
  import * as crypto from 'crypto';
  
  import { User, UserStatus } from '../core/entity/user.entity';
  import { Profile } from '../core/entity/profile.entity';
  import { Workspace, WorkspaceType } from '../core/entity/workspace.entity';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto';
  import { AuthResponseDto } from './dto/auth-response.dto';
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,
      @InjectRepository(Profile)
      private profileRepository: Repository<Profile>,
      @InjectRepository(Workspace)
      private workspaceRepository: Repository<Workspace>,
      private jwtService: JwtService,
    ) { }
  
    /**
     * Register a new user with their own workspace
     */
    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
      const { email, password, firstName, lastName, phoneNumber } = registerDto;
  
      // Check if email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email }
      });
  
      if (existingUser) {
        throw new ConflictException('Email already exists. Please try a different email address.');
      }
  
      // Generate salt and hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Generate random slug for workspace
      const workspaceSlug = this.generateRandomSlug();
      const workspaceName = `${firstName} ${lastName}`;
  
      // Start database transaction
      const queryRunner = this.userRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
  
      try {
        // Create workspace first
        const workspace = queryRunner.manager.create(Workspace, {
          name: workspaceName,
          description: `Personal workspace for ${workspaceName}`,
          type: WorkspaceType.PRIVATE,
          slug: workspaceSlug,
          metadata: {
            isPersonal: true,
            createdBy: 'registration',
            owner: email
          }
        });
        const savedWorkspace = await queryRunner.manager.save(Workspace, workspace);
  
        console.log('Workspace created:', savedWorkspace);

        // Create user
        const user = queryRunner.manager.create(User, {
          username: email, // Use email as username as requested
          email,
          password: hashedPassword,
          salt,
          status: UserStatus.ACTIVE, // Set to active immediately for public registration
          phoneNumber,
          workspaceId: savedWorkspace.id,
          metadata: {
            registrationMethod: 'public',
            registeredAt: new Date().toISOString()
          }
        });
        const savedUser = await queryRunner.manager.save(User, user);
  
        // Create profile
        const profile = queryRunner.manager.create(Profile, {
          firstName,
          lastName,
          userId: savedUser.id,
          timezone: 'UTC',
          locale: 'en-US',
          metadata: {
            profileCompleteness: 60, // Basic info provided
            requiresOnboarding: true
          }
        });
        await queryRunner.manager.save(Profile, profile);
  
        // Commit transaction
        await queryRunner.commitTransaction();
  
        // Generate JWT token
        const token = await this.generateToken(savedUser, savedWorkspace);
  
        // Return response
        return {
          accessToken: token,
          user: {
            id: savedUser.id,
            email: savedUser.email,
            username: savedUser.username,
            status: savedUser.status,
            workspaceId: savedWorkspace.id,
            profile: {
              firstName: profile.firstName,
              lastName: profile.lastName,
              phoneNumber: profile.phoneNumber
            },
            workspace: {
              id: savedWorkspace.id,
              name: savedWorkspace.name,
              slug: savedWorkspace.slug,
              type: savedWorkspace.type
            }
          }
        };
  
      } catch (error) {
        // Rollback transaction
        await queryRunner.rollbackTransaction();
        console.error('Registration error:', error);
        throw new BadRequestException('Registration failed. Please try again.');
      } finally {
        // Release query runner
        await queryRunner.release();
      }
    }
  
    /**
     * Login user
     */
    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
      const { email, password } = loginDto;
  
      // Find user with their profile and workspace
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['profile', 'workspace']
      });

      console.log('[Login] User found:', user);
  
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }
  
      // Check if user is active
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException(`Account is ${user.status}. Please contact support.`);
      }
  
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }
  
      // Update last login
      await this.userRepository.update(user.id, {
        lastLoginAt: new Date()
      });
  
      // Generate JWT token
      const token = await this.generateToken(user, user.workspace);
  
      return {
        accessToken: token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          status: user.status,
          workspaceId: user.workspace.id,
          profile: {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            phoneNumber: user.profile.phoneNumber
          },
          workspace: {
            id: user.workspace.id,
            name: user.workspace.name,
            slug: user.workspace.slug,
            type: user.workspace.type
          }
        }
      };
    }
  
    /**
     * Generate JWT token for user
     */
    async generateToken(user: User, workspace: Workspace): Promise<string> {
      const payload = {
        sub: user.id,
        email: user.email,
        username: user.username,
        workspaceId: workspace.id,
        status: user.status,
        metadata: {
          workspaceName: workspace.name,
          workspaceType: workspace.type,
          ...user.metadata
        }
      };
  
      return this.jwtService.signAsync(payload);
    }
  
    /**
     * Generate random slug for workspace
     */
    private generateRandomSlug(): string {
      const randomBytes = crypto.randomBytes(8);
      const timestamp = Date.now().toString(36);
      const randomString = randomBytes.toString('hex');
      return `ws-${timestamp}-${randomString}`;
    }
  
    /**
     * Validate user for JWT strategy
     */
    async validateUser(userId: string): Promise<User | null> {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['profile', 'workspace']
      });
  
      if (!user || user.status !== UserStatus.ACTIVE) {
        return null;
      }
  
      return user;
    }
  
    /**
     * Legacy methods for backward compatibility
     */
    async signIn(username: string, pass: string) {
      const user = await this.userRepository.findOne({
        where: [
          { username },
          { email: username }
        ],
        relations: ['workspace']
      });
  
      if (!user || !(await bcrypt.compare(pass, user.password))) {
        throw new UnauthorizedException();
      }
  
      const payload = { 
        username: user.username, 
        sub: user.id, 
        role: 'user',
        workspaceId: user.workspace?.id
      };
  
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }