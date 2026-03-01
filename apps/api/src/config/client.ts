import {
  createVerifactuClient,
  FileCertificateProvider,
  type VerifactuClient,
} from "@verifactu-oss/core";

import { getApiEnv } from "./env";

let cachedClient: VerifactuClient | null = null;

export function getVerifactuClient(): VerifactuClient {
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
