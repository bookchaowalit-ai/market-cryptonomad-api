# Nomad Coin

An npm-workspaces monorepo for an ERC-20 token: a genuinely well-architected
upgradeable smart contract, a Next.js wallet-connect frontend, and shared
types/utilities.

## Packages

| Package | Status | What it is |
|---|---|---|
| `packages/contracts` | Real | `NomadCoin.sol` — a UUPS-upgradeable ERC-20 (OpenZeppelin Upgradeable) with role-based minting/pausing, a blacklist, a hard max-supply cap, and custom errors. Compiles cleanly (27 files via Hardhat). |
| `packages/web-app` | Real | Next.js 15 / React 19 + wagmi 2 / viem 2 / RainbowKit 2 wallet-connect UI. Builds and serves cleanly. |
| `packages/shared` | Real | Shared TypeScript types/utils/constants (`viem`-based), typechecks clean. |

Deployment lives in `packages/contracts/scripts/deploy.ts` (root
`npm run deploy:local|deploy:testnet|deploy:mainnet` delegate to it). The
former `packages/deployment` and `packages/testing` stubs, whose scripts
pointed at files that never existed, were removed; tests live next to their
code (`packages/contracts/test`, `packages/*/src/**/*.test.ts`).

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
  (Superseded: `web-app` is now on Next 15.5, React 19, wagmi 2, viem 2,
  RainbowKit 2 and TanStack Query 5; `npm audit --omit=dev` has no high or
  critical findings left, only WalletConnect-tree moderates.)

## Disposition

**Keep as a web3 lab** (recorded 2026-10-15, BOO-253). Not promoted to a
product, not archived.

| Option | Decision | Why |
|---|---|---|
| Keep as lab | **Chosen** | The contract and wallet UI are real and tested, and the repo costs nothing to keep. |
| Promote | Not now | No token deployment, users, legal review or security audit exist; promoting would mean shipping a token. |
| Archive | Not now | CI is green and the contract suite is a useful reference for upgradeable ERC-20 patterns. |

Evidence (2026-10-15):

- `packages/contracts/test/NomadCoin.test.ts` has 19 Hardhat tests covering
  roles, the max-supply cap, pause, blacklist and UUPS upgrade authorization.
- CI on `main` at `895c2f7` passed (solhint, `hardhat test`, shared typecheck/vitest,
  web-app lint/typecheck/vitest):
  <https://github.com/bookchaowalit-ai/market-cryptonomad-api/actions/runs/38288035800>.
- The GitHub repository has no deployments and no homepage, and nothing in
  this repository deploys to a public network automatically.

What the lab label rules out: no mainnet or testnet deployment, token sale or
"live" claim without a new owner decision. That decision would also need a
third-party contract audit.

## Development

```bash
npm install
npm run build      # turbo run build across all packages
npm run dev         # all dev servers in parallel
npm run test         # turbo run test
```

Checks that CI runs (`.github/workflows/ci.yml`):

```bash
cd packages/contracts && npx solhint --max-warnings 0 'contracts/**/*.sol'
cd packages/contracts && npx hardhat test   # NomadCoin unit tests (roles, cap, pause, blacklist, UUPS)
cd packages/shared && npx tsc --noEmit -p . && npx vitest run
cd packages/web-app && npm run lint && npx tsc --noEmit -p . && npx vitest run
```

`hardhat compile` downloads solc 0.8.20 from binaries.soliditylang.org on the first run.

Per-package:
```bash
cd packages/contracts && npx hardhat compile
cd packages/web-app && npm run dev
```
