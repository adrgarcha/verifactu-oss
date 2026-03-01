import type { VerifactuClient } from "../../client/verifactu-client";
import type { CancelInvoiceInput, CancelInvoiceResult } from "../../domain/models/cancellation";

export async function cancelInvoice(
  client: VerifactuClient,
  input: CancelInvoiceInput,
): Promise<CancelInvoiceResult> {
  return client.cancelInvoice(input);
}
