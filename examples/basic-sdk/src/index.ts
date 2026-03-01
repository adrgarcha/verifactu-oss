import { createVerifactuClient, generateQr } from "@verifactu-oss/core";

async function main(): Promise<void> {
  const client = createVerifactuClient({
    environment: process.env.VERIFACTU_ENV === "production" ? "production" : "sandbox",
  });

  const invoiceDate = new Date(process.env.INVOICE_DATE ?? "2026-02-01");

  const result = await generateQr(client, {
    issuerNif: process.env.ISSUER_NIF ?? "B12345678",
    numSerieFactura: process.env.INVOICE_SERIAL ?? "A-0001",
    date: invoiceDate,
    total: Number(process.env.INVOICE_TOTAL ?? 121),
  });

  console.info("QR generated");
  console.info(`Validation URL: ${result.validationUrl}`);
  console.info(`Data URL prefix: ${result.base64.slice(0, 40)}...`);
  console.info(`PNG bytes: ${result.png.byteLength}`);
}

await main();
