import { createRoute } from "@hono/zod-openapi";

import type { AppType } from "../app";
import { getVerifactuClient } from "../config/client";
import { IssueInvoiceRequestSchema, IssueInvoiceResponseSchema } from "../schemas/invoices.schema";

const route = createRoute({
  method: "post",
  path: "/v1/invoices/issue",
  tags: ["Invoices"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: IssueInvoiceRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Issue invoice result",
      content: {
        "application/json": {
          schema: IssueInvoiceResponseSchema,
        },
      },
    },
  },
});

export function registerInvoicesRoute(app: AppType): void {
  app.openapi(route, async (c) => {
    const payload = c.req.valid("json");
    const client = getVerifactuClient();
    const result = await client.issueInvoice(payload);
    return c.json(result, 200);
  });
}
