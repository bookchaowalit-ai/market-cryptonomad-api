'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export function TokenBalance() {
  const { address } = useAccount();
  const [balance, setBalance] = useState<string>('0.0000');
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Implement actual token balance fetching in later tasks
  useEffect(() => {
    if (address) {
      setIsLoading(true);
      // Simulate loading
      setTimeout(() => {
        setBalance('1,000.0000'); // Mock balance
        setIsLoading(false);
      }, 1000);
    }
  }, [address]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">NOMAD Token Balance</h2>
      <div className="text-center">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        ) : (
          <div>
            <p className="text-3xl font-bold text-indigo-600">{balance}</p>
            <p className="text-gray-600">NOMAD</p>
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Token Address:</span>
          <span className="font-mono">0x...coming soon</span>
        </div>
      </div>
    </div>
  );
}