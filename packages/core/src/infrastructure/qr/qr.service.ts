import QRCode from "qrcode";

import { VERIFACTU_QR_BASE_URLS } from "../../config/defaults";
import type { VerifactuEnvironment } from "../../config/env";
import type { QrInput, QrResult } from "../../domain/models/qr";
import { formatDate } from "../../utils/date";
import { formatCurrency } from "../../utils/money";

export function buildQrValidationUrl(environment: VerifactuEnvironment, input: QrInput): string {
  const baseUrl = VERIFACTU_QR_BASE_URLS[environment];
  const params = new URLSearchParams({
    nif: input.issuerNif,
    numserie: input.numSerieFactura,
    fecha: formatDate(input.date),
    importe: formatCurrency(input.total),
  });

  return `${baseUrl}?${params.toString()}`;
}

export async function generateQr(
  environment: VerifactuEnvironment,
  input: QrInput,
): Promise<QrResult> {
  const validationUrl = buildQrValidationUrl(environment, input);

  const [base64, png] = await Promise.all([
    QRCode.toDataURL(validationUrl),
    QRCode.toBuffer(validationUrl, { width: 200 }),
  ]);

  return {
    validationUrl,
    base64,
    png,
  };
}
