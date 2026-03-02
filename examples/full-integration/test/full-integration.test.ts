import { describe, expect, it } from "bun:test";

import { runFullIntegrationFlow } from "../src/index";

describe("full-integration example", () => {
  it("runs sdk and api qr flows", async () => {
    let sdkQrCalls = 0;
    const apiCalls: string[] = [];

    await runFullIntegrationFlow({
      core: {
        createClient: () => ({ id: "client" }),
        generateQr: async () => {
          sdkQrCalls += 1;
          return {
            validationUrl: "https://example.test/qr",
            base64: "data:image/png;base64,abc",
            png: Buffer.from("abc"),
          };
        },
        queryInvoices: async () => ({ success: true, invoices: [] }),
      },
      fetch: async (url: string) => {
        apiCalls.push(url);
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
      logger: { info: () => undefined, error: () => undefined },
      env: {
        API_BASE_URL: "http://localhost:3000",
        RUN_REMOTE_QUERY: "false",
      },
    });

    expect(sdkQrCalls).toBe(1);
    expect(apiCalls.some((url) => url.endsWith("/v1/invoices/qr"))).toBe(true);
  });
});
