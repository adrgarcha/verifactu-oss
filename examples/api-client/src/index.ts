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

type EnvLike = Record<string, string | undefined>;

type ApiClientEnv = EnvLike & {
  API_BASE_URL?: string;
  COMPANY_NAME?: string;
  ISSUER_NIF?: string;
  INVOICE_SERIAL?: string;
  INVOICE_DATE?: string;
  INVOICE_TOTAL?: string;
  RUN_ISSUE_EXAMPLE?: string;
};

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

type LoggerLike = {
  info: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};

type PostJsonResult = {
  status: number;
  payload: unknown;
};

type CreateApiClientOptions = {
  baseUrl: string;
  fetch: FetchLike;
};

type RunApiClientFlowOptions = {
  fetch?: FetchLike;
  logger?: LoggerLike;
  env?: ApiClientEnv;
};

async function postJson(
  fetchImpl: FetchLike,
  baseUrl: string,
  path: string,
  body: Record<string, unknown>,
): Promise<PostJsonResult> {
  const response = await fetchImpl(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return {
    status: response.status,
    payload: await response.json(),
  };
}

function buildIssuePayload(env: ApiClientEnv): IssueInvoicePayload {
  return {
    id: "INV-EXAMPLE-001",
    companyName: env.COMPANY_NAME ?? "Acme SL",
    issuerNif: env.ISSUER_NIF ?? "B12345678",
    numSerieFactura: env.INVOICE_SERIAL ?? "A-0001",
    date: env.INVOICE_DATE ?? "2026-02-01",
    total: Number(env.INVOICE_TOTAL ?? 121),
    tvat: 21,
    invoiceType: "F1",
    description: "Factura generada por example api-client",
    vatLines: [{ vat: 21, bi: 100, tvat: 21 }],
  };
}

export function createApiClient(options: CreateApiClientOptions) {
  return {
    health: async () => {
      const response = await options.fetch(`${options.baseUrl}/health`);
      return {
        status: response.status,
        payload: await response.json(),
      };
    },
    qr: (body: { issuerNif: string; numSerieFactura: string; date: string; total: number }) =>
      postJson(options.fetch, options.baseUrl, "/v1/invoices/qr", body),
    issue: (body: IssueInvoicePayload) =>
      postJson(
        options.fetch,
        options.baseUrl,
        "/v1/invoices/issue",
        body as Record<string, unknown>,
      ),
  };
}

export async function runApiClientFlow(options: RunApiClientFlowOptions = {}): Promise<void> {
  const env = options.env ?? process.env;
  const baseUrl = env.API_BASE_URL ?? "http://localhost:3000";
  const fetchImpl = options.fetch ?? fetch;
  const logger = options.logger ?? console;
  const client = createApiClient({ baseUrl, fetch: fetchImpl });

  const health = await client.health();
  logger.info("GET /health", health.status, health.payload);

  const qrResult = await client.qr({
    issuerNif: env.ISSUER_NIF ?? "B12345678",
    numSerieFactura: env.INVOICE_SERIAL ?? "A-0001",
    date: env.INVOICE_DATE ?? "2026-02-01",
    total: Number(env.INVOICE_TOTAL ?? 121),
  });
  logger.info("POST /v1/invoices/qr", qrResult);

  if (env.RUN_ISSUE_EXAMPLE === "true") {
    try {
      const issuePayload = buildIssuePayload(env);
      const issueResult = await client.issue(issuePayload);
      logger.info("POST /v1/invoices/issue", issueResult);
    } catch (error) {
      logger.error("Issue example failed", error);
    }
  } else {
    logger.info("Skipping issue example (set RUN_ISSUE_EXAMPLE=true to enable)");
  }
}

if (import.meta.main) {
  await runApiClientFlow();
}
