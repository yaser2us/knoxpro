import { Inject, Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as crypto from 'crypto';
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import * as forge from 'node-forge';
import { Cache } from 'cache-manager';

// Generate a strong AES-256 key (32 bytes)
export function generateAESKey(): Buffer {
    return crypto.randomBytes(32);
}

export function encryptAESKeyWithRSA(aesKey: Buffer, publicKey: string): string {
    return crypto.publicEncrypt(publicKey, aesKey).toString('base64');
}

export function encryptAES(data: string, key: Buffer): { encrypted: string, iv: string, authTag: string } {
    const iv = crypto.randomBytes(12); // 96-bit IV
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag(); // Tag for integrity check

    return {
        encrypted,
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64')
    };
}

export function decryptAESKeyWithRSA(encryptedKey: string, privateKey: string): Buffer {
    return crypto.privateDecrypt(privateKey, Buffer.from(encryptedKey, 'base64'));
}

export function decryptAES(encrypted: string, key: Buffer, iv: string, authTag: string): string {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));

    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

@Injectable()
export class SecurityAESService {
    private readonly privateKey: string;  // Load from secure storage
    private readonly publicKey: string;   // Load from secure storage

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
        this.privateKey = fs.readFileSync('private.pem', 'utf8');
        this.publicKey = fs.readFileSync('public.pem', 'utf8');
    }

    async init(username: string) {
        // Generate RSA Key Pair
        const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(2048);

        const pemPrivateKey = forge.pki.privateKeyToPem(privateKey);
        const pemPublicKey = forge.pki.publicKeyToPem(publicKey);

        // Store in cache (Expire in 1 hour)
        await this.cacheManager.set(`rsa:${username}:private`, pemPrivateKey, 0);
        await this.cacheManager.set(`rsa:${username}:public`, pemPublicKey, 0);

        console.log('RSA keys generated successfully!', { publicKey: pemPublicKey });
        return { publicKey: pemPublicKey };
        // return { publicKey: this.publicKey };
    }

    async getPublicKey(username: string) : Promise<string | null>{
        return await this.cacheManager.get(`rsa:${username}:public`);
    }

    async getPrivateKey(username: string) : Promise<string | null> {
        return await this.cacheManager.get(`rsa:${username}:private`);
    }

    async encrypt(payload: object, username: string): Promise<any> {
        const aesKey = generateAESKey();
        const { encrypted, iv, authTag } = encryptAES(JSON.stringify(payload), aesKey);
        const publicKey = await this.getPublicKey(username) || "";
        const encryptedKey = encryptAESKeyWithRSA(aesKey, publicKey);

        return { encryptedData: encrypted, encryptedKey, iv, authTag };
    }

    async decrypt(encryptedData: string, encryptedKey: string, iv: string, authTag: string, username: string): Promise<object> {
        const privateKey = await this.getPrivateKey(username) || "";
        const aesKey = decryptAESKeyWithRSA(encryptedKey, privateKey);
        const decrypted = decryptAES(encryptedData, aesKey, iv, authTag);
        return JSON.parse(decrypted);
    }
}
