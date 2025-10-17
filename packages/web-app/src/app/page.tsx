'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { TokenBalance } from '@/components/TokenBalance';
import { TransferForm } from '@/components/TransferForm';
import { TransactionHistory } from '@/components/TransactionHistory';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Nomad Coin</h1>
            <p className="text-gray-600 mt-2">Advanced ERC-20 Token Platform</p>
          </div>
          <ConnectButton />
        </header>

        {/* Main Content */}
        {isConnected ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Wallet Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Address:</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {address}
                  </p>
                  <p className="text-sm text-gray-600">ETH Balance:</p>
                  <p className="text-lg font-semibold">
                    {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH'}
                  </p>
                </div>
              </div>

              {/* Token Balance */}
              <TokenBalance />

              {/* Transfer Form */}
              <TransferForm />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Transaction History */}
              <TransactionHistory />
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Welcome to Nomad Coin</h2>
              <p className="text-gray-600 mb-6">
                Connect your wallet to start using the Nomad Coin platform. 
                Send, receive, and manage your NOMAD tokens with ease.
              </p>
              <ConnectButton />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}