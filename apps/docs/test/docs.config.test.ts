import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const astroConfigPath = join(import.meta.dir, "../astro.config.mjs");

describe("docs config", () => {
  it("defines expected sidebar sections", () => {
    const config = readFileSync(astroConfigPath, "utf8");

    expect(config.includes('label: "Inicio"')).toBe(true);
    expect(config.includes('label: "Guia"')).toBe(true);
    expect(config.includes('label: "SDK"')).toBe(true);
    expect(config.includes('label: "API"')).toBe(true);
    expect(config.includes('label: "Internals"')).toBe(true);
    expect(config.includes('label: "Troubleshooting"')).toBe(true);
  });

  it("autogenerates sections from expected docs directories", () => {
    const config = readFileSync(astroConfigPath, "utf8");

    expect(config.includes('autogenerate: { directory: "sdk" }')).toBe(true);
    expect(config.includes('autogenerate: { directory: "api" }')).toBe(true);
    expect(config.includes('autogenerate: { directory: "internals" }')).toBe(true);
    expect(config.includes('autogenerate: { directory: "troubleshooting" }')).toBe(true);
  });
});
