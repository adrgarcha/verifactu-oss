import { createRoute, z } from "@hono/zod-openapi";

import type { AppType } from "../app";

const HealthResponseSchema = z
  .object({
    ok: z.boolean(),
    requestId: z.string(),
  })
  .openapi("HealthResponse");

const route = createRoute({
  method: "get",
  path: "/health",
  tags: ["System"],
  responses: {
    200: {
      description: "Health check",
      content: {
        "application/json": {
          schema: HealthResponseSchema,
        },
      },
    },
  },
});

export function registerHealthRoute(app: AppType): void {
  app.openapi(route, (c) => {
    const requestId = c.get("requestId");
    return c.json({ ok: true, requestId }, 200);
  });
}
