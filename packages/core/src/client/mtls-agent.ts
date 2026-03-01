import { Agent } from "undici";

import type { CertificateBundle } from "../domain/ports/certificate-provider";

export function createMtlsAgent(bundle: CertificateBundle): Agent {
  return new Agent({
    connect: {
      cert: bundle.cert,
      key: bundle.key,
      ca: bundle.ca,
      rejectUnauthorized: bundle.rejectUnauthorized ?? true,
    },
  });
}
