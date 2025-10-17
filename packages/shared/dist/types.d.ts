import { Address, Hash } from 'viem';
export interface NetworkConfig {
    chainId: number;
    name: string;
    rpcUrl: string;
    blockExplorer: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
}
export interface ContractAddresses {
    nomadCoin: Address;
    nomadCoinProxy: Address;
}
export interface TokenInfo {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
    userBalance: bigint;
    contractAddress: Address;
}
export interface TokenMetadata {
    name: string;
    symbol: string;
    decimals: number;
    maxSupply: bigint;
    totalSupply: bigint;
}
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';
export interface Transaction {
    hash: Hash;
    from: Address;
    to: Address;
    value: bigint;
    timestamp: number;
    status: TransactionStatus;
    gasUsed?: bigint;
    gasPrice?: bigint;
    blockNumber?: bigint;
    confirmations?: number;
}
export interface TransactionReceipt {
    hash: Hash;
    status: 'success' | 'reverted';
    blockNumber: bigint;
    gasUsed: bigint;
    effectiveGasPrice: bigint;
    logs: TransactionLog[];
}
export interface TransactionLog {
    address: Address;
    topics: Hash[];
    data: string;
    blockNumber: bigint;
    transactionHash: Hash;
    logIndex: number;
}
export interface WalletState {
    address: Address | null;
    isConnected: boolean;
    chainId: number | null;
    isConnecting: boolean;
    error: string | null;
}
export interface WalletConnection {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    switchNetwork: (chainId: number) => Promise<void>;
}
export interface ContractCall {
    address: Address;
    functionName: string;
    args: unknown[];
    value?: bigint;
}
export interface ContractCallResult<T = unknown> {
    data: T;
    gasUsed: bigint;
    transactionHash?: Hash;
}
export interface ContractError {
    name: string;
    message: string;
    code?: string;
    data?: unknown;
}
export interface NetworkError {
    message: string;
    code: number;
    details?: string;
}
export interface TokenTransferEvent {
    from: Address;
    to: Address;
    value: bigint;
    transactionHash: Hash;
    blockNumber: bigint;
    timestamp: number;
}
export interface TokenApprovalEvent {
    owner: Address;
    spender: Address;
    value: bigint;
    transactionHash: Hash;
    blockNumber: bigint;
    timestamp: number;
}
export interface TokenMintEvent {
    to: Address;
    value: bigint;
    transactionHash: Hash;
    blockNumber: bigint;
    timestamp: number;
}
export interface TokenBurnEvent {
    from: Address;
    value: bigint;
    transactionHash: Hash;
    blockNumber: bigint;
    timestamp: number;
}
export interface DeploymentConfig {
    networks: Record<string, NetworkConfig>;
    contracts: {
        nomadCoin: {
            name: string;
            symbol: string;
            initialSupply: bigint;
            maxSupply: bigint;
            minters: Address[];
            pausers: Address[];
            upgraders: Address[];
        };
    };
    verification: {
        apiKeys: Record<string, string>;
        enabled: boolean;
    };
}
export interface DeploymentResult {
    contractAddress: Address;
    proxyAddress: Address;
    implementationAddress: Address;
    transactionHash: Hash;
    blockNumber: bigint;
    gasUsed: bigint;
    verified: boolean;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: number;
}
export interface PaginatedResponse<T = unknown> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
//# sourceMappingURL=types.d.ts.map