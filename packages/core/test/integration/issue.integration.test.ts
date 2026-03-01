import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { mapIssueOrCancelResponse } from "../../src/application/mappers/response-mapper";
import { createVerifactuClient } from "../../src/client/verifactu-client";
import type { CancelInvoiceInput } from "../../src/domain/models/cancellation";
import type { IssueInvoiceInput } from "../../src/domain/models/invoice";
import { startFixtureServer } from "./_helpers/http-fixture-server";

function readFixture(fileName: string): string {
  return readFileSync(new URL(`../fixtures/soap/${fileName}`, import.meta.url), "utf8");
}

function createIssueInput(overrides: Partial<IssueInvoiceInput> = {}): IssueInvoiceInput {
  return {
    id: "INV-001",
    companyName: "Acme SL",
    issuerNif: "B12345678",
    numSerieFactura: "A-0001",
    date: new Date("2026-02-01T00:00:00.000Z"),
    total: 121,
    tvat: 21,
    invoiceType: "F1",
    description: "Factura de prueba",
    vatLines: [{ vat: 21, bi: 100, tvat: 21 }],
    ...overrides,
  };
}

function createCancelInput(overrides: Partial<CancelInvoiceInput> = {}): CancelInvoiceInput {
  return {
    id: "INV-001",
    companyName: "Acme SL",
    issuerNif: "B12345678",
    numSerieFactura: "A-0001",
    date: new Date("2026-02-01T00:00:00.000Z"),
    total: 121,
    tvat: 21,
    ...overrides,
  };
}

describe("issue integration", () => {
  it("maps success fixture with csv and status", () => {
    const xml = readFixture("issue.success.xml");
    const result = mapIssueOrCancelResponse(xml, createIssueInput(), "FINGERPRINT-001");

    expect(result.success).toHaveLength(1);
    expect(result.success[0]?.csv).toBe("CSV-ISSUE-001");
    expect(result.success[0]?.estadoRegistro).toBe("Correcto");
    expect(result.success[0]?.fingerprint).toBe("FINGERPRINT-001");
    expect(result.error).toHaveLength(0);
  });

  it("maps AEAT validation error fixture as error result", () => {
    const xml = readFixture("issue.error.xml");
    const result = mapIssueOrCancelResponse(xml, createIssueInput(), "FINGERPRINT-001");

    expect(result.success).toHaveLength(0);
    expect(result.error).toHaveLength(1);
    expect(result.error[0]?.codError).toBe("2001");
    expect(result.error[0]?.descrError).toContain("NIF del emisor incorrecto");
  });

  it("maps SOAP fault fixture as client error", () => {
    const xml = readFixture("issue.fault.xml");
    const result = mapIssueOrCancelResponse(xml, createIssueInput(), "FINGERPRINT-001");

    expect(result.success).toHaveLength(0);
    expect(result.error).toHaveLength(1);
    expect(result.error[0]?.codError).toBe("CLIENT_ERROR");
    expect(result.error[0]?.descrError).toContain("Codigo[4001]");
  });

  it("issues invoice end-to-end against local SOAP fixture server", async () => {
    const fixtureServer = await startFixtureServer(readFixture("issue.success.xml"));
    const client = createVerifactuClient({ endpoint: fixtureServer.url, timeoutMs: 5_000 });

    try {
      const result = await client.issueInvoice(createIssueInput());

      expect(result.success).toHaveLength(1);
      expect(result.success[0]?.csv).toBe("CSV-ISSUE-001");
    } finally {
      await fixtureServer.close();
    }
  });

  it("returns server error result on HTTP 500", async () => {
    const fixtureServer = await startFixtureServer("<error/>", 500, "text/xml");
    const client = createVerifactuClient({ endpoint: fixtureServer.url, timeoutMs: 5_000 });

    try {
      const result = await client.issueInvoice(createIssueInput());

      expect(result.success).toHaveLength(0);
      expect(result.error[0]?.codError).toBe("SERVER_ERROR");
    } finally {
      await fixtureServer.close();
    }
  });

  it("cancels invoice end-to-end against local SOAP fixture server", async () => {
    const fixtureServer = await startFixtureServer(readFixture("cancel.success.xml"));
    const client = createVerifactuClient({ endpoint: fixtureServer.url, timeoutMs: 5_000 });

    try {
      const result = await client.cancelInvoice(createCancelInput());

      expect(result.success).toHaveLength(1);
      expect(result.success[0]?.csv).toBe("CSV-CANCEL-001");
      expect(result.error).toHaveLength(0);
    } finally {
      await fixtureServer.close();
    }
  });
});
