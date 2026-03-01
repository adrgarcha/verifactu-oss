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
});
