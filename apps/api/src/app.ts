import { OpenAPIHono } from "@hono/zod-openapi";

import { registerErrorHandlers } from "./middlewares/error-handler";
import { loggerMiddleware } from "./middlewares/logger";
import { requestIdMiddleware } from "./middlewares/request-id";
import { registerOpenApi } from "./openapi/registry";

export type AppBindings = {
  Variables: {
    requestId: string;
  };
};

export type AppType = OpenAPIHono<AppBindings>;

export function createApp() {
  const app = new OpenAPIHono<AppBindings>();

  app.use("*", requestIdMiddleware);
  app.use("*", loggerMiddleware);

  registerOpenApi(app);
  registerErrorHandlers(app);

  app.get("/", (c) => {
    return c.json({
      name: "Verifactu OSS API",
      openapi: "/openapi.json",
      requestId: c.get("requestId"),
    });
  });

  return app;
}
