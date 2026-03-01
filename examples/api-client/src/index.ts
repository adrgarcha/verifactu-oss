type IssueInvoicePayload = {
  id: string;
  companyName: string;
  issuerNif: string;
  numSerieFactura: string;
  date: string;
  total: number;
  tvat: number;
  invoiceType: "F1";
  description: string;
  vatLines: Array<{ vat: number; bi: number; tvat: number }>;
};

export {};

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";

async function postJson<TBody extends Record<string, unknown>>(
  path: string,
  body: TBody,
): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json();

  return {
    status: response.status,
    payload,
  };
}

async function main(): Promise<void> {
  const health = await fetch(`${API_BASE_URL}/health`);
  console.info("GET /health", health.status, await health.json());

  const qrResult = await postJson("/v1/invoices/qr", {
    issuerNif: process.env.ISSUER_NIF ?? "B12345678",
    numSerieFactura: process.env.INVOICE_SERIAL ?? "A-0001",
    date: process.env.INVOICE_DATE ?? "2026-02-01",
    total: Number(process.env.INVOICE_TOTAL ?? 121),
  });
  console.info("POST /v1/invoices/qr", qrResult);

  const issuePayload: IssueInvoicePayload = {
    id: "INV-EXAMPLE-001",
    companyName: process.env.COMPANY_NAME ?? "Acme SL",
    issuerNif: process.env.ISSUER_NIF ?? "B12345678",
    numSerieFactura: process.env.INVOICE_SERIAL ?? "A-0001",
    date: process.env.INVOICE_DATE ?? "2026-02-01",
    total: Number(process.env.INVOICE_TOTAL ?? 121),
    tvat: 21,
    invoiceType: "F1",
    description: "Factura generada por example api-client",
    vatLines: [{ vat: 21, bi: 100, tvat: 21 }],
  };

  if (process.env.RUN_ISSUE_EXAMPLE === "true") {
    try {
      const issueResult = await postJson("/v1/invoices/issue", issuePayload);
      console.info("POST /v1/invoices/issue", issueResult);
    } catch (error) {
      console.error("Issue example failed", error);
    }
  } else {
    console.info("Skipping issue example (set RUN_ISSUE_EXAMPLE=true to enable)");
  }
}

await main();
