// =============================================================================
// Chain Config — Solana network configuration
// =============================================================================

export const solanaConfig = {
  mainnet: {
    name: 'Solana Mainnet',
    chainId: 'solana:mainnet',
    rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io',
    nativeCurrency: {
      name: 'SOL',
      symbol: 'SOL',
      decimals: 9,
    },
  },
  devnet: {
    name: 'Solana Devnet',
    chainId: 'solana:devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    explorerUrl: 'https://solscan.io?cluster=devnet',
    nativeCurrency: {
      name: 'SOL',
      symbol: 'SOL',
      decimals: 9,
    },
  },
} as const;

/** Currently active network */
export const activeChain = solanaConfig.mainnet;
