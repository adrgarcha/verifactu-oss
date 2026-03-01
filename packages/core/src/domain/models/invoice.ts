export type VatLine = {
  vat: number;
  bi: number;
  tvat: number;
};

export type InvoiceChainReference = {
  numSerieFactura: string;
  date: Date;
  fingerprint: string;
};

export type ReferencedInvoice = {
  numSerieFactura: string;
  date: Date;
  invoiceType: "F1" | "F2" | "F3" | "R1" | "R2" | "R3" | "R4" | "R5";
};

export type RectificationTotals = {
  biTotal: number;
  tvatTotal: number;
};

export type InvoiceType = "F1" | "F2" | "F3" | "R1" | "R2" | "R3" | "R4" | "R5";

export type RectificationSubtype = "I" | "S";

export type IssueInvoiceInput = {
  id: string;
  companyName: string;
  issuerNif: string;
  numSerieFactura: string;
  date: Date;
  total: number;
  tvat: number;
  invoiceType: InvoiceType;
  isSubsanacion?: boolean;
  rectificationSubtype?: RectificationSubtype;
  customerNif?: string;
  customerName?: string;
  description: string;
  vatLines: VatLine[];
  lastInvoice?: InvoiceChainReference | null;
  referencedInvoices?: ReferencedInvoice[];
  rectificationTotals?: RectificationTotals | null;
};

export type IssueInvoiceSuccess = {
  id: string;
  num: string;
  estadoRegistro?: string;
  csv?: string;
  tiempoEsperaEnvio?: number;
  timestampPresentacion?: string;
  fingerprint: string;
};

export type IssueInvoiceError = {
  id: string;
  num: string;
  codError: string;
  descrError: string;
};

export type IssueInvoiceResult = {
  success: IssueInvoiceSuccess[];
  error: IssueInvoiceError[];
};
