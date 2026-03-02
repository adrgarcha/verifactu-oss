import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { createApp } from "../src/app";
import {
  resetVerifactuClientCacheForTests,
  setVerifactuClientForTests,
} from "../src/config/client";
import { createMockClient } from "./helpers/mock-client";
import { issueInvoicePayload } from "./helpers/payloads";

describe("POST /v1/invoices/issue", () => {
  beforeEach(() => {
    resetVerifactuClientCacheForTests();
  });

  afterEach(() => {
    resetVerifactuClientCacheForTests();
  });

  it("returns issue result", async () => {
    setVerifactuClientForTests(createMockClient());

    const app = createApp();
    const response = await app.request("/v1/invoices/issue", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(issueInvoicePayload),
    });
    const body = (await response.json()) as { success: unknown[]; error: unknown[] };

    expect(response.status).toBe(200);
    expect(body.success.length).toBe(1);
    expect(body.error.length).toBe(0);
    expect(response.headers.get("x-request-id")).toBeTruthy();
  });

  it("returns validation error for invalid payload", async () => {
    setVerifactuClientForTests(createMockClient());

    const app = createApp();
    const response = await app.request("/v1/invoices/issue", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ id: "INV-001" }),
    });

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
  });

  it("returns 500 when client throws", async () => {
    setVerifactuClientForTests(
      createMockClient({
        issueInvoice: async () => {
          throw new Error("boom");
        },
      }),
    );

    const app = createApp();
    const response = await app.request("/v1/invoices/issue", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(issueInvoicePayload),
    });
    const body = (await response.json()) as { error: string; requestId: string };

    expect(response.status).toBe(500);
    expect(body.error).toBe("Internal Server Error");
    expect(typeof body.requestId).toBe("string");
    expect(response.headers.get("x-request-id")).toBeTruthy();
  });
});
