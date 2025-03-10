import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { RsaService } from './security.service';
import { getPublicKey } from 'src/common/security';

@Controller('security')
export class SecurityController {
    constructor(private readonly rsaService: RsaService) { }

    @Get('init')
    async getPublicKey(@Req() req) {
        const keys = await this.rsaService.init(req.user.username);
        console.log(keys, '[init]')
        return { ...keys };
    }

    @Post('encrypt')
    async encrypt(@Body('data') data: any, @Req() req) {
        const result = await this.rsaService.encrypt(data, req.user.username);
        return { encryptedData: result };
    }

    @Post('decrypt')
    async decrypt(@Body('encryptedData') encryptedData: string, @Req() req) {
        const result  = await this.rsaService.decrypt(encryptedData, req.user.username);
        return { decryptedData: result };
    }
}


