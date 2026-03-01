# @verifactu-oss/core

Main TypeScript SDK for AEAT Verifactu integration.

## Quick usage

```ts
import {
  createVerifactuClient,
  FileCertificateProvider,
  issueInvoice,
} from "@verifactu-oss/core";

const client = createVerifactuClient({
  environment: "sandbox",
  certificateProvider: new FileCertificateProvider("./cert.pem", "./cert_key.pem", {
    rejectUnauthorized: false,
  }),
});

const result = await issueInvoice(client, {
  id: "INV-1",
  companyName: "Acme SL",
  issuerNif: "B12345678",
  numSerieFactura: "A-0001",
  date: new Date(),
  total: 121,
  tvat: 21,
  invoiceType: "F1",
  description: "Factura de prueba",
  vatLines: [{ vat: 21, bi: 100, tvat: 21 }],
});

console.log(result);
```
