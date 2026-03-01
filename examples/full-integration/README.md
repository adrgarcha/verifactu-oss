# Full Integration Example

End-to-end example combining SDK and API wrapper.

## Flow

1. SDK flow: generates QR directly from `@verifactu-oss/core`.
2. API flow: calls `POST /v1/invoices/qr` on `apps/api`.
3. Optional SDK remote query with `RUN_REMOTE_QUERY=true`.

## Run

```bash
bun --cwd apps/api run dev
bun --cwd examples/full-integration run dev
```

Configurable values in `.env.example`.
