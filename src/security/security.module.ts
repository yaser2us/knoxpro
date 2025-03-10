import { Module } from '@nestjs/common';
import { RsaService } from './security.service';
import { SecurityController } from './security.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      store: 'memory', ttl: 0, log: true
    }),
  ],
  controllers: [SecurityController],
  providers: [RsaService],
})
export class SecurityModule { }
