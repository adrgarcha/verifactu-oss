import { createRoute } from "@hono/zod-openapi";

import type { AppType } from "../app";
import { getVerifactuClient } from "../config/client";
import {
  QueryInvoicesErrorSchema,
  QueryInvoicesRequestSchema,
  QueryInvoicesSuccessSchema,
} from "../schemas/query.schema";

const route = createRoute({
  method: "post",
  path: "/v1/invoices/query",
  tags: ["Invoices"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: QueryInvoicesRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Query invoices success",
      content: {
        "application/json": {
          schema: QueryInvoicesSuccessSchema,
        },
      },
    },
    502: {
      description: "Query invoices upstream failure",
      content: {
        "application/json": {
          schema: QueryInvoicesErrorSchema,
        },
      },
    },
  },
});

export function registerQueryRoute(app: AppType): void {
  app.openapi(route, async (c) => {
    const payload = c.req.valid("json");
    const client = getVerifactuClient();
    const result = await client.queryInvoices(payload);

    if (!result.success) {
      return c.json(result, 502);
    }

    return c.json(result, 200);
  });
}
