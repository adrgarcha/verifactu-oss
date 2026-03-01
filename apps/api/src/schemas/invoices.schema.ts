import { z } from "@hono/zod-openapi";

export const VatLineSchema = z
  .object({
    vat: z.number().openapi({ example: 21 }),
    bi: z.number().openapi({ example: 100 }),
    tvat: z.number().openapi({ example: 21 }),
  })
  .openapi("VatLine");

export const LastInvoiceSchema = z
  .object({
    numSerieFactura: z.string().openapi({ example: "A-0001" }),
    date: z.coerce.date().openapi({ example: "2026-02-01" }),
    fingerprint: z.string().openapi({ example: "ABCDEF0123" }),
  })
  .openapi("LastInvoice");

export const IssueInvoiceRequestSchema = z
  .object({
    id: z.string().openapi({ example: "INV-001" }),
    companyName: z.string().openapi({ example: "Acme SL" }),
    issuerNif: z.string().openapi({ example: "B12345678" }),
    numSerieFactura: z.string().openapi({ example: "A-0002" }),
    date: z.coerce.date().openapi({ example: "2026-02-02" }),
    total: z.number().openapi({ example: 121 }),
    tvat: z.number().openapi({ example: 21 }),
    invoiceType: z.enum(["F1", "F2", "F3", "R1", "R2", "R3", "R4", "R5"]).openapi({
      example: "F1",
    }),
    isSubsanacion: z.boolean().optional().openapi({ example: false }),
    rectificationSubtype: z.enum(["I", "S"]).optional().openapi({ example: "I" }),
    customerNif: z.string().optional().openapi({ example: "12345678Z" }),
    customerName: z.string().optional().openapi({ example: "Cliente Demo" }),
    description: z.string().openapi({ example: "Factura de prueba" }),
    vatLines: z.array(VatLineSchema),
    lastInvoice: LastInvoiceSchema.nullable().optional(),
  })
  .openapi("IssueInvoiceRequest");

export const IssueInvoiceSuccessSchema = z
  .object({
    id: z.string(),
    num: z.string(),
    estadoRegistro: z.string().optional(),
    csv: z.string().optional(),
    tiempoEsperaEnvio: z.number().optional(),
    timestampPresentacion: z.string().optional(),
    fingerprint: z.string(),
  })
  .openapi("IssueInvoiceSuccess");

export const IssueInvoiceErrorSchema = z
  .object({
    id: z.string(),
    num: z.string(),
    codError: z.string(),
    descrError: z.string(),
  })
  .openapi("IssueInvoiceError");

export const IssueInvoiceResponseSchema = z
  .object({
    success: z.array(IssueInvoiceSuccessSchema),
    error: z.array(IssueInvoiceErrorSchema),
  })
  .openapi("IssueInvoiceResponse");
