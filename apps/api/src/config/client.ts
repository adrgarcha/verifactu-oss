import {
  type CancelInvoiceInput,
  type CancelInvoiceResult,
  createVerifactuClient,
  FileCertificateProvider,
  type IssueInvoiceInput,
  type IssueInvoiceResult,
  type QrInput,
  type QrResult,
  type QueryInvoicesInput,
  type QueryInvoicesResult,
} from "@verifactu-oss/core";

import { getApiEnv } from "./env";

export type VerifactuClientAdapter = {
  issueInvoice(input: IssueInvoiceInput): Promise<IssueInvoiceResult>;
  cancelInvoice(input: CancelInvoiceInput): Promise<CancelInvoiceResult>;
  queryInvoices(input: QueryInvoicesInput): Promise<QueryInvoicesResult>;
  generateQr(input: QrInput): Promise<QrResult>;
};

let cachedClient: VerifactuClientAdapter | null = null;
let overriddenClientForTests: VerifactuClientAdapter | null = null;

export function getVerifactuClient(): VerifactuClientAdapter {
  if (overriddenClientForTests) {
    return overriddenClientForTests;
  }

  if (cachedClient) {
    return cachedClient;
  }

  const env = getApiEnv();
  let certificateProvider: FileCertificateProvider | undefined;

  if (env.VERIFACTU_CERT_PATH && env.VERIFACTU_KEY_PATH) {
    certificateProvider = new FileCertificateProvider(
      env.VERIFACTU_CERT_PATH,
      env.VERIFACTU_KEY_PATH,
      {
        caPath: env.VERIFACTU_CA_PATH,
        rejectUnauthorized: env.VERIFACTU_REJECT_UNAUTHORIZED,
      },
    );
  }

  cachedClient = createVerifactuClient({
    environment: env.VERIFACTU_ENV,
    endpoint: env.VERIFACTU_ENDPOINT,
    timeoutMs: env.VERIFACTU_TIMEOUT_MS,
    certificateProvider,
  });

  return cachedClient;
}

export function setVerifactuClientForTests(client: VerifactuClientAdapter | null): void {
  overriddenClientForTests = client;
}

export function resetVerifactuClientCacheForTests(): void {
  cachedClient = null;
  overriddenClientForTests = null;
}
