import { describe, expect, it } from "bun:test";

import { createApp } from "../src/app";

describe("invoices", () => {
  it("exposes OpenAPI json", async () => {
    const app = createApp();
    const response = await app.request("/openapi.json");
    const body = (await response.json()) as {
      info?: { title?: string };
      paths?: Record<string, unknown>;
    };

    expect(response.status).toBe(200);
    expect(body.info?.title).toBe("Verifactu OSS API");
    expect(body.paths?.["/v1/invoices/issue"]).toBeTruthy();
    expect(body.paths?.["/v1/invoices/cancel"]).toBeTruthy();
    expect(body.paths?.["/v1/invoices/query"]).toBeTruthy();
    expect(body.paths?.["/v1/invoices/qr"]).toBeTruthy();
  });
});
