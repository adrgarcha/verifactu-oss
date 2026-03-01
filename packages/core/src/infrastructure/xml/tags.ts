function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function tag(name: string, content: unknown): string {
  if (content === null || content === undefined || content === "") {
    return "";
  }

  return `<${name}>${escapeXml(String(content))}</${name}>`;
}

export function conditionalTag(name: string, content: unknown, condition: boolean): string {
  return condition ? tag(name, content) : "";
}
