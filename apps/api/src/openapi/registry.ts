import type { AppType } from "../app";
import { registerCancellationsRoute } from "../routes/cancellations.route";
import { registerHealthRoute } from "../routes/health.route";
import { registerInvoicesRoute } from "../routes/invoices.route";
import { registerQrRoute } from "../routes/qr.route";
import { registerQueryRoute } from "../routes/query.route";

export function registerOpenApi(app: AppType): void {
  registerHealthRoute(app);
  registerInvoicesRoute(app);
  registerCancellationsRoute(app);
  registerQueryRoute(app);
  registerQrRoute(app);

  app.doc("/openapi.json", {
    openapi: "3.0.0",
    info: {
      title: "Verifactu OSS API",
      version: "0.1.0",
      description: "HTTP wrapper over @verifactu-oss/core",
    },
    servers: [{ url: "http://localhost:3000" }],
  });
}
