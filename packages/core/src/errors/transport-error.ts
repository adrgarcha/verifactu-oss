import { INTERNAL_ERROR_CODES } from "./error-codes";
import { VerifactuError } from "./verifactu-error";

export class TransportError extends VerifactuError {
  constructor(message: string, cause?: unknown) {
    super(INTERNAL_ERROR_CODES.TRANSPORT_ERROR, message, cause);
    this.name = "TransportError";
  }
}
