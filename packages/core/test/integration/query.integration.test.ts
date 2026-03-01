import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { mapQueryResponse } from "../../src/application/mappers/response-mapper";
import { createVerifactuClient } from "../../src/client/verifactu-client";
import type { QueryInvoicesInput } from "../../src/domain/models/query";
import { startFixtureServer } from "./_helpers/http-fixture-server";

function readFixture(fileName: string): string {
  return readFileSync(new URL(`../fixtures/soap/${fileName}`, import.meta.url), "utf8");
}

function createQueryInput(overrides: Partial<QueryInvoicesInput> = {}): QueryInvoicesInput {
  return {
    companyName: "Acme SL",
    issuerNif: "B12345678",
    filters: {
      year: 2026,
      month: 2,
    },
    ...overrides,
  };
}

describe("query integration", () => {
  it("maps query success fixture with invoice list", () => {
    const xml = readFixture("query.success.xml");
    const result = mapQueryResponse(xml);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.invoices).toHaveLength(2);
    }
  });

  it("maps query SOAP fault fixture to error", () => {
    const xml = readFixture("query.fault.xml");
    const result = mapQueryResponse(xml);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("CLIENT_ERROR");
      expect(result.error.message).toContain("Codigo[3001]");
    }
  });

  it("queries invoices end-to-end against local SOAP fixture server", async () => {
    const fixtureServer = await startFixtureServer(readFixture("query.success.xml"));
    const client = createVerifactuClient({ endpoint: fixtureServer.url, timeoutMs: 5_000 });

    try {
      const result = await client.queryInvoices(createQueryInput());

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.invoices).toHaveLength(2);
      }
    } finally {
      await fixtureServer.close();
    }
  });

  it("returns server error payload on HTTP 500", async () => {
    const fixtureServer = await startFixtureServer("<error/>", 500, "text/xml");
    const client = createVerifactuClient({ endpoint: fixtureServer.url, timeoutMs: 5_000 });

    try {
      const result = await client.queryInvoices(createQueryInput());

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("SERVER_ERROR");
      }
    } finally {
      await fixtureServer.close();
    }
  });
});
