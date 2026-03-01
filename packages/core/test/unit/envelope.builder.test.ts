import { describe, expect, it } from "bun:test";

import { buildSoapEnvelope } from "../../src/infrastructure/soap/envelope.builder";

describe("envelope builder", () => {
  it("wraps inner xml in SOAP envelope", () => {
    const xml = buildSoapEnvelope("<sum:Ping>ok</sum:Ping>");

    expect(xml.startsWith("<?xml")).toBe(true);
    expect(xml.includes("<soapenv:Envelope")).toBe(true);
    expect(xml.includes("<sum:Ping>ok</sum:Ping>")).toBe(true);
  });
});
