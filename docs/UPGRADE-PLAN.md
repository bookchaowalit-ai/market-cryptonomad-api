# Upgrade Plan

## Current state

**Score: 7 / 10** (6 after pass 1, 4 before). Repo is now free of
template/stub packages and committed build output, solhint runs clean in
CI, and the transfer form validates input exactly (bigint base units). A clean UUPS ERC-20 with good
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
- Wire `TransferForm`/`TokenBalance` to the real contract (wagmi
  `useContractWrite`/`useContractRead` with the ABI from Hardhat
  artifacts); pass the on-chain balance into `validateTransfer`.
- Remaining `npm audit` items need Next 15 and the wagmi v2 majors (see
  README).

### P2
- Component test for `TransferForm` rendering (needs jsdom +
  `@testing-library/react` config); the validation logic is covered.
- Document the offline compile path: `hardhat compile` needs
  binaries.soliditylang.org; behind a restricted proxy, a local-only
  config overriding `TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD` with npm
  `solc@0.8.20` (soljson.js) works.

## Done in this pass (pass 2)
- Removed Remix boilerplate (`scripts/`, `tests/MyToken_test.sol`), the
  `.states/` VM snapshot, and the stub `packages/deployment` and
  `packages/testing` (lockfile updated). Root `deploy:*` scripts now call
  the contracts workspace; dropped contracts' `verify` script (no file).
- Untracked `packages/shared/dist` and `*.tsbuildinfo`; `.gitignore`
  covers them. Web-app and shared typecheck without them.
- `.solhint.json` (solhint:recommended); NomadCoin uses named imports and
  lints with 0 warnings; CI runs `solhint --max-warnings 0`.
- `web-app/src/lib/transfer.ts`: `validateTransfer` (address + EIP-55
  checksum, zero/self address, exact decimal parsing to 18-decimal base
  units, balance cap). 16 Vitest tests; CI runs them. `TransferForm` uses
  it with accessible inline errors (`aria-invalid`, `role="alert"`) and a
  text/decimal input instead of `type=number step=0.0001`.
- Verified: 19 Hardhat tests (compiled offline via npm solcjs 0.8.20),
  shared 8 tests, web-app lint/typecheck/16 tests, solhint clean.

## Done in pass 1
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
