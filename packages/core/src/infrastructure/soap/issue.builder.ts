import type { IssueInvoiceInput } from "../../domain/models/invoice";
import { formatDate } from "../../utils/date";
import { formatCurrency } from "../../utils/money";
import { conditionalTag, tag } from "../xml/tags";

function buildVatLinesXml(input: IssueInvoiceInput): string {
  return input.vatLines
    .map(
      (line) =>
        `<DetalleDesglose>${tag("Impuesto", "01")}${tag("ClaveRegimen", "01")}${tag("CalificacionOperacion", line.vat === 0 ? "N1" : "S1")}${line.vat > 0 ? tag("TipoImpositivo", line.vat) : ""}${tag("BaseImponibleOimporteNoSujeto", formatCurrency(line.bi))}${line.vat > 0 ? tag("CuotaRepercutida", formatCurrency(line.tvat)) : ""}</DetalleDesglose>`,
    )
    .join("");
}

function buildEncadenamientoXml(input: IssueInvoiceInput): string {
  if (!input.lastInvoice) {
    return `<Encadenamiento>${tag("PrimerRegistro", "S")}</Encadenamiento>`;
  }

  return `<Encadenamiento><RegistroAnterior>${tag("IDEmisorFactura", input.issuerNif)}${tag("NumSerieFactura", input.lastInvoice.numSerieFactura)}${tag("FechaExpedicionFactura", formatDate(input.lastInvoice.date))}${tag("Huella", input.lastInvoice.fingerprint)}</RegistroAnterior></Encadenamiento>`;
}

export function buildIssueRecordXml(
  input: IssueInvoiceInput,
  fingerprint: string,
  timestamp: string,
): string {
  return `<sum:RegFactuSistemaFacturacion><sum:Cabecera><ObligadoEmision>${tag("NombreRazon", input.companyName)}${tag("NIF", input.issuerNif)}</ObligadoEmision></sum:Cabecera><sum:RegistroFactura><RegistroAlta>${tag("IDVersion", "1.0")}<IDFactura>${tag("IDEmisorFactura", input.issuerNif)}${tag("NumSerieFactura", input.numSerieFactura)}${tag("FechaExpedicionFactura", formatDate(input.date))}</IDFactura>${tag("NombreRazonEmisor", input.companyName)}${conditionalTag("Subsanacion", "S", Boolean(input.isSubsanacion))}${conditionalTag("RechazoPrevio", "X", Boolean(input.isSubsanacion))}${tag("TipoFactura", input.invoiceType)}${tag("DescripcionOperacion", input.description)}${input.customerNif ? `<Destinatarios><IDDestinatario>${tag("NombreRazon", input.customerName)}${tag("NIF", input.customerNif)}</IDDestinatario></Destinatarios>` : tag("FacturaSinIdentifDestinatarioArt61d", "S")}<Desglose>${buildVatLinesXml(input)}</Desglose>${tag("CuotaTotal", formatCurrency(input.tvat))}${tag("ImporteTotal", formatCurrency(input.total))}${buildEncadenamientoXml(input)}${tag("FechaHoraHusoGenRegistro", timestamp)}${tag("TipoHuella", "01")}${tag("Huella", fingerprint)}</RegistroAlta></sum:RegistroFactura></sum:RegFactuSistemaFacturacion>`;
}
