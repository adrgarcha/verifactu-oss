export type QueryInvoicesFilters = {
  year?: number;
  month?: number;
  serialNumber?: string;
  registeredName?: string;
  nif?: string;
  issueDate?: Date;
  issueDateSince?: Date;
  issueDateUntil?: Date;
};

export type QueryInvoicesInput = {
  companyName: string;
  issuerNif: string;
  filters?: QueryInvoicesFilters;
};

export type QueryInvoicesError = {
  code: string;
  message: string;
};

export type QueryInvoicesResult =
  | {
      success: true;
      invoices: unknown[];
    }
  | {
      success: false;
      error: QueryInvoicesError;
    };
