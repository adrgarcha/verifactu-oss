import { z } from "@hono/zod-openapi";

export const QueryInvoicesFiltersSchema = z
  .object({
    year: z.number().int().optional().openapi({ example: 2026 }),
    month: z.number().int().min(1).max(12).optional().openapi({ example: 2 }),
    serialNumber: z.string().optional(),
    registeredName: z.string().optional(),
    nif: z.string().optional(),
    issueDate: z.coerce.date().optional(),
    issueDateSince: z.coerce.date().optional(),
    issueDateUntil: z.coerce.date().optional(),
  })
  .openapi("QueryInvoicesFilters");

export const QueryInvoicesRequestSchema = z
  .object({
    companyName: z.string().openapi({ example: "Acme SL" }),
    issuerNif: z.string().openapi({ example: "B12345678" }),
    filters: QueryInvoicesFiltersSchema.optional(),
  })
  .openapi("QueryInvoicesRequest");

export const QueryInvoicesSuccessSchema = z
  .object({
    success: z.literal(true),
    invoices: z.array(z.unknown()),
  })
  .openapi("QueryInvoicesSuccess");

export const QueryInvoicesErrorSchema = z
  .object({
    success: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string(),
    }),
  })
  .openapi("QueryInvoicesError");
