import type { VerifactuClient } from "../../client/verifactu-client";
import type { QrInput, QrResult } from "../../domain/models/qr";

export async function generateQr(client: VerifactuClient, input: QrInput): Promise<QrResult> {
  return client.generateQr(input);
}
