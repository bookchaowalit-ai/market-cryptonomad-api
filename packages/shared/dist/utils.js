import { getAddress, isAddress, formatEther, parseEther, formatUnits, parseUnits } from 'viem';
import { TOKEN_CONSTANTS, ERROR_MESSAGES } from './constants';
// Address validation and formatting utilities
export const addressUtils = {
    /**
     * Validates if a string is a valid Ethereum address
     */
    isValid: (address) => {
        return isAddress(address);
    },
    /**
     * Formats an address for display (truncated)
     */
    format: (address, startChars = 6, endChars = 4) => {
        if (!address)
            return '';
        return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
    },
    /**
     * Converts address to checksum format
     */
    toChecksum: (address) => {
        if (!isAddress(address)) {
            throw new Error(ERROR_MESSAGES.INVALID_ADDRESS);
        }
        return getAddress(address);
    },
    /**
     * Compares two addresses for equality (case-insensitive)
     */
    isEqual: (address1, address2) => {
        return address1.toLowerCase() === address2.toLowerCase();
    },
};
// Token amount formatting utilities
export const tokenUtils = {
    /**
     * Formats token amount from wei to human-readable format
     */
    formatAmount: (amount, decimals = TOKEN_CONSTANTS.DECIMALS) => {
        return formatUnits(amount, decimals);
    },
    /**
     * Parses human-readable amount to wei
     */
    parseAmount: (amount, decimals = TOKEN_CONSTANTS.DECIMALS) => {
        return parseUnits(amount, decimals);
    },
    /**
     * Formats token amount with symbol
     */
    formatWithSymbol: (amount, symbol = TOKEN_CONSTANTS.SYMBOL, decimals = TOKEN_CONSTANTS.DECIMALS) => {
        const formatted = formatUnits(amount, decimals);
        return `${formatted} ${symbol}`;
    },
    /**
     * Validates if amount is valid (positive and not exceeding max supply)
     */
    isValidAmount: (amount) => {
        try {
            const parsed = parseUnits(amount, TOKEN_CONSTANTS.DECIMALS);
            return parsed > 0n && parsed <= TOKEN_CONSTANTS.MAX_SUPPLY;
        }
        catch {
            return false;
        }
    },
    /**
     * Calculates percentage of total supply
     */
    calculatePercentage: (amount, totalSupply) => {
        if (totalSupply === 0n)
            return 0;
        return Number((amount * 10000n) / totalSupply) / 100; // 2 decimal places
    },
};
// Ether utilities (for gas calculations)
export const etherUtils = {
    /**
     * Formats wei to ETH
     */
    formatEther: (wei) => {
        return formatEther(wei);
    },
    /**
     * Parses ETH to wei
     */
    parseEther: (ether) => {
        return parseEther(ether);
    },
    /**
     * Formats gas price in Gwei
     */
    formatGwei: (wei) => {
        return formatUnits(wei, 9);
    },
    /**
     * Calculates transaction cost
     */
    calculateTxCost: (gasUsed, gasPrice) => {
        const cost = gasUsed * gasPrice;
        return formatEther(cost);
    },
};
// Time utilities
export const timeUtils = {
    /**
     * Formats timestamp to human-readable date
     */
    formatDate: (timestamp) => {
        return new Date(timestamp * 1000).toLocaleString();
    },
    /**
     * Gets relative time (e.g., "2 hours ago")
     */
    getRelativeTime: (timestamp) => {
        const now = Date.now();
        const diff = now - timestamp * 1000;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0)
            return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0)
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0)
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    },
    /**
     * Converts seconds to human-readable duration
     */
    formatDuration: (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0)
            return `${hours}h ${minutes}m ${secs}s`;
        if (minutes > 0)
            return `${minutes}m ${secs}s`;
        return `${secs}s`;
    },
};
// Network utilities
export const networkUtils = {
    /**
     * Gets network name by chain ID
     */
    getNetworkName: (chainId, networks) => {
        return networks[chainId]?.name || `Unknown Network (${chainId})`;
    },
    /**
     * Checks if network is supported
     */
    isSupported: (chainId, networks) => {
        return chainId in networks;
    },
    /**
     * Gets block explorer URL for transaction
     */
    getTxUrl: (txHash, chainId, networks) => {
        const network = networks[chainId];
        if (!network)
            return '';
        return `${network.blockExplorer}/tx/${txHash}`;
    },
    /**
     * Gets block explorer URL for address
     */
    getAddressUrl: (address, chainId, networks) => {
        const network = networks[chainId];
        if (!network)
            return '';
        return `${network.blockExplorer}/address/${address}`;
    },
};
// Validation utilities
export const validationUtils = {
    /**
     * Validates transaction data
     */
    validateTransaction: (tx) => {
        const errors = [];
        if (!tx.hash)
            errors.push('Transaction hash is required');
        if (!tx.from || !addressUtils.isValid(tx.from))
            errors.push('Valid from address is required');
        if (!tx.to || !addressUtils.isValid(tx.to))
            errors.push('Valid to address is required');
        if (tx.value === undefined || tx.value < 0n)
            errors.push('Valid value is required');
        return errors;
    },
    /**
     * Validates token info
     */
    validateTokenInfo: (tokenInfo) => {
        const errors = [];
        if (!tokenInfo.name)
            errors.push('Token name is required');
        if (!tokenInfo.symbol)
            errors.push('Token symbol is required');
        if (tokenInfo.decimals === undefined || tokenInfo.decimals < 0)
            errors.push('Valid decimals is required');
        if (!tokenInfo.contractAddress || !addressUtils.isValid(tokenInfo.contractAddress)) {
            errors.push('Valid contract address is required');
        }
        return errors;
    },
    /**
     * Validates network configuration
     */
    validateNetworkConfig: (config) => {
        const errors = [];
        if (!config.chainId || config.chainId <= 0)
            errors.push('Valid chain ID is required');
        if (!config.name)
            errors.push('Network name is required');
        if (!config.rpcUrl)
            errors.push('RPC URL is required');
        if (!config.blockExplorer)
            errors.push('Block explorer URL is required');
        return errors;
    },
};
// Error handling utilities
export const errorUtils = {
    /**
     * Extracts error message from various error types
     */
    extractMessage: (error) => {
        if (typeof error === 'string')
            return error;
        if (error instanceof Error)
            return error.message;
        if (typeof error === 'object' && error !== null && 'message' in error) {
            return String(error.message);
        }
        return 'Unknown error occurred';
    },
    /**
     * Checks if error is a network error
     */
    isNetworkError: (error) => {
        const message = errorUtils.extractMessage(error).toLowerCase();
        return message.includes('network') || message.includes('connection') || message.includes('timeout');
    },
    /**
     * Checks if error is a user rejection
     */
    isUserRejection: (error) => {
        const message = errorUtils.extractMessage(error).toLowerCase();
        return message.includes('user rejected') || message.includes('user denied');
    },
    /**
     * Formats error for user display
     */
    formatForUser: (error) => {
        const message = errorUtils.extractMessage(error);
        if (errorUtils.isUserRejection(error)) {
            return 'Transaction was cancelled by user';
        }
        if (errorUtils.isNetworkError(error)) {
            return 'Network connection error. Please check your internet connection and try again.';
        }
        // Return original message for other errors
        return message;
    },
};
// Utility for creating delay/sleep
export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
// Utility for retry logic
export const retry = async (fn, attempts = 3, delayMs = 1000) => {
    try {
        return await fn();
    }
    catch (error) {
        if (attempts <= 1)
            throw error;
        await delay(delayMs);
        return retry(fn, attempts - 1, delayMs);
    }
};
// Utility for debouncing
export const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};
// Utility for throttling
export const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};
//# sourceMappingURL=utils.js.map