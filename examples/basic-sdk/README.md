# Basic SDK Example

Minimal local example using `@verifactu-oss/core` without calling AEAT.

## What it does

- Creates a Verifactu client.
- Generates a QR payload from invoice data.
- Prints validation URL and QR metadata.

## Run

```bash
bun --cwd examples/basic-sdk run dev
```

Optional env vars (see `.env.example`):

- `VERIFACTU_ENV`
- `ISSUER_NIF`
- `INVOICE_SERIAL`
- `INVOICE_DATE`
- `INVOICE_TOTAL`
