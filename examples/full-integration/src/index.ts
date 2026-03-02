import {
  createVerifactuClient,
  generateQr as generateQrFromCore,
  type QueryInvoicesInput,
  queryInvoices as queryInvoicesFromCore,
} from "@verifactu-oss/core";

type EnvLike = Record<string, string | undefined>;

type FullIntegrationEnv = EnvLike & {
  API_BASE_URL?: string;
  VERIFACTU_ENV?: string;
  COMPANY_NAME?: string;
  ISSUER_NIF?: string;
  INVOICE_SERIAL?: string;
  INVOICE_DATE?: string;
  INVOICE_TOTAL?: string;
  QUERY_YEAR?: string;
  QUERY_MONTH?: string;
  RUN_REMOTE_QUERY?: string;
};

type LoggerLike = {
  info: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

type CoreDeps = {
  createClient: (options: { environment: "sandbox" | "production" }) => unknown;
  generateQr: (
    client: unknown,
    input: { issuerNif: string; numSerieFactura: string; date: Date; total: number },
  ) => Promise<{ validationUrl: string; base64: string; png: Buffer }>;
  queryInvoices: (client: unknown, input: QueryInvoicesInput) => Promise<unknown>;
};

type RunSdkFlowOptions = {
  core: CoreDeps;
  logger: LoggerLike;
  env: FullIntegrationEnv;
};

type RunApiFlowOptions = {
  fetch: FetchLike;
  logger: LoggerLike;
  env: FullIntegrationEnv;
};

type RunFullIntegrationFlowOptions = {
  core?: CoreDeps;
  fetch?: FetchLike;
  logger?: LoggerLike;
  env?: FullIntegrationEnv;
};

const defaultCoreDeps: CoreDeps = {
  createClient: createVerifactuClient,
  generateQr: (client, input) => generateQrFromCore(client as never, input),
  queryInvoices: (client, input) => queryInvoicesFromCore(client as never, input),
};

export async function runSdkFlow(options: RunSdkFlowOptions): Promise<void> {
  const environment = options.env.VERIFACTU_ENV === "production" ? "production" : "sandbox";

  const client = options.core.createClient({ environment });

  const qr = await options.core.generateQr(client, {
    issuerNif: options.env.ISSUER_NIF ?? "B12345678",
    numSerieFactura: options.env.INVOICE_SERIAL ?? "A-0001",
    date: new Date(options.env.INVOICE_DATE ?? "2026-02-01"),
    total: Number(options.env.INVOICE_TOTAL ?? 121),
  });

  options.logger.info("[SDK] QR URL:", qr.validationUrl);

  const queryInput: QueryInvoicesInput = {
    companyName: options.env.COMPANY_NAME ?? "Acme SL",
    issuerNif: options.env.ISSUER_NIF ?? "B12345678",
    filters: {
      year: Number(options.env.QUERY_YEAR ?? 2026),
      month: Number(options.env.QUERY_MONTH ?? 2),
      serialNumber: options.env.INVOICE_SERIAL ?? "A-0001",
    },
  };

  if (options.env.RUN_REMOTE_QUERY === "true") {
    try {
      const queryResult = await options.core.queryInvoices(client, queryInput);
      options.logger.info("[SDK] Query result:", queryResult);
    } catch (error) {
      options.logger.error("[SDK] Query failed", error);
    }
  } else {
    options.logger.info("[SDK] Skipping remote query (set RUN_REMOTE_QUERY=true to enable)");
  }
}

export async function runApiFlow(options: RunApiFlowOptions): Promise<void> {
  const baseUrl = options.env.API_BASE_URL ?? "http://localhost:3000";

  const response = await options.fetch(`${baseUrl}/v1/invoices/qr`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      issuerNif: options.env.ISSUER_NIF ?? "B12345678",
      numSerieFactura: options.env.INVOICE_SERIAL ?? "A-0001",
      date: options.env.INVOICE_DATE ?? "2026-02-01",
      total: Number(options.env.INVOICE_TOTAL ?? 121),
    }),
  });

  options.logger.info("[API] POST /v1/invoices/qr", response.status, await response.json());
}

export async function runFullIntegrationFlow(
  options: RunFullIntegrationFlowOptions = {},
): Promise<void> {
  const env = options.env ?? process.env;
  const logger = options.logger ?? console;
  const core = options.core ?? defaultCoreDeps;
  const fetchImpl = options.fetch ?? fetch;

  await runSdkFlow({
    core,
    logger,
    env,
  });

  await runApiFlow({
    fetch: fetchImpl,
    logger,
    env,
  });
}

if (import.meta.main) {
  await runFullIntegrationFlow();
}
