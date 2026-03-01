import {
  createVerifactuClient,
  generateQr,
  type QueryInvoicesInput,
  queryInvoices,
} from "@verifactu-oss/core";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";

async function runSdkFlow() {
  const client = createVerifactuClient({
    environment: process.env.VERIFACTU_ENV === "production" ? "production" : "sandbox",
  });

  const qr = await generateQr(client, {
    issuerNif: process.env.ISSUER_NIF ?? "B12345678",
    numSerieFactura: process.env.INVOICE_SERIAL ?? "A-0001",
    date: new Date(process.env.INVOICE_DATE ?? "2026-02-01"),
    total: Number(process.env.INVOICE_TOTAL ?? 121),
  });

  console.info("[SDK] QR URL:", qr.validationUrl);

  const queryInput: QueryInvoicesInput = {
    companyName: process.env.COMPANY_NAME ?? "Acme SL",
    issuerNif: process.env.ISSUER_NIF ?? "B12345678",
    filters: {
      year: Number(process.env.QUERY_YEAR ?? 2026),
      month: Number(process.env.QUERY_MONTH ?? 2),
      serialNumber: process.env.INVOICE_SERIAL ?? "A-0001",
    },
  };

  if (process.env.RUN_REMOTE_QUERY === "true") {
    try {
      const queryResult = await queryInvoices(client, queryInput);
      console.info("[SDK] Query result:", queryResult);
    } catch (error) {
      console.error("[SDK] Query failed", error);
    }
  } else {
    console.info("[SDK] Skipping remote query (set RUN_REMOTE_QUERY=true to enable)");
  }
}

async function runApiFlow() {
  const response = await fetch(`${API_BASE_URL}/v1/invoices/qr`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      issuerNif: process.env.ISSUER_NIF ?? "B12345678",
      numSerieFactura: process.env.INVOICE_SERIAL ?? "A-0001",
      date: process.env.INVOICE_DATE ?? "2026-02-01",
      total: Number(process.env.INVOICE_TOTAL ?? 121),
    }),
  });

  console.info("[API] POST /v1/invoices/qr", response.status, await response.json());
}

await runSdkFlow();
await runApiFlow();
