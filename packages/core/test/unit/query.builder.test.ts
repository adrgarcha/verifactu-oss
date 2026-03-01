import { describe, expect, it } from "bun:test";

import { buildQueryXml } from "../../src/infrastructure/soap/query.builder";

describe("query builder", () => {
  it("includes required header and period", () => {
    const xml = buildQueryXml({
      companyName: "Acme SL",
      issuerNif: "B12345678",
      filters: { year: 2026, month: 1 },
    });

    expect(xml.includes("<sum:NIF>B12345678</sum:NIF>")).toBe(true);
    expect(xml.includes("<sum:Ejercicio>2026</sum:Ejercicio>")).toBe(true);
    expect(xml.includes("<sum:Periodo>01</sum:Periodo>")).toBe(true);
  });
});
