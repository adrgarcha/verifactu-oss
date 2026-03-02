import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { createApp } from "../src/app";
import {
  resetVerifactuClientCacheForTests,
  setVerifactuClientForTests,
} from "../src/config/client";
import { createMockClient } from "./helpers/mock-client";
import { qrPayload } from "./helpers/payloads";

describe("POST /v1/invoices/qr", () => {
  beforeEach(() => {
    resetVerifactuClientCacheForTests();
    setVerifactuClientForTests(createMockClient());
  });

  afterEach(() => {
    resetVerifactuClientCacheForTests();
  });

  it("returns qr payload", async () => {
    const app = createApp();
    const response = await app.request("/v1/invoices/qr", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(qrPayload),
    });
    const body = (await response.json()) as {
      validationUrl: string;
      base64: string;
      pngBase64: string;
    };

    expect(response.status).toBe(200);
    expect(body.validationUrl).toBe("https://example.test/qr");
    expect(body.base64.startsWith("data:image/png;base64")).toBe(true);
    expect(body.pngBase64).toBeTruthy();
    expect(response.headers.get("x-request-id")).toBeTruthy();
  });

  it("validates request body", async () => {
    const app = createApp();
    const response = await app.request("/v1/invoices/qr", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ ...qrPayload, date: "invalid-date" }),
    });

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
  });
});
