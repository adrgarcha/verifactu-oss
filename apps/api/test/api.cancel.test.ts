import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { createApp } from "../src/app";
import {
  resetVerifactuClientCacheForTests,
  setVerifactuClientForTests,
} from "../src/config/client";
import { createMockClient } from "./helpers/mock-client";
import { cancelInvoicePayload } from "./helpers/payloads";

describe("POST /v1/invoices/cancel", () => {
  beforeEach(() => {
    resetVerifactuClientCacheForTests();
    setVerifactuClientForTests(createMockClient());
  });

  afterEach(() => {
    resetVerifactuClientCacheForTests();
  });

  it("returns cancel result", async () => {
    const app = createApp();
    const response = await app.request("/v1/invoices/cancel", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(cancelInvoicePayload),
    });
    const body = (await response.json()) as { success: unknown[]; error: unknown[] };

    expect(response.status).toBe(200);
    expect(body.success.length).toBe(1);
    expect(body.error.length).toBe(0);
  });

  it("returns validation error for invalid payload", async () => {
    const app = createApp();
    const response = await app.request("/v1/invoices/cancel", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ id: "INV-001" }),
    });

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
  });
});
