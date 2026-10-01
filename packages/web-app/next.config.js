/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    // Optional peers of wallet SDKs that a browser build never needs:
    // x402 payment helpers (@coinbase/cdp-sdk via the Base Account
    // connector) and React Native storage (@metamask/sdk).
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      '@x402/core': false,
      '@x402/evm': false,
      '@x402/svm': false,
      '@x402/extensions': false,
    };
    return config;
  },
};

module.exports = nextConfig;