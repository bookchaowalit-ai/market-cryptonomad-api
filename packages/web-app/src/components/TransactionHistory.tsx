'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface MockTransaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
}

export function TransactionHistory() {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<MockTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Implement actual transaction history fetching in later tasks
  useEffect(() => {
    if (address) {
      setIsLoading(true);
      // Mock transaction data
      setTimeout(() => {
        setTransactions([
          {
            hash: '0x1234...5678',
            from: '0xabcd...efgh',
            to: address,
            amount: '100.0000',
            timestamp: '2 hours ago',
            status: 'confirmed',
          },
          {
            hash: '0x9876...5432',
            from: address,
            to: '0x1111...2222',
            amount: '50.0000',
            timestamp: '1 day ago',
            status: 'confirmed',
          },
          {
            hash: '0xaaaa...bbbb',
            from: address,
            to: '0x3333...4444',
            amount: '25.0000',
            timestamp: '3 days ago',
            status: 'pending',
          },
        ]);
        setIsLoading(false);
      }, 1500);
    }
  }, [address]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-mono text-sm text-gray-600">
                    {tx.hash}
                  </p>
                  <div className="flex items-center mt-1 text-sm">
                    <span className="text-gray-500">From:</span>
                    <span className="ml-1 font-mono">{formatAddress(tx.from)}</span>
                    <span className="mx-2 text-gray-400">→</span>
                    <span className="text-gray-500">To:</span>
                    <span className="ml-1 font-mono">{formatAddress(tx.to)}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                  {tx.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">{tx.amount} NOMAD</span>
                <span className="text-sm text-gray-500">{tx.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No transactions found</p>
          <p className="text-sm mt-1">Your transaction history will appear here</p>
        </div>
      )}
    </div>
  );
}