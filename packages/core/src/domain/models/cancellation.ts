import type { IssueInvoiceResult } from "./invoice";

export type CancelInvoiceInput = {
  id: string;
  companyName: string;
  issuerNif: string;
  numSerieFactura: string;
  date: Date;
  total: number;
  tvat: number;
  lastInvoice?: {
    numSerieFactura: string;
    date: Date;
    fingerprint: string;
  } | null;
};

export type CancelInvoiceResult = IssueInvoiceResult;
