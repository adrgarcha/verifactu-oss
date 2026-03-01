import { createRoute } from "@hono/zod-openapi";
import { cancelInvoice } from "@verifactu-oss/core";

import type { AppType } from "../app";
import { getVerifactuClient } from "../config/client";
import { CancelInvoiceRequestSchema } from "../schemas/cancellations.schema";
import { IssueInvoiceResponseSchema } from "../schemas/invoices.schema";

const route = createRoute({
  method: "post",
  path: "/v1/invoices/cancel",
  tags: ["Invoices"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: CancelInvoiceRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Cancel invoice result",
      content: {
        "application/json": {
          schema: IssueInvoiceResponseSchema,
        },
      },
    },
  },
});

export function registerCancellationsRoute(app: AppType): void {
  app.openapi(route, async (c) => {
    const payload = c.req.valid("json");
    const client = getVerifactuClient();
    const result = await cancelInvoice(client, payload);
    return c.json(result, 200);
  });
}
