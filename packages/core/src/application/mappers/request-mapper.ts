import type { CancelInvoiceInput } from "../../domain/models/cancellation";
import type { IssueInvoiceInput } from "../../domain/models/invoice";
import { formatDate, formatDateTime } from "../../utils/date";
import { toSha256UpperHex } from "../../utils/hash";
import { formatCurrency } from "../../utils/money";

function buildChainPayload(
  base: {
    issuerNif: string;
    numSerieFactura: string;
    date: Date;
    total: number;
    lastFingerprint?: string;
  },
  timestamp: string,
  eventType: "ALTA" | "ANULACION",
): string {
  return [
    `Issuer=${base.issuerNif}`,
    `Serie=${base.numSerieFactura}`,
    `Date=${formatDate(base.date)}`,
    `Total=${formatCurrency(base.total)}`,
    `Prev=${base.lastFingerprint ?? ""}`,
    `Timestamp=${timestamp}`,
    `Type=${eventType}`,
  ].join("&");
}

export function createIssueFingerprint(
  input: IssueInvoiceInput,
  now: Date,
): { fingerprint: string; timestamp: string } {
  const timestamp = formatDateTime(now);
  const chain = buildChainPayload(
    {
      issuerNif: input.issuerNif,
      numSerieFactura: input.numSerieFactura,
      date: input.date,
      total: input.total,
      lastFingerprint: input.lastInvoice?.fingerprint,
    },
    timestamp,
    "ALTA",
  );

  return {
    fingerprint: toSha256UpperHex(chain),
    timestamp,
  };
}

export function createCancelFingerprint(
  input: CancelInvoiceInput,
  now: Date,
): { fingerprint: string; timestamp: string } {
  const timestamp = formatDateTime(now);
  const chain = buildChainPayload(
    {
      issuerNif: input.issuerNif,
      numSerieFactura: input.numSerieFactura,
      date: input.date,
      total: input.total,
      lastFingerprint: input.lastInvoice?.fingerprint,
    },
    timestamp,
    "ANULACION",
  );

  return {
    fingerprint: toSha256UpperHex(chain),
    timestamp,
  };
}
