import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { createApp } from "../src/app";
import {
  resetVerifactuClientCacheForTests,
  setVerifactuClientForTests,
} from "../src/config/client";
import { createMockClient } from "./helpers/mock-client";
import { queryInvoicesPayload } from "./helpers/payloads";

describe("POST /v1/invoices/query", () => {
  beforeEach(() => {
    resetVerifactuClientCacheForTests();
  });

  afterEach(() => {
    resetVerifactuClientCacheForTests();
  });

  it("returns 200 on successful query", async () => {
    setVerifactuClientForTests(
      createMockClient({
        queryInvoices: async () => ({ success: true, invoices: [{ id: "A-0001" }] }),
      }),
    );

    const app = createApp();
    const response = await app.request("/v1/invoices/query", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(queryInvoicesPayload),
    });
    const body = (await response.json()) as { success: boolean; invoices: unknown[] };

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.invoices.length).toBe(1);
  });

  it("returns 502 on upstream-style failure payload", async () => {
    setVerifactuClientForTests(
      createMockClient({
        queryInvoices: async () => ({
          success: false,
          error: { code: "SERVER_ERROR", message: "failed" },
        }),
      }),
    );

    const app = createApp();
    const response = await app.request("/v1/invoices/query", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(queryInvoicesPayload),
    });
    const body = (await response.json()) as {
      success: boolean;
      error: { code: string; message: string };
    };

    expect(response.status).toBe(502);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("SERVER_ERROR");
  });
});
