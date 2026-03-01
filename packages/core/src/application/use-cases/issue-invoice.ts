import type { VerifactuClient } from "../../client/verifactu-client";
import type { IssueInvoiceInput, IssueInvoiceResult } from "../../domain/models/invoice";

export async function issueInvoice(
  client: VerifactuClient,
  input: IssueInvoiceInput,
): Promise<IssueInvoiceResult> {
  return client.issueInvoice(input);
}
