const FINGERPRINT_REGEX = /^[A-F0-9]{64}$/;

export function assertValidFingerprint(fingerprint: string): void {
  if (!FINGERPRINT_REGEX.test(fingerprint)) {
    throw new Error("Invalid fingerprint format");
  }
}
