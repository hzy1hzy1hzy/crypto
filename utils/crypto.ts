
/**
 * ECIES (Elliptic Curve Integrated Encryption Scheme) 实现
 * 使用 P-256 曲线进行 ECDH，AES-256-GCM 进行对称加密
 */

export async function generateECCKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey"]
  );
  return keyPair;
}

export async function exportKey(key: CryptoKey, format: 'spki' | 'pkcs8'): Promise<string> {
  const exported = await window.crypto.subtle.exportKey(format, key);
  return arrayBufferToBase64(exported);
}

export async function importPrivateKey(base64Key: string): Promise<CryptoKey> {
  const buf = base64ToArrayBuffer(base64Key);
  return await window.crypto.subtle.importKey(
    "pkcs8",
    buf,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey"]
  );
}

export async function encryptFileECC(file: File, recipientPublicKey: CryptoKey): Promise<{
  encryptedBlob: Blob;
  ephemeralPublicKeyBase64: string;
}> {
  // 1. 生成临时密钥对
  const ephemeralKeyPair = await generateECCKeyPair();
  
  // 2. 派生共享密钥 (ECDH)
  const sharedKey = await window.crypto.subtle.deriveKey(
    { name: "ECDH", public: recipientPublicKey },
    ephemeralKeyPair.privateKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
  );

  // 3. 读取并加密
  const fileData = await file.arrayBuffer();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    sharedKey,
    fileData
  );

  // 4. 封装数据: [EphemeralPubKey(Raw)] + [IV(12)] + [Ciphertext]
  const rawEphemeralPubKey = await window.crypto.subtle.exportKey("raw", ephemeralKeyPair.publicKey);
  const combined = new Uint8Array(rawEphemeralPubKey.byteLength + iv.byteLength + ciphertext.byteLength);
  combined.set(new Uint8Array(rawEphemeralPubKey), 0);
  combined.set(iv, rawEphemeralPubKey.byteLength);
  combined.set(new Uint8Array(ciphertext), rawEphemeralPubKey.byteLength + iv.byteLength);

  return {
    encryptedBlob: new Blob([combined], { type: 'application/octet-stream' }),
    ephemeralPublicKeyBase64: arrayBufferToBase64(rawEphemeralPubKey)
  };
}

export async function decryptFileECC(encryptedData: ArrayBuffer, privateKey: CryptoKey): Promise<Blob> {
  const data = new Uint8Array(encryptedData);
  
  // 1. 拆分数据 (P-256 Raw Public Key 是 65 字节)
  const pubKeyRaw = data.slice(0, 65);
  const iv = data.slice(65, 77);
  const ciphertext = data.slice(77);

  // 2. 导入临时公钥
  const ephemeralPubKey = await window.crypto.subtle.importKey(
    "raw",
    pubKeyRaw,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    []
  );

  // 3. 重新派生共享密钥
  const sharedKey = await window.crypto.subtle.deriveKey(
    { name: "ECDH", public: ephemeralPubKey },
    privateKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt"]
  );

  // 4. 解密
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    sharedKey,
    ciphertext
  );

  return new Blob([decrypted]);
}

// Helpers
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
