// Server-only boundary check to prevent inclusion in client bundles
if (typeof window !== "undefined") {
  throw new Error("This module can only be executed on the server");
}

import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "crypto";

/**
 * Approved scrypt cost configuration per OWASP Password Storage Guidelines.
 */
const SCRYPT_CONFIG = {
  version: "v1",
  N: 16384, // CPU/memory cost parameter (2^14)
  r: 8, // Block size parameter
  p: 1, // Parallelization parameter
  keyLength: 64, // Output derived key length in bytes
  saltBytes: 16, // Random salt length in bytes
  maxmem: 64 * 1024 * 1024, // 64MB memory limit safeguard
} as const;

/**
 * Versioned format:
 * `v1$N=16384,r=8,p=1$<saltHex>$<derivedKeyHex>`
 */
const HASH_REGEX = /^v1\$N=(\d+),r=(\d+),p=(\d+)\$([0-9a-fA-F]+)\$([0-9a-fA-F]+)$/;

function deriveScryptKey(
  password: string | Buffer,
  salt: string | Buffer,
  keyLength: number,
  options: ScryptOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(derivedKey);
      }
    });
  });
}

/**
 * Securely hashes a plaintext password using Node.js scrypt with cryptographically random salt.
 * Output format: `v1$N=16384,r=8,p=1$<saltHex>$<derivedKeyHex>`
 *
 * @throws {Error} if input password is empty or not a string.
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("Password must be a non-empty string");
  }

  const salt = randomBytes(SCRYPT_CONFIG.saltBytes);
  const derivedKey = await deriveScryptKey(password, salt, SCRYPT_CONFIG.keyLength, {
    N: SCRYPT_CONFIG.N,
    r: SCRYPT_CONFIG.r,
    p: SCRYPT_CONFIG.p,
    maxmem: SCRYPT_CONFIG.maxmem,
  });

  const saltHex = salt.toString("hex");
  const keyHex = derivedKey.toString("hex");

  return `${SCRYPT_CONFIG.version}$N=${SCRYPT_CONFIG.N},r=${SCRYPT_CONFIG.r},p=${SCRYPT_CONFIG.p}$${saltHex}$${keyHex}`;
}

/**
 * Verifies a plaintext password against a versioned stored hash string.
 * Uses constant-time equality check (timingSafeEqual) to prevent timing side-channel attacks.
 *
 * Safely returns `false` without throwing if:
 * - password or storedHash is invalid/non-string
 * - storedHash format is unrecognized or malformed
 * - scrypt derivation parameters mismatch or are invalid
 * - password does not match
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (typeof password !== "string" || typeof storedHash !== "string") {
    return false;
  }

  if (password.length === 0 || storedHash.length === 0) {
    return false;
  }

  const match = HASH_REGEX.exec(storedHash);
  if (!match) {
    return false;
  }

  const [, nStr, rStr, pStr, saltHex, expectedKeyHex] = match;
  const N = parseInt(nStr, 10);
  const r = parseInt(rStr, 10);
  const p = parseInt(pStr, 10);

  // Validate parameters match allowed positive numbers
  if (isNaN(N) || isNaN(r) || isNaN(p) || N <= 0 || r <= 0 || p <= 0) {
    return false;
  }

  // Ensure salt and expected key are non-empty hex buffers
  if (!saltHex || !expectedKeyHex) {
    return false;
  }

  try {
    const salt = Buffer.from(saltHex, "hex");
    const expectedKey = Buffer.from(expectedKeyHex, "hex");

    if (salt.length !== SCRYPT_CONFIG.saltBytes || expectedKey.length !== SCRYPT_CONFIG.keyLength) {
      return false;
    }

    const derivedKey = await deriveScryptKey(password, salt, SCRYPT_CONFIG.keyLength, {
      N,
      r,
      p,
      maxmem: SCRYPT_CONFIG.maxmem,
    });

    if (derivedKey.length !== expectedKey.length) {
      return false;
    }

    return timingSafeEqual(expectedKey, derivedKey);
  } catch {
    // Fail safely on any decoding/cryptographic parsing failure without leaking details
    return false;
  }
}
