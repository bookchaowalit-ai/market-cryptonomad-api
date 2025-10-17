import { NetworkConfig, ContractAddresses } from './types';
export declare const NETWORK_CONFIGS: Record<number, NetworkConfig>;
export declare const CONTRACT_ADDRESSES: Record<number, Partial<ContractAddresses>>;
export declare const TOKEN_CONSTANTS: {
    readonly NAME: "Nomad Coin";
    readonly SYMBOL: "NOMAD";
    readonly DECIMALS: 18;
    readonly MAX_SUPPLY: bigint;
    readonly INITIAL_SUPPLY: bigint;
};
export declare const ROLES: {
    readonly DEFAULT_ADMIN_ROLE: "0x0000000000000000000000000000000000000000000000000000000000000000";
    readonly MINTER_ROLE: "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
    readonly PAUSER_ROLE: "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a";
    readonly UPGRADER_ROLE: "0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3";
};
export declare const GAS_LIMITS: {
    readonly TRANSFER: 65000n;
    readonly APPROVE: 50000n;
    readonly MINT: 70000n;
    readonly BURN: 60000n;
    readonly PAUSE: 45000n;
    readonly UNPAUSE: 45000n;
    readonly UPGRADE: 200000n;
};
export declare const CONFIRMATION_BLOCKS: {
    readonly 1: 12;
    readonly 5: 6;
    readonly 11155111: 6;
    readonly 31337: 1;
};
export declare const API_CONFIG: {
    readonly TIMEOUT: 30000;
    readonly RETRY_ATTEMPTS: 3;
    readonly RETRY_DELAY: 1000;
};
export declare const ERROR_MESSAGES: {
    readonly WALLET_NOT_CONNECTED: "Wallet not connected";
    readonly INSUFFICIENT_BALANCE: "Insufficient balance";
    readonly INVALID_ADDRESS: "Invalid address format";
    readonly INVALID_AMOUNT: "Invalid amount";
    readonly TRANSACTION_FAILED: "Transaction failed";
    readonly NETWORK_ERROR: "Network error occurred";
    readonly CONTRACT_ERROR: "Contract interaction failed";
    readonly UNAUTHORIZED: "Unauthorized operation";
    readonly PAUSED: "Contract is paused";
    readonly EXCEEDS_MAX_SUPPLY: "Exceeds maximum supply";
};
export declare const EVENT_SIGNATURES: {
    readonly TRANSFER: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
    readonly APPROVAL: "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925";
    readonly ROLE_GRANTED: "0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d";
    readonly ROLE_REVOKED: "0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b";
    readonly PAUSED: "0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258";
    readonly UNPAUSED: "0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa";
};
export declare const SUPPORTED_WALLETS: readonly ["MetaMask", "WalletConnect", "Coinbase Wallet", "Injected"];
export declare const PAGINATION_DEFAULTS: {
    readonly PAGE_SIZE: 20;
    readonly MAX_PAGE_SIZE: 100;
};
//# sourceMappingURL=constants.d.ts.map