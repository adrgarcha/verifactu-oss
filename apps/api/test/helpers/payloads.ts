export const issueInvoicePayload = {
  id: "INV-001",
  companyName: "Acme SL",
  issuerNif: "B12345678",
  numSerieFactura: "A-0001",
  date: "2026-02-01",
  total: 121,
  tvat: 21,
  invoiceType: "F1",
  description: "Factura de prueba",
  vatLines: [{ vat: 21, bi: 100, tvat: 21 }],
};

export const cancelInvoicePayload = {
  id: "INV-001",
  companyName: "Acme SL",
  issuerNif: "B12345678",
  numSerieFactura: "A-0001",
  date: "2026-02-01",
  total: 121,
  tvat: 21,
};

export const queryInvoicesPayload = {
  companyName: "Acme SL",
  issuerNif: "B12345678",
  filters: {
    year: 2026,
    month: 2,
  },
};

export const qrPayload = {
  issuerNif: "B12345678",
  numSerieFactura: "A-0001",
  date: "2026-02-01",
  total: 121,
};
