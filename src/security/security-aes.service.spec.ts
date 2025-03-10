// import { SecurityAESService } from "./security.aes.service";
// import * as fs from 'fs';

// import { generateAESKey, encryptAES, decryptAES, encryptAESKeyWithRSA, decryptAESKeyWithRSA } from './security.aes.service';

// // Load RSA keys from secure storage
// const privateKey = fs.readFileSync('private.pem', 'utf8');
// const publicKey = fs.readFileSync('public.pem', 'utf8');

// const data = { "data": { "type": "users", "attributes": { "login": "nasser jooon", "firstName": "string", "lastName": "string", "isActive": true, "createdAt": "2023-12-08T10:32:27.352Z", "updatedAt": "2023-12-08T10:32:27.352Z" }, "relationships": { "addresses": { "data": { "id": "1", "type": "addresses" } } } } }

// async function testEncryption() {
//     const payload = data //{ username: "john_doe", email: "john@example.com", balance: 1000 };

//     console.log("🔹 Original Payload:", payload);

//     // 1️⃣ Generate AES-256 Key
//     const aesKey = generateAESKey();

//     // 2️⃣ Encrypt Data using AES-GCM
//     const { encrypted, iv, authTag } = encryptAES(JSON.stringify(payload), aesKey);
//     console.log("\n🔒 AES Encrypted Data:", encrypted);

//     // 3️⃣ Encrypt AES Key using RSA
//     const encryptedKey = encryptAESKeyWithRSA(aesKey, publicKey);
//     console.log("\n🔐 RSA Encrypted AES Key:", encryptedKey);

//     // ✅ Simulating sending the encrypted data to backend...
//     console.log("\n🚀 Sending encrypted data to backend...");

//     // 4️⃣ Decrypt AES Key using RSA (on backend)
//     const decryptedAESKey = decryptAESKeyWithRSA(encryptedKey, privateKey);
//     console.log("\n🔑 Decrypted AES Key:", decryptedAESKey.toString('hex'));

//     // 5️⃣ Decrypt Data using AES-GCM
//     const decryptedData = decryptAES(encrypted, decryptedAESKey, iv, authTag);
//     console.log("\n✅ Decrypted Payload:", JSON.parse(decryptedData));

//     if (JSON.stringify(payload) === decryptedData) {
//         console.log("\n🎉 Encryption & Decryption SUCCESS!");
//         return decryptedData;
//     } else {
//         console.log("\n❌ Something went wrong!");
//         return {};
//     }
// }

// describe('SecurityAESService', () => {
//     let securityService: SecurityAESService;

//     beforeAll(() => {
//         // Ensure the test has RSA key files
//         if (!fs.existsSync('private.pem') || !fs.existsSync('public.pem')) {
//             throw new Error("RSA keys (private.pem, public.pem) not found. Generate them before running tests.");
//         }

//         securityService = new SecurityAESService("yasser");
//     });

//     it('should encrypt and decrypt data correctly', async () => {

//         // Run the test
//         const result = await testEncryption();

//         // Ensure the decrypted payload matches the original
//         expect(JSON.stringify(data)).toEqual(result);
//     });

//     it('should encrypt and decrypt data correctly by service', async () => {

//         // Run the test
//         const { encryptedKey, iv, authTag, encryptedData } = await securityService.encrypt(data);
//         console.log("\n✅ Encrypted Payload:", encryptedKey, iv, authTag, encryptedData);

//         const decryptedData = await securityService.decrypt(encryptedData, encryptedKey, iv, authTag);
//         console.log("\n✅ dEcrypted Payload:", decryptedData);


//         if (JSON.stringify(data) === JSON.stringify(decryptedData)) {
//             console.log("\n🎉 Encryption & Decryption SUCCESS!");
//         } else {
//             console.log("\n❌ Something went wrong!");
//         }
//         // Ensure the decrypted payload matches the original
//         expect(decryptedData).toEqual(data);
//     });

//     // it('should throw error if decryption fails due to wrong key', () => {
//     //     const payload = { message: "This is a test" };

//     //     // Encrypt using correct key
//     //     const { encryptedData, encryptedKey, iv, authTag } = securityService.encryptData(payload);

//     //     // Modify the encrypted key (simulate an attack)
//     //     const tamperedKey = encryptedKey.slice(0, -1) + (encryptedKey.endsWith("A") ? "B" : "A");

//     //     // Try decrypting with wrong key
//     //     expect(() => {
//     //         securityService.decryptData(encryptedData, tamperedKey, iv, authTag);
//     //     });
//     // });
// });
