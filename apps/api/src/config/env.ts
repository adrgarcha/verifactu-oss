export type ApiEnv = {
  NODE_ENV?: string;
  PORT: number;
  VERIFACTU_ENV: "sandbox" | "production";
  VERIFACTU_ENDPOINT?: string;
  VERIFACTU_TIMEOUT_MS: number;
  VERIFACTU_CERT_PATH?: string;
  VERIFACTU_KEY_PATH?: string;
  VERIFACTU_CA_PATH?: string;
  VERIFACTU_REJECT_UNAUTHORIZED: boolean;
};

export function getApiEnv(): ApiEnv {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: Number(process.env.PORT ?? 3000),
    VERIFACTU_ENV: process.env.VERIFACTU_ENV === "production" ? "production" : "sandbox",
    VERIFACTU_ENDPOINT: process.env.VERIFACTU_ENDPOINT,
    VERIFACTU_TIMEOUT_MS: Number(process.env.VERIFACTU_TIMEOUT_MS ?? 30_000),
    VERIFACTU_CERT_PATH: process.env.VERIFACTU_CERT_PATH,
    VERIFACTU_KEY_PATH: process.env.VERIFACTU_KEY_PATH,
    VERIFACTU_CA_PATH: process.env.VERIFACTU_CA_PATH,
    VERIFACTU_REJECT_UNAUTHORIZED: process.env.VERIFACTU_REJECT_UNAUTHORIZED !== "false",
  };
}
