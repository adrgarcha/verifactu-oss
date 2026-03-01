import { z } from "@hono/zod-openapi";

import { LastInvoiceSchema } from "./invoices.schema";

export const CancelInvoiceRequestSchema = z
  .object({
    id: z.string().openapi({ example: "INV-001" }),
    companyName: z.string().openapi({ example: "Acme SL" }),
    issuerNif: z.string().openapi({ example: "B12345678" }),
    numSerieFactura: z.string().openapi({ example: "A-0001" }),
    date: z.coerce.date().openapi({ example: "2026-02-02" }),
    total: z.number().openapi({ example: 121 }),
    tvat: z.number().openapi({ example: 21 }),
    lastInvoice: LastInvoiceSchema.nullable().optional(),
  })
  .openapi("CancelInvoiceRequest");
