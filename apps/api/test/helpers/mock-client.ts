import type {
  CancelInvoiceInput,
  CancelInvoiceResult,
  IssueInvoiceInput,
  IssueInvoiceResult,
  QrInput,
  QrResult,
  QueryInvoicesInput,
  QueryInvoicesResult,
} from "@verifactu-oss/core";

import type { VerifactuClientAdapter } from "../../src/config/client";

type MockClientOverrides = Partial<VerifactuClientAdapter>;

export function createMockClient(overrides: MockClientOverrides = {}): VerifactuClientAdapter {
  return {
    issueInvoice: async (_input: IssueInvoiceInput): Promise<IssueInvoiceResult> => ({
      success: [
        {
          id: "INV-001",
          num: "A-0001",
          fingerprint: "FINGERPRINT",
        },
      ],
      error: [],
    }),
    cancelInvoice: async (_input: CancelInvoiceInput): Promise<CancelInvoiceResult> => ({
      success: [
        {
          id: "INV-001",
          num: "A-0001",
          fingerprint: "FINGERPRINT",
        },
      ],
      error: [],
    }),
    queryInvoices: async (_input: QueryInvoicesInput): Promise<QueryInvoicesResult> => ({
      success: true,
      invoices: [{ id: "A-0001" }],
    }),
    generateQr: async (_input: QrInput): Promise<QrResult> => ({
      validationUrl: "https://example.test/qr",
      base64: "data:image/png;base64,abc",
      png: Buffer.from("abc"),
    }),
    ...overrides,
  };
}
