'use client';

import { useState } from 'react';
import { WagmiProvider, fallback, http } from 'wagmi';
import { mainnet, goerli, sepolia, hardhat } from 'wagmi/chains';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

/** Alchemy first when a key is configured, then the chain's public RPC. */
function transport(alchemyHost: string) {
  return alchemyKey
    ? fallback([http(`https://${alchemyHost}.g.alchemy.com/v2/${alchemyKey}`), http()])
    : http();
}

const config = getDefaultConfig({
  appName: 'Nomad Coin',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo',
  chains: [hardhat, sepolia, goerli, mainnet],
  transports: {
    [hardhat.id]: http(),
    [sepolia.id]: transport('eth-sepolia'),
    [goerli.id]: transport('eth-goerli'),
    [mainnet.id]: transport('eth-mainnet'),
  },
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
