import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { hasRequiredDocPages, listDocRelativePaths } from "../src/utils/docs-content";

const docsRoot = join(import.meta.dir, "../src/content/docs");

function toRoutePath(page: string): string {
  if (page === "index.mdx") {
    return "/";
  }

  const withoutExt = page.replace(/\.mdx$/, "");
  return `/${withoutExt}/`;
}

function normalizeRoute(route: string): string {
  if (route === "/") {
    return route;
  }

  return route.endsWith("/") ? route : `${route}/`;
}

function extractInternalLinks(content: string): string[] {
  const links: string[] = [];
  const markdownLinkRegex = /\[[^\]]+\]\((\/[^)\s]+)\)/g;

  for (const match of content.matchAll(markdownLinkRegex)) {
    const route = match[1];
    if (!route) continue;
    if (route.startsWith("//")) continue;
    if (route.includes("#")) continue;
    links.push(normalizeRoute(route));
  }

  return links;
}

describe("docs content", () => {
  it("contains required pages", () => {
    const pages = listDocRelativePaths(docsRoot);

    const ok = hasRequiredDocPages(pages, [
      "index.mdx",
      "quickstart.mdx",
      "architecture.mdx",
      "sdk/installation.mdx",
      "api/endpoints.mdx",
    ]);

    expect(ok).toBe(true);
  });

  it("all docs pages have title frontmatter", () => {
    const pages = listDocRelativePaths(docsRoot);

    for (const page of pages) {
      const content = readFileSync(join(docsRoot, page), "utf8");
      expect(content.startsWith("---\ntitle:")).toBe(true);
    }
  });

  it("has enough pages and all main sections populated", () => {
    const pages = listDocRelativePaths(docsRoot);

    expect(pages.length).toBeGreaterThanOrEqual(16);
    expect(pages.some((page) => page.startsWith("sdk/"))).toBe(true);
    expect(pages.some((page) => page.startsWith("api/"))).toBe(true);
    expect(pages.some((page) => page.startsWith("internals/"))).toBe(true);
    expect(pages.some((page) => page.startsWith("troubleshooting/"))).toBe(true);
  });

  it("quickstart includes key run commands and references", () => {
    const quickstart = readFileSync(join(docsRoot, "quickstart.mdx"), "utf8");

    expect(quickstart.includes("bun install")).toBe(true);
    expect(quickstart.includes("bun run api:dev")).toBe(true);
    expect(quickstart.includes("/openapi.json")).toBe(true);
    expect(quickstart.includes("/health")).toBe(true);
  });

  it("all internal markdown links resolve to existing docs routes", () => {
    const pages = listDocRelativePaths(docsRoot);
    const existingRoutes = new Set(pages.map(toRoutePath));

    for (const page of pages) {
      const content = readFileSync(join(docsRoot, page), "utf8");
      const internalLinks = extractInternalLinks(content);

      for (const link of internalLinks) {
        expect(existingRoutes.has(link)).toBe(true);
      }
    }
  });
});
