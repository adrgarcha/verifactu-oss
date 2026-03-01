import { describe, expect, it } from "bun:test";

import type { IssueInvoiceInput } from "../../src/domain/models/invoice";
import { buildIssueRecordXml } from "../../src/infrastructure/soap/issue.builder";

describe("issue builder", () => {
  it("builds alta XML with issuer and serial", () => {
    const input: IssueInvoiceInput = {
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
    };

    const xml = buildIssueRecordXml(input, "ABC", "2026-01-10T10:00:00.000Z");

    expect(xml.includes("<NIF>B12345678</NIF>")).toBe(true);
    expect(xml.includes("<NumSerieFactura>A-0001</NumSerieFactura>")).toBe(true);
    expect(xml.includes("<TipoFactura>F1</TipoFactura>")).toBe(true);
  });

  it("renders subsanacion and anonymous-destination flags when needed", () => {
    const input: IssueInvoiceInput = {
      id: "2",
      companyName: "Acme SL",
      issuerNif: "B12345678",
      numSerieFactura: "R-0003",
      date: new Date("2026-02-11T00:00:00.000Z"),
      total: 50,
      tvat: 0,
      invoiceType: "R1",
      isSubsanacion: true,
      description: "Rectificativa",
      vatLines: [{ vat: 0, bi: 50, tvat: 0 }],
    };

    const xml = buildIssueRecordXml(input, "DEF", "2026-02-11T10:00:00.000Z");

    expect(xml.includes("<Subsanacion>S</Subsanacion>")).toBe(true);
    expect(xml.includes("<RechazoPrevio>X</RechazoPrevio>")).toBe(true);
    expect(
      xml.includes("<FacturaSinIdentifDestinatarioArt61d>S</FacturaSinIdentifDestinatarioArt61d>"),
    ).toBe(true);
  });
});
