import type { QueryInvoicesInput } from "../../domain/models/query";
import { formatDate } from "../../utils/date";
import { tag } from "../xml/tags";

function normalizeYear(year?: number): number {
  const current = new Date().getFullYear();
  return Math.max(2025, Math.min(2200, year ?? current));
}

function normalizeMonth(month?: number): string {
  const current = new Date().getMonth() + 1;
  return String(Math.max(1, Math.min(12, month ?? current))).padStart(2, "0");
}

export function buildQueryXml(input: QueryInvoicesInput): string {
  const filters = input.filters ?? {};
  const year = normalizeYear(filters.year);
  const month = normalizeMonth(filters.month);
  const contraparte =
    filters.registeredName || filters.nif
      ? `<con:Contraparte>${tag("sum:NombreRazon", filters.registeredName)}${tag("sum:NIF", filters.nif)}</con:Contraparte>`
      : "";
  const rango =
    filters.issueDateSince || filters.issueDateUntil
      ? `<con:RangoFechaExpedicion>${tag("con:Desde", filters.issueDateSince ? formatDate(filters.issueDateSince) : "")}${tag("con:Hasta", filters.issueDateUntil ? formatDate(filters.issueDateUntil) : "")}</con:RangoFechaExpedicion>`
      : "";

  return `<con:ConsultaFactuSistemaFacturacion><con:Cabecera>${tag("sum:IDVersion", "1.0")}<sum:ObligadoEmision>${tag("sum:NombreRazon", input.companyName)}${tag("sum:NIF", input.issuerNif)}</sum:ObligadoEmision></con:Cabecera><con:FiltroConsulta><con:PeriodoImputacion>${tag("sum:Ejercicio", year)}${tag("sum:Periodo", month)}</con:PeriodoImputacion>${tag("con:NumSerieFactura", filters.serialNumber)}${contraparte}${tag("con:FechaExpedicionFactura", filters.issueDate ? formatDate(filters.issueDate) : "")}${rango}</con:FiltroConsulta></con:ConsultaFactuSistemaFacturacion>`;
}
