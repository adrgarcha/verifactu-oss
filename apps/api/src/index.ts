import { createApp } from "./app";
import { getApiEnv } from "./config/env";

export const app = createApp();

if (import.meta.main) {
  const env = getApiEnv();
  Bun.serve({
    port: env.PORT,
    fetch: app.fetch,
  });

  console.info(`Verifactu API listening on http://localhost:${env.PORT}`);
}
