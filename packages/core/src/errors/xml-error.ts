import { INTERNAL_ERROR_CODES } from "./error-codes";
import { VerifactuError } from "./verifactu-error";

export class XmlError extends VerifactuError {
  constructor(message: string, cause?: unknown) {
    super(INTERNAL_ERROR_CODES.XML_PARSE_ERROR, message, cause);
    this.name = "XmlError";
  }
}
