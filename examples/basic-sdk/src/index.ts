import {
  createVerifactuClient,
  generateQr as generateQrFromCore,
  type QrInput,
  type QrResult,
  type VerifactuEnvironment,
} from "@verifactu-oss/core";

type EnvLike = Record<string, string | undefined>;

export type BasicSdkEnv = EnvLike & {
  VERIFACTU_ENV?: string;
  ISSUER_NIF?: string;
  INVOICE_SERIAL?: string;
  INVOICE_DATE?: string;
  INVOICE_TOTAL?: string;
};

export type BasicSdkInput = {
  environment: VerifactuEnvironment;
  qrInput: QrInput;
};

type BasicSdkDeps = {
  createClient: (options: { environment: VerifactuEnvironment }) => unknown;
  generateQr: (client: unknown, input: QrInput) => Promise<QrResult>;
  logger: {
    info: (...args: unknown[]) => void;
  };
};

export function buildBasicSdkInputFromEnv(env: BasicSdkEnv): BasicSdkInput {
  return {
    environment: env.VERIFACTU_ENV === "production" ? "production" : "sandbox",
    qrInput: {
      issuerNif: env.ISSUER_NIF ?? "B12345678",
      numSerieFactura: env.INVOICE_SERIAL ?? "A-0001",
      date: new Date(env.INVOICE_DATE ?? "2026-02-01"),
      total: Number(env.INVOICE_TOTAL ?? 121),
    },
  };
}

const defaultDeps: BasicSdkDeps = {
  createClient: createVerifactuClient,
  generateQr: (client, input) => generateQrFromCore(client as never, input),
  logger: console,
};

export async function runBasicSdkFlow(
  deps: BasicSdkDeps = defaultDeps,
  env: BasicSdkEnv = process.env,
): Promise<QrResult> {
  const input = buildBasicSdkInputFromEnv(env);
  const client = deps.createClient({ environment: input.environment });
  const result = await deps.generateQr(client, input.qrInput);

  deps.logger.info("QR generated");
  deps.logger.info(`Validation URL: ${result.validationUrl}`);
  deps.logger.info(`Data URL prefix: ${result.base64.slice(0, 40)}...`);
  deps.logger.info(`PNG bytes: ${result.png.byteLength}`);

  return result;
}

if (import.meta.main) {
  await runBasicSdkFlow();
}
