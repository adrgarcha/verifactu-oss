import type { VerifactuClient } from "../../client/verifactu-client";
import type { QueryInvoicesInput, QueryInvoicesResult } from "../../domain/models/query";

export async function queryInvoices(
  client: VerifactuClient,
  input: QueryInvoicesInput,
): Promise<QueryInvoicesResult> {
  return client.queryInvoices(input);
}
