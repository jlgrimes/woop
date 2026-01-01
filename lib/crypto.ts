import { createHash, createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // GCM standard IV length
const AUTH_TAG_LENGTH = 16;

function getSalt(): string {
  const salt = process.env.CLIPBOARD_SALT;
  if (!salt) {
    throw new Error('CLIPBOARD_SALT environment variable is required');
  }
  return salt;
}

/**
 * Creates a SHA-256 hash of the IP + salt for use as a Redis key
 */
export function hashIP(ip: string): string {
  const salt = getSalt();
  return createHash('sha256').update(`${ip}${salt}`).digest('hex');
}

/**
 * Derives a 32-byte encryption key from IP + salt
 */
function deriveKey(ip: string): Buffer {
  const salt = getSalt();
  return createHash('sha256').update(`${ip}${salt}`).digest();
}

/**
 * Encrypts text using AES-256-GCM
 * Returns: base64(iv + authTag + ciphertext)
 */
export function encrypt(text: string, ip: string): string {
  const key = deriveKey(ip);
  const iv = randomBytes(IV_LENGTH);
  
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  
  // Combine IV + authTag + ciphertext into a single buffer
  const combined = Buffer.concat([iv, authTag, encrypted]);
  return combined.toString('base64');
}

/**
 * Decrypts text encrypted with encrypt()
 * Input: base64(iv + authTag + ciphertext)
 */
export function decrypt(encryptedText: string, ip: string): string {
  const key = deriveKey(ip);
  const combined = Buffer.from(encryptedText, 'base64');
  
  // Extract IV, authTag, and ciphertext
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  
  return decrypted.toString('utf8');
}

