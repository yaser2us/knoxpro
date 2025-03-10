import { Module } from '@nestjs/common';
import { RsaService } from './security.service';
import { SecurityController } from './security.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { SecurityAESService } from './security.aes.service';
import { SecurityAESController } from './security.aes.controller';

@Module({
  imports: [
    CacheModule.register({
      store: 'memory', ttl: 0, log: true
    }),
  ],
  controllers: [
    SecurityController,
    SecurityAESController
  ],
  providers: [
    RsaService,
    SecurityAESService
  ],
  exports: [
    RsaService,
    SecurityAESService
  ]
})
export class SecurityModule { }
