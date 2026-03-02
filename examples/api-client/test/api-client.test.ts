import { describe, expect, it } from "bun:test";

import { createApiClient, runApiClientFlow } from "../src/index";

describe("api-client example", () => {
  it("calls health and qr endpoints", async () => {
    const calls: Array<{ url: string; method: string }> = [];

    const fetchStub = async (url: string, init?: RequestInit) => {
      calls.push({ url, method: init?.method ?? "GET" });

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };

    const client = createApiClient({
      baseUrl: "http://localhost:3000",
      fetch: fetchStub,
    });

    await client.health();
    await client.qr({
      issuerNif: "B12345678",
      numSerieFactura: "A-0001",
      date: "2026-02-01",
      total: 121,
    });

    expect(calls[0]?.url).toBe("http://localhost:3000/health");
    expect(calls[1]?.url).toBe("http://localhost:3000/v1/invoices/qr");
  });

  it("skips issue endpoint when RUN_ISSUE_EXAMPLE is false", async () => {
    const calls: string[] = [];
    const fetchStub = async (url: string) => {
      calls.push(url);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };

    await runApiClientFlow({
      fetch: fetchStub,
      logger: { info: () => undefined, error: () => undefined },
      env: {
        API_BASE_URL: "http://localhost:3000",
        RUN_ISSUE_EXAMPLE: "false",
      },
    });

    expect(calls.some((url) => url.endsWith("/v1/invoices/issue"))).toBe(false);
  });
});
