# Contributing

Thanks for contributing to Verifactu OSS.

## Local setup

```bash
bun install
bun run check:ci
```

## Development flow

1. Create a branch from `main`.
2. Implement changes in the right workspace (`packages/core`, `apps/api`, `apps/docs`, `examples`).
3. Run quality checks before opening PR:

```bash
bun run check
bun run typecheck
bun run test
bun run build
```

## Changesets

If your PR changes behavior or public API of `@verifactu-oss/core`, add a changeset:

```bash
bun run changeset
```

Use:

- `patch` for bug fixes
- `minor` for backward-compatible features
- `major` for breaking changes

## Release flow

1. Merge PRs into `main`.
2. Changesets Action creates/updates a release PR.
3. Merge release PR to publish to npm.
