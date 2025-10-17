import { Address } from 'viem';
import { NetworkConfig, ContractAddresses } from './types';

// Network configurations
export const NETWORK_CONFIGS: Record<number, NetworkConfig> = {
  // Mainnet
  1: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  // Goerli Testnet
  5: {
    chainId: 5,
    name: 'Goerli Testnet',
    rpcUrl: 'https://eth-goerli.g.alchemy.com/v2/your-api-key',
    blockExplorer: 'https://goerli.etherscan.io',
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  // Sepolia Testnet
  11155111: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/your-api-key',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  // Local development
  31337: {
    chainId: 31337,
    name: 'Hardhat Local',
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorer: 'http://localhost:8545',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

// Contract addresses per network (will be populated after deployment)
export const CONTRACT_ADDRESSES: Record<number, Partial<ContractAddresses>> = {
  1: {
    // Mainnet addresses - to be filled after deployment
  },
  5: {
    // Goerli addresses - to be filled after deployment
  },
  11155111: {
    // Sepolia addresses - to be filled after deployment
  },
  31337: {
    // Local addresses - to be filled after deployment
  },
};

// Token constants
export const TOKEN_CONSTANTS = {
  NAME: 'Nomad Coin',
  SYMBOL: 'NOMAD',
  DECIMALS: 18,
  MAX_SUPPLY: BigInt('1000000000000000000000000000'), // 1 billion tokens with 18 decimals
  INITIAL_SUPPLY: BigInt('0'), // Start with 0 supply, mint as needed
} as const;

// Role constants (keccak256 hashes)
export const ROLES = {
  DEFAULT_ADMIN_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000',
  MINTER_ROLE: '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6',
  PAUSER_ROLE: '0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a',
  UPGRADER_ROLE: '0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3',
} as const;

// Gas limits for different operations
export const GAS_LIMITS = {
  TRANSFER: 65000n,
  APPROVE: 50000n,
  MINT: 70000n,
  BURN: 60000n,
  PAUSE: 45000n,
  UNPAUSE: 45000n,
  UPGRADE: 200000n,
} as const;

// Transaction confirmation requirements
export const CONFIRMATION_BLOCKS = {
  1: 12, // Mainnet
  5: 6,  // Goerli
  11155111: 6, // Sepolia
  31337: 1, // Local
} as const;

// API endpoints and configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Wallet not connected',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  INVALID_ADDRESS: 'Invalid address format',
  INVALID_AMOUNT: 'Invalid amount',
  TRANSACTION_FAILED: 'Transaction failed',
  NETWORK_ERROR: 'Network error occurred',
  CONTRACT_ERROR: 'Contract interaction failed',
  UNAUTHORIZED: 'Unauthorized operation',
  PAUSED: 'Contract is paused',
  EXCEEDS_MAX_SUPPLY: 'Exceeds maximum supply',
} as const;

// Event signatures for filtering
export const EVENT_SIGNATURES = {
  TRANSFER: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  APPROVAL: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
  ROLE_GRANTED: '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
  ROLE_REVOKED: '0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b',
  PAUSED: '0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258',
  UNPAUSED: '0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa',
} as const;

// Supported wallets
export const SUPPORTED_WALLETS = [
  'MetaMask',
  'WalletConnect',
  'Coinbase Wallet',
  'Injected',
] as const;

// Default pagination
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;