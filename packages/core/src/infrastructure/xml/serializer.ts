export function toXmlDocument(body: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>${body}`;
}
