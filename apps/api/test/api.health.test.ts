import { describe, expect, it } from "bun:test";

import { createApp } from "../src/app";

describe("health", () => {
  it("returns status and request id", async () => {
    const app = createApp();
    const response = await app.request("/health");
    const body = (await response.json()) as { ok: boolean; requestId: string };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(typeof body.requestId).toBe("string");
    expect(response.headers.get("x-request-id")).toBeTruthy();
  });

  it("returns json 404 payload for unknown route", async () => {
    const app = createApp();
    const response = await app.request("/missing-route");
    const body = (await response.json()) as {
      error: string;
      path: string;
      requestId: string;
    };

    expect(response.status).toBe(404);
    expect(body.error).toBe("Not Found");
    expect(body.path).toBe("/missing-route");
    expect(typeof body.requestId).toBe("string");
    expect(response.headers.get("x-request-id")).toBeTruthy();
  });

  it("reuses incoming x-request-id header", async () => {
    const app = createApp();
    const response = await app.request("/health", {
      headers: {
        "x-request-id": "req-from-client",
      },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("x-request-id")).toBe("req-from-client");
  });
});
