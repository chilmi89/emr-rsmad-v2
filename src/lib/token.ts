import crypto from "crypto";

/**
 * Menghasilkan token acak yang aman dan tidak dapat ditebak.
 * Panjang 16 byte hex (32 karakter) atau 8 byte pendek untuk URL internal.
 */
export function generateSimulationToken(length = 12): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Menghasilkan hash SHA-256 dari token untuk pencocokan database yang aman.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
