# Verifactu OSS

Open-source TypeScript toolkit to simplify integration with AEAT Verifactu.

## Monorepo (target)

- `packages/core`: reusable SDK (main product)
- `apps/api`: Hono HTTP wrapper over the SDK
- `apps/docs`: Astro + Starlight documentation site
- `examples`: runnable integration examples

## Tooling

- Runtime and package manager: Bun
- Workspace orchestration and caching: Turborepo
- Versioning and releases: Changesets
- Lint + format: Biome

## Package names

- SDK: `@verifactu-oss/core`
- API app: `@verifactu-oss/api`
- Docs app: `@verifactu-oss/docs`

## Conventions

- TypeScript-first in every workspace.
- Public API exposed from each workspace `src/index.ts`.
- Domain logic in `packages/core`; `apps/api` only adapts HTTP to core use cases.
- No ESLint or Prettier. Formatting and linting are managed only by Biome.

## Root scripts

- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`
- `bun run lint`
- `bun run format`
- `bun run check`
- `bun run changeset`
- `bun run version-packages`
- `bun run release`

## CI and release

- CI workflow validates `check + typecheck + test + build` on PRs and `main`.
- Release workflow uses Changesets to open/update release PRs and publish on merge.

### Maintainer checklist

1. Ensure PR includes tests and docs updates when needed.
2. Ensure a changeset exists for `@verifactu-oss/core` when behavior changes.
3. Merge PR into `main`.
4. Merge the generated release PR to publish.

See `CONTRIBUTING.md` for full contribution and release flow.
