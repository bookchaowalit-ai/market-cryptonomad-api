import { Address } from 'viem';
import { NetworkConfig, TokenInfo, Transaction } from './types';
export declare const addressUtils: {
    /**
     * Validates if a string is a valid Ethereum address
     */
    isValid: (address: string) => address is Address;
    /**
     * Formats an address for display (truncated)
     */
    format: (address: Address, startChars?: number, endChars?: number) => string;
    /**
     * Converts address to checksum format
     */
    toChecksum: (address: string) => Address;
    /**
     * Compares two addresses for equality (case-insensitive)
     */
    isEqual: (address1: string, address2: string) => boolean;
};
export declare const tokenUtils: {
    /**
     * Formats token amount from wei to human-readable format
     */
    formatAmount: (amount: bigint, decimals?: 18) => string;
    /**
     * Parses human-readable amount to wei
     */
    parseAmount: (amount: string, decimals?: 18) => bigint;
    /**
     * Formats token amount with symbol
     */
    formatWithSymbol: (amount: bigint, symbol?: "NOMAD", decimals?: 18) => string;
    /**
     * Validates if amount is valid (positive and not exceeding max supply)
     */
    isValidAmount: (amount: string) => boolean;
    /**
     * Calculates percentage of total supply
     */
    calculatePercentage: (amount: bigint, totalSupply: bigint) => number;
};
export declare const etherUtils: {
    /**
     * Formats wei to ETH
     */
    formatEther: (wei: bigint) => string;
    /**
     * Parses ETH to wei
     */
    parseEther: (ether: string) => bigint;
    /**
     * Formats gas price in Gwei
     */
    formatGwei: (wei: bigint) => string;
    /**
     * Calculates transaction cost
     */
    calculateTxCost: (gasUsed: bigint, gasPrice: bigint) => string;
};
export declare const timeUtils: {
    /**
     * Formats timestamp to human-readable date
     */
    formatDate: (timestamp: number) => string;
    /**
     * Gets relative time (e.g., "2 hours ago")
     */
    getRelativeTime: (timestamp: number) => string;
    /**
     * Converts seconds to human-readable duration
     */
    formatDuration: (seconds: number) => string;
};
export declare const networkUtils: {
    /**
     * Gets network name by chain ID
     */
    getNetworkName: (chainId: number, networks: Record<number, NetworkConfig>) => string;
    /**
     * Checks if network is supported
     */
    isSupported: (chainId: number, networks: Record<number, NetworkConfig>) => boolean;
    /**
     * Gets block explorer URL for transaction
     */
    getTxUrl: (txHash: string, chainId: number, networks: Record<number, NetworkConfig>) => string;
    /**
     * Gets block explorer URL for address
     */
    getAddressUrl: (address: Address, chainId: number, networks: Record<number, NetworkConfig>) => string;
};
export declare const validationUtils: {
    /**
     * Validates transaction data
     */
    validateTransaction: (tx: Partial<Transaction>) => string[];
    /**
     * Validates token info
     */
    validateTokenInfo: (tokenInfo: Partial<TokenInfo>) => string[];
    /**
     * Validates network configuration
     */
    validateNetworkConfig: (config: Partial<NetworkConfig>) => string[];
};
export declare const errorUtils: {
    /**
     * Extracts error message from various error types
     */
    extractMessage: (error: unknown) => string;
    /**
     * Checks if error is a network error
     */
    isNetworkError: (error: unknown) => boolean;
    /**
     * Checks if error is a user rejection
     */
    isUserRejection: (error: unknown) => boolean;
    /**
     * Formats error for user display
     */
    formatForUser: (error: unknown) => string;
};
export declare const delay: (ms: number) => Promise<void>;
export declare const retry: <T>(fn: () => Promise<T>, attempts?: number, delayMs?: number) => Promise<T>;
export declare const debounce: <T extends (...args: any[]) => any>(func: T, wait: number) => ((...args: Parameters<T>) => void);
export declare const throttle: <T extends (...args: any[]) => any>(func: T, limit: number) => ((...args: Parameters<T>) => void);
//# sourceMappingURL=utils.d.ts.map