const NIF_REGEX = /^[A-Z0-9]{8,15}$/i;

export function assertValidNif(nif: string, fieldName = "nif"): void {
  if (!nif || !NIF_REGEX.test(nif)) {
    throw new Error(`Invalid ${fieldName}: ${nif}`);
  }
}
