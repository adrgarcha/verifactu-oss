import { z } from "@hono/zod-openapi";

export const GenerateQrRequestSchema = z
  .object({
    issuerNif: z.string().openapi({ example: "B12345678" }),
    numSerieFactura: z.string().openapi({ example: "A-0001" }),
    date: z.coerce.date().openapi({ example: "2026-02-01" }),
    total: z.number().openapi({ example: 121 }),
  })
  .openapi("GenerateQrRequest");

export const GenerateQrResponseSchema = z
  .object({
    validationUrl: z.string(),
    base64: z.string(),
    pngBase64: z.string(),
  })
  .openapi("GenerateQrResponse");
