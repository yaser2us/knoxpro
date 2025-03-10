import * as fs from 'fs';
import * as crypto from 'crypto';

const privateKey = fs.readFileSync('private.pem', 'utf8');
console.log(privateKey,'[privateKey]')
// Decode Base64 IV


function decryptAESKey(encryptedAESKey: string) {
    const buffer = Buffer.from(encryptedAESKey, 'base64');
    const decryptedAESKey = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        buffer
    );
    return decryptedAESKey.toString();
}

function decryptPayload(encryptedPayload: string, aesKey: string, iv: string) {
    if (!encryptedPayload || !aesKey || !iv) {
        throw new Error('Missing required parameters (encryptedPayload, aesKey, iv)');
    }

    try {
        // Convert IV to Buffer (Base64 to Buffer)
        const ivBuffer = Buffer.from(iv, 'base64');
        if (ivBuffer.length !== 16) {
            throw new Error('Invalid IV length');
        }

        // Convert AES key from Base64 to Buffer (if passed as Base64-encoded string)
        const keyBuffer = Buffer.from(aesKey, 'base64');
        if (keyBuffer.length !== 32) {
            throw new Error('Invalid key length, should be 32 bytes for AES-256');
        }

        // Decrypt the payload
        const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
        let decrypted = decipher.update(encryptedPayload, 'base64', 'utf8');
        decrypted += decipher.final('utf8'); // Finalize decryption

        return JSON.parse(decrypted); // Assuming the payload is JSON-encoded
    } catch (err) {
        console.error('Decryption error:', err);
        throw new Error('Decryption failed');
    }
}

function decryptPayloadLegacy(encryptedPayload: string, aesKey: string, iv: string) {
    const ivBuffer = Buffer.from(iv, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(aesKey), ivBuffer);
    let decrypted = decipher.update(encryptedPayload, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}

function getPublicKey() {
    return fs.readFileSync('public.pem', 'utf8');
}

export {
    getPublicKey,
    decryptAESKey,
    decryptPayload
}