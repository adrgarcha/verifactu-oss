export function assertValidSerialNumber(serialNumber: string): void {
  if (!serialNumber || serialNumber.trim().length === 0) {
    throw new Error("Invalid serial number");
  }
}
