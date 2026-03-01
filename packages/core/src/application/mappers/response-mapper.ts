import type { CancelInvoiceInput } from "../../domain/models/cancellation";
import type { IssueInvoiceInput, IssueInvoiceResult } from "../../domain/models/invoice";
import type { QueryInvoicesResult } from "../../domain/models/query";
import { INTERNAL_ERROR_CODES } from "../../errors/error-codes";
import { parseXml } from "../../infrastructure/xml/parser";

function toArray<T>(value: T | T[] | undefined): T[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function getNested(
  source: Record<string, unknown> | undefined,
  path: string[],
): Record<string, unknown> | undefined {
  return path.reduce<Record<string, unknown> | undefined>((acc, key) => {
    if (!acc || typeof acc !== "object") return undefined;
    const value = acc[key];
    return value && typeof value === "object" ? (value as Record<string, unknown>) : undefined;
  }, source);
}

export function mapIssueOrCancelResponse(
  xmlResponse: string,
  input: IssueInvoiceInput | CancelInvoiceInput,
  fingerprint: string,
): IssueInvoiceResult {
  const parsed = parseXml(xmlResponse);
  if (!parsed) {
    return {
      success: [],
      error: [
        {
          id: input.id,
          num: input.numSerieFactura,
          codError: INTERNAL_ERROR_CODES.XML_PARSE_ERROR,
          descrError: "Failed to parse XML response",
        },
      ],
    };
  }

  const fault = getNested(parsed, ["Envelope", "Body", "Fault"]);
  if (fault) {
    return {
      success: [],
      error: [
        {
          id: input.id,
          num: input.numSerieFactura,
          codError: INTERNAL_ERROR_CODES.CLIENT_ERROR,
          descrError: String(fault.faultstring ?? "SOAP Fault"),
        },
      ],
    };
  }

  const response = getNested(parsed, ["Envelope", "Body", "RespuestaRegFactuSistemaFacturacion"]);
  if (!response) {
    return {
      success: [],
      error: [
        {
          id: input.id,
          num: input.numSerieFactura,
          codError: INTERNAL_ERROR_CODES.INVALID_XML,
          descrError: "Invalid XML response structure",
        },
      ],
    };
  }

  const metadata = {
    csv: typeof response.CSV === "string" ? response.CSV : undefined,
    tiempoEsperaEnvio: response.TiempoEsperaEnvio ? Number(response.TiempoEsperaEnvio) : undefined,
    timestampPresentacion: getNested(response, ["DatosPresentacion"])?.TimestampPresentacion as
      | string
      | undefined,
  };

  return toArray<Record<string, unknown>>(
    response.RespuestaLinea as Record<string, unknown> | Record<string, unknown>[],
  ).reduce<IssueInvoiceResult>(
    (acc, line) => {
      const codigoError = line.CodigoErrorRegistro;
      const hasError =
        codigoError !== undefined && codigoError !== null && String(codigoError) !== "0";

      if (hasError) {
        acc.error.push({
          id: input.id,
          num: String(getNested(line, ["IDFactura"])?.NumSerieFactura ?? input.numSerieFactura),
          codError: String(codigoError),
          descrError: String(line.DescripcionErrorRegistro ?? "Unknown AEAT error"),
        });
      } else {
        acc.success.push({
          id: input.id,
          num: String(getNested(line, ["IDFactura"])?.NumSerieFactura ?? input.numSerieFactura),
          estadoRegistro: line.EstadoRegistro ? String(line.EstadoRegistro) : undefined,
          csv: metadata.csv,
          tiempoEsperaEnvio: metadata.tiempoEsperaEnvio,
          timestampPresentacion: metadata.timestampPresentacion,
          fingerprint,
        });
      }

      return acc;
    },
    { success: [], error: [] } as IssueInvoiceResult,
  );
}

export function mapQueryResponse(xmlResponse: string): QueryInvoicesResult {
  const parsed = parseXml(xmlResponse);
  if (!parsed) {
    return {
      success: false,
      error: {
        code: INTERNAL_ERROR_CODES.XML_PARSE_ERROR,
        message: "Failed to parse XML response",
      },
    };
  }

  const fault = getNested(parsed, ["Envelope", "Body", "Fault"]);
  if (fault) {
    return {
      success: false,
      error: {
        code: INTERNAL_ERROR_CODES.CLIENT_ERROR,
        message: String(fault.faultstring ?? "SOAP Fault"),
      },
    };
  }

  const response = getNested(parsed, [
    "Envelope",
    "Body",
    "RespuestaConsultaFactuSistemaFacturacion",
  ]);
  if (!response) {
    return {
      success: false,
      error: {
        code: INTERNAL_ERROR_CODES.INVALID_XML,
        message: "Invalid XML response structure",
      },
    };
  }

  const invoices = toArray<unknown>(
    response.RegistroRespuestaConsultaFactuSistemaFacturacion as unknown,
  );

  return {
    success: true,
    invoices,
  };
}
