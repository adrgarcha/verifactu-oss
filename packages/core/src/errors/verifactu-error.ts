import type { InternalErrorCode } from "./error-codes";

export class VerifactuError extends Error {
  public override name = "VerifactuError";
  public readonly code: InternalErrorCode;
  public override readonly cause?: unknown;

  constructor(code: InternalErrorCode, message: string, cause?: unknown) {
    super(message);
    this.code = code;
    this.cause = cause;
  }
}
