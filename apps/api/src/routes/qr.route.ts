import { createRoute } from "@hono/zod-openapi";

import type { AppType } from "../app";
import { getVerifactuClient } from "../config/client";
import { GenerateQrRequestSchema, GenerateQrResponseSchema } from "../schemas/qr.schema";

const route = createRoute({
  method: "post",
  path: "/v1/invoices/qr",
  tags: ["Invoices"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: GenerateQrRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Generate QR result",
      content: {
        "application/json": {
          schema: GenerateQrResponseSchema,
        },
      },
    },
  },
});

export function registerQrRoute(app: AppType): void {
  app.openapi(route, async (c) => {
    const payload = c.req.valid("json");
    const client = getVerifactuClient();
    const result = await client.generateQr(payload);

    return c.json(
      {
        validationUrl: result.validationUrl,
        base64: result.base64,
        pngBase64: result.png.toString("base64"),
      },
      200,
    );
  });
}
