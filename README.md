# Nomad Coin

An npm-workspaces monorepo for an ERC-20 token: a genuinely well-architected
upgradeable smart contract, a Next.js wallet-connect frontend, and scaffolding
for shared types, deployment, and cross-package testing.

## Packages

| Package | Status | What it is |
|---|---|---|
| `packages/contracts` | Real | `NomadCoin.sol` — a UUPS-upgradeable ERC-20 (OpenZeppelin Upgradeable) with role-based minting/pausing, a blacklist, a hard max-supply cap, and custom errors. Compiles cleanly (27 files via Hardhat). |
| `packages/web-app` | Real | Next.js 14 + wagmi/viem/RainbowKit wallet-connect UI. Builds and serves cleanly. |
| `packages/shared` | Real | Shared TypeScript types/utils/constants (`viem`-based), typechecks clean. |
| `packages/testing` | **Stub only** | `src/index.ts` is a single placeholder comment. Real tests live next to their code: `packages/contracts/test` (Hardhat) and `packages/shared/src/*.test.ts` (Vitest). |
| `packages/deployment` | **Stub only** | Same pattern: `src/index.ts` is a placeholder comment, but `package.json` declares `deploy`, `deploy:testnet`, `deploy:mainnet`, `verify`, `setup-roles`, `upgrade` scripts pointing at `dist/deploy.js`, `dist/verify.js`, etc. — files that a build of the current source would never produce. None of these scripts are runnable as the repo stands. |

## Notes from a recent audit pass

- No README existed anywhere in the repo (this file is new).
- A stray root-level `contracts/MyToken.sol` — generic OpenZeppelin-wizard
  boilerplate (`"MyToken"`/`"MTK"`), unrelated to the real `NomadCoin`
  contract — was tracked in git but never compiled or referenced by
  anything; `packages/contracts/hardhat.config.ts` only ever pointed at
  `packages/contracts/contracts`. Removed as dead template smell.
- `packages/web-app` had no ESLint config at all (`next lint` dropped into
  its first-run setup wizard) — added one; it then ran clean.
- `next.config.js` had `experimental.appDir: true`, a config option that's
  been invalid since Next.js 13.4 (App Router became stable and the flag
  was removed) — every build silently warned about it. Removed.
- Verified live: `packages/web-app` builds, serves, and renders real
  content (title, wallet-connect UI) on the production build.
  `packages/contracts` compiles cleanly and `hardhat test` runs (0 tests —
  none exist, consistent with `packages/testing` never having been filled
  in).
- `npm audit`: `web-app` cleared 14 of 39 findings via `npm audit fix`
  (moved `next` to the latest patch within its declared `^14.0.0` range);
  the rest need Next 15/16 or a wagmi v1→v2 major bump, not attempted. At
  the workspace root, `npm audit fix` itself is blocked by a real peer
  dependency conflict (`ethers` v5 vs the `^6.4.0` `hardhat-toolbox@3.0.0`
  wants) — not forced, since `--legacy-peer-deps`/`--force` risks quietly
  breaking the Hardhat toolchain that was just verified working.

## Development

```bash
npm install
npm run build      # turbo run build across all packages
npm run dev         # all dev servers in parallel
npm run test         # turbo run test
```

Checks that CI runs (`.github/workflows/ci.yml`):

```bash
cd packages/contracts && npx hardhat test   # NomadCoin unit tests (roles, cap, pause, blacklist, UUPS)
cd packages/shared && npx tsc --noEmit -p . && npx vitest run
cd packages/web-app && npm run lint && npx tsc --noEmit -p .
```

`hardhat compile` downloads solc 0.8.20 from binaries.soliditylang.org on the first run.

Per-package:
```bash
cd packages/contracts && npx hardhat compile
cd packages/web-app && npm run dev
```
