import { describe, expect, it } from "bun:test";

import { buildBasicSdkInputFromEnv, runBasicSdkFlow } from "../src/index";

describe("basic-sdk example", () => {
  it("builds input using default env values", () => {
    const input = buildBasicSdkInputFromEnv({});

    expect(input.environment).toBe("sandbox");
    expect(input.qrInput.issuerNif).toBe("B12345678");
    expect(input.qrInput.numSerieFactura).toBe("A-0001");
    expect(input.qrInput.total).toBe(121);
  });

  it("runs flow and returns QR metadata", async () => {
    const result = await runBasicSdkFlow(
      {
        createClient: () => ({ id: "client" }),
        generateQr: async () => ({
          validationUrl: "https://example.test/qr",
          base64: "data:image/png;base64,abc",
          png: Buffer.from("abc"),
        }),
        logger: {
          info: () => undefined,
        },
      },
      {},
    );

    expect(result.validationUrl).toBe("https://example.test/qr");
    expect(result.png.byteLength).toBe(3);
  });
});
