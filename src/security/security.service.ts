import { Inject, Injectable } from '@nestjs/common';
import * as forge from 'node-forge';
import * as fs from 'fs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { cacheManager } from 'cache-manager';
import { Cache } from 'cache-manager';

// Generate a new RSA key pair
const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(2048);

// Convert to PEM format
const privatePem = forge.pki.privateKeyToPem(privateKey);
const publicPem = forge.pki.publicKeyToPem(publicKey);

// Save keys to files
fs.writeFileSync('private.pem', privatePem);
fs.writeFileSync('public.pem', publicPem);

console.log('RSA keys generated successfully!');

@Injectable()
export class RsaService {

    private publicKey: forge.pki.PublicKey;
    private privateKey: forge.pki.PrivateKey;

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
        // Load RSA keys from PEM files
        const publicPem = fs.readFileSync('public.pem', 'utf8');
        const privatePem = fs.readFileSync('private.pem', 'utf8');

        this.publicKey = forge.pki.publicKeyFromPem(publicPem);
        this.privateKey = forge.pki.privateKeyFromPem(privatePem);
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
    }

    async getPublicKey(username: string) {
        return await this.cacheManager.get(`rsa:${username}:public`);
    }

    async getPrivateKey(username: string) {
        return await this.cacheManager.get(`rsa:${username}:private`);
    }

    // getPublicKey() {
    //     return fs.readFileSync('public.pem', 'utf8');
    // }

    /**
     * Encrypts a message using RSA Public Key.
     */
    async encrypt(obj: Record<string, any>, username: string): Promise<string> {
        const publicKeyPem = await this.getPublicKey(username);
        console.log(publicKeyPem, '[encrypt]')

        if (!publicKeyPem) {
            return "Public key not found";
        }

        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

        // Convert object to JSON string
        const data = JSON.stringify(obj);
        const encrypted = publicKey.encrypt(forge.util.encodeUtf8(data), 'RSA-OAEP', {
            md: forge.md.sha256.create(), // Use SHA-256
        });

        console.log('Encrypted:', forge.util.encode64(encrypted));
        return forge.util.encode64(encrypted); // Convert to Base64
    }

    /**
     * Decrypts an RSA-encrypted string using Private Key.
     */
    async decrypt(encryptedData: string, username: string): Promise<Record<string, any>> {
        try {
            const privateKeyPem = await this.getPrivateKey(username);

            if (!privateKeyPem) {
                console.log('Private key not found');
                // throw new Error('Private key not found');
            }

            const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

            const encryptedBytes = forge.util.decode64(encryptedData);

            console.error('Decryption: encryptedBytes', encryptedBytes);


            const decrypted = privateKey.decrypt(encryptedBytes, 'RSA-OAEP', {
                md: forge.md.sha256.create(),
            });
            console.error('Decryption: decrypted', decrypted);


            return JSON.parse(forge.util.decodeUtf8(decrypted)); // Convert back to object
        } catch (error) {
            console.error('Decryption Error:', error.message);
            return { error: 'Decryption failed' };
            // throw new Error('Decryption failed');
        }
    }
}