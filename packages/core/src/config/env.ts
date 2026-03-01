export type VerifactuEnvironment = "sandbox" | "production";

export function resolveEnvironment(environment?: string): VerifactuEnvironment {
  if (environment === "production") {
    return "production";
  }

  return "sandbox";
}
