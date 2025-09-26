import crypto from "crypto";
import { encKey, hmacKey } from "../../config";

const ENC_KEY = Buffer.from(encKey, 'base64'); // 256-bit AES key
const HMAC_KEY = Buffer.from(hmacKey, 'base64'); // HMAC key for hashing
const ALGORITHM = "aes-256-gcm";

export interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
}

/**
 * Encrypt a string with AES-256-GCM
 */
export function encrypt(text: string): EncryptedData {
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, ENC_KEY, iv);

  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    encrypted: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
}

/**
 * Decrypt data previously encrypted with AES-256-GCM
 */
export function decrypt(data: EncryptedData): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    ENC_KEY,
    Buffer.from(data.iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(data.tag, "base64"));

  const decrypted =
    decipher.update(Buffer.from(data.encrypted, "base64"), undefined, "utf8") +
    decipher.final("utf8");

  return decrypted;
}

/**
 * Create an HMAC-SHA256 hash (used for queryable fields like email)
 */
export function hmacHash(value: string): string {
  return crypto.createHmac("sha256", HMAC_KEY).update(value).digest("hex");
}
