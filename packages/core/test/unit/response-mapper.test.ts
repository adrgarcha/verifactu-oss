import { describe, expect, it } from "bun:test";

import { mapIssueOrCancelResponse } from "../../src/application/mappers/response-mapper";

describe("response mapper", () => {
  it("maps a successful issue response", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Body>
          <RespuestaRegFactuSistemaFacturacion>
            <CSV>CSV-123</CSV>
            <DatosPresentacion>
              <TimestampPresentacion>2026-01-10T10:00:00+01:00</TimestampPresentacion>
            </DatosPresentacion>
            <RespuestaLinea>
              <IDFactura>
                <NumSerieFactura>A-0001</NumSerieFactura>
              </IDFactura>
              <CodigoErrorRegistro>0</CodigoErrorRegistro>
              <EstadoRegistro>Correcto</EstadoRegistro>
            </RespuestaLinea>
          </RespuestaRegFactuSistemaFacturacion>
        </soapenv:Body>
      </soapenv:Envelope>`;

    const result = mapIssueOrCancelResponse(
      xml,
      {
        id: "1",
        companyName: "Acme SL",
        issuerNif: "B12345678",
        numSerieFactura: "A-0001",
        date: new Date("2026-01-10T00:00:00.000Z"),
        total: 121,
        tvat: 21,
        invoiceType: "F1",
        description: "Factura de prueba",
        vatLines: [{ vat: 21, bi: 100, tvat: 21 }],
      },
      "FINGERPRINT",
    );

    expect(result.success).toHaveLength(1);
    expect(result.success[0]?.csv).toBe("CSV-123");
    expect(result.error).toHaveLength(0);
  });
});
