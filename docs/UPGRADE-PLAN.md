# Upgrade Plan

## Current state

**Score: 6 / 10** (was 4 before pass 1). A clean UUPS ERC-20 with good
access control. Before this pass it had no tests at all, and its deploy
script could not run: `hardhat-upgrades` v1 swapped `hre.ethers` back to
ethers v5 under a v6 toolbox. Contract, shared and web-app checks now run in
CI.

## Backlog

### P0
- Get an external review or audit of `NomadCoin.sol` before any mainnet
  deploy. Decide on purpose whether a blacklisted holder's funds can ever be
  recovered: `_beforeTokenTransfer` blocks burns from blacklisted addresses
  too.
- Add a storage-layout check to CI (`upgrades.validateUpgrade` against the
  previous implementation) once a V2 exists.

### P1
- `packages/deployment` and `packages/testing` are stubs whose scripts point
  at files that do not exist. Implement them or delete the scripts.
- Remove the Remix boilerplate at the repo root (`scripts/*_with_*.ts`,
  `scripts/*-lib.ts`, `tests/MyToken_test.sol`) and the `.states/` VM
  snapshot.
- Stop committing `packages/shared/dist` and the `*.tsbuildinfo` files.
  Build them in CI instead.
- Remaining `npm audit` items need Next 15 and the wagmi v2 majors (see
  README).

### P2
- Add `solhint` to CI (the `lint` script exists; it needs a `.solhint.json`).
- Add Vitest component tests for `TransferForm` (amount validation, address
  checks).

## Done in this pass (pass 1)
- Added 19 Hardhat tests for NomadCoin: init and lock, roles, max-supply
  boundary, burn and allowance, pause, blacklist incl. `transferFrom`, and
  UUPS upgrade authorization.
- Bumped `@openzeppelin/hardhat-upgrades` 1.28 to 2.5.1 (ethers v6
  compatible). `scripts/deploy.ts` now runs end to end, and its BigInt JSON
  serialization crash is fixed. `deploy:testnet` targets Sepolia (Goerli is
  shut down).
- Fixed `addressUtils.toChecksum`, which returned its input unchanged. Added
  shared utils tests (Vitest).
- Added GitHub Actions CI: contract tests, shared typecheck and tests,
  web-app lint and typecheck.
