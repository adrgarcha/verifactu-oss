import { readdirSync } from "node:fs";
import { join, posix } from "node:path";

function walk(dir: string, prefix = ""): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const rel = prefix ? posix.join(prefix, entry.name) : entry.name;
    const abs = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(abs, rel));
      continue;
    }

    if (entry.isFile() && rel.endsWith(".mdx")) {
      files.push(rel);
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

export function listDocRelativePaths(docsRoot: string): string[] {
  return walk(docsRoot);
}

export function hasRequiredDocPages(pages: string[], requiredPages: string[]): boolean {
  const set = new Set(pages);
  return requiredPages.every((requiredPage) => set.has(requiredPage));
}
