import type { CancelInvoiceInput } from "../../domain/models/cancellation";
import { formatDate } from "../../utils/date";
import { tag } from "../xml/tags";

export function buildCancelRecordXml(
  input: CancelInvoiceInput,
  fingerprint: string,
  timestamp: string,
): string {
  const chainXml = input.lastInvoice
    ? `<Encadenamiento><RegistroAnterior>${tag("IDEmisorFactura", input.issuerNif)}${tag("NumSerieFactura", input.lastInvoice.numSerieFactura)}${tag("FechaExpedicionFactura", formatDate(input.lastInvoice.date))}${tag("Huella", input.lastInvoice.fingerprint)}</RegistroAnterior></Encadenamiento>`
    : `<Encadenamiento>${tag("PrimerRegistro", "S")}</Encadenamiento>`;

  return `<sum:RegFactuSistemaFacturacion><sum:Cabecera><ObligadoEmision>${tag("NombreRazon", input.companyName)}${tag("NIF", input.issuerNif)}</ObligadoEmision></sum:Cabecera><sum:RegistroFactura><RegistroAnulacion>${tag("IDVersion", "1.0")}<IDFactura>${tag("IDEmisorFactura", input.issuerNif)}${tag("NumSerieFactura", input.numSerieFactura)}${tag("FechaExpedicionFactura", formatDate(input.date))}</IDFactura>${chainXml}${tag("FechaHoraHusoGenRegistro", timestamp)}${tag("TipoHuella", "01")}${tag("Huella", fingerprint)}</RegistroAnulacion></sum:RegistroFactura></sum:RegFactuSistemaFacturacion>`;
}
