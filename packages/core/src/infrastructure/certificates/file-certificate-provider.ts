import { readFile } from "node:fs/promises";

import type {
  CertificateBundle,
  CertificateProvider,
} from "../../domain/ports/certificate-provider";

export class FileCertificateProvider implements CertificateProvider {
  constructor(
    private readonly certPath: string,
    private readonly keyPath: string,
    private readonly options?: { caPath?: string; rejectUnauthorized?: boolean },
  ) {}

  async getCertificateBundle(): Promise<CertificateBundle> {
    const [cert, key, ca] = await Promise.all([
      readFile(this.certPath, "utf8"),
      readFile(this.keyPath, "utf8"),
      this.options?.caPath ? readFile(this.options.caPath, "utf8") : Promise.resolve(undefined),
    ]);

    return {
      cert,
      key,
      ca,
      rejectUnauthorized: this.options?.rejectUnauthorized,
    };
  }
}
