import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { SecurityAESService } from './security.aes.service';

@Controller('aes')
export class SecurityAESController {
    constructor(
        private readonly securityAESService: SecurityAESService
    ) { }

    @Get('init')
    async getPublicKey(@Req() req) {
        const keys = await this.securityAESService.init(req.user.username);
        console.log(keys, '[init]')
        return { ...keys };
    }

    @Post('encrypt')
    async encrypt(@Body('data') data: any, @Req() req) {
        const result = await this.securityAESService.encrypt({ ...data }, req.user.username);
        return { ...result };
    }

    @Post('decrypt')
    async decrypt(@Body('encryptedData') encryptedData: string, @Body('encryptedKey') encryptedKey: string, @Body('iv') iv: string, @Body('authTag') authTag: string, @Req() req) {
        const result = await this.securityAESService.decrypt(encryptedData, encryptedKey, iv, authTag, req.user.username);
        return { decryptedData: result };
    }
}