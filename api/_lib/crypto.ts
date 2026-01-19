import crypto from 'crypto';

function getKey(): Buffer {
  const raw = process.env.TOKEN_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error('Missing TOKEN_ENCRYPTION_KEY env var (base64-encoded 32-byte key).');
  }
  const buf = Buffer.from(raw, 'base64');
  if (buf.length !== 32) {
    throw new Error('TOKEN_ENCRYPTION_KEY must be base64 for exactly 32 bytes (AES-256-GCM).');
  }
  return buf;
}

export function encryptString(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  // iv.tag.ciphertext (base64)
  return Buffer.concat([iv, tag, enc]).toString('base64');
}

export function decryptString(payloadB64: string): string {
  const key = getKey();
  const raw = Buffer.from(payloadB64, 'base64');
  if (raw.length < 12 + 16 + 1) throw new Error('Invalid encrypted payload.');
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const enc = raw.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString('utf8');
}

