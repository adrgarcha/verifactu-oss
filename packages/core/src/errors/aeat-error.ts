import { INTERNAL_ERROR_CODES } from "./error-codes";
import { VerifactuError } from "./verifactu-error";

export class AeatError extends VerifactuError {
  constructor(message: string, cause?: unknown) {
    super(INTERNAL_ERROR_CODES.CLIENT_ERROR, message, cause);
    this.name = "AeatError";
  }
}
