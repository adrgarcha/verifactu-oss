# API Client Example

Example client that consumes the Hono wrapper (`apps/api`).

## Prerequisites

1. Start API:

```bash
bun --cwd apps/api run dev
```

2. Run example:

```bash
bun --cwd examples/api-client run dev
```

## What it calls

- `GET /health`
- `POST /v1/invoices/qr`
- Optional: `POST /v1/invoices/issue` if `RUN_ISSUE_EXAMPLE=true`

Configurable values in `.env.example`.
