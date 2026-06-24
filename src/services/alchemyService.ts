// =============================================================================
// Alchemy Service — Solana RPC client for wallet balances and transactions
// =============================================================================

import { Connection, PublicKey } from '@solana/web3.js';

let connection: Connection | null = null;

/**
 * Get a shared Solana connection instance (singleton) using Alchemy.
 */
export function getAlchemyConnection(): Connection {
  if (!connection) {
    const rpcUrl =
      process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL ||
      'https://api.mainnet-beta.solana.com';
    connection = new Connection(rpcUrl, {
      commitment: 'confirmed',
    });
  }
  return connection;
}

/**
 * Fetch all SPL token accounts for a wallet.
 * Returns parsed token balances.
 */
export async function getTokenAccounts(walletAddress: string) {
  const conn = getAlchemyConnection();
  const pubkey = new PublicKey(walletAddress);

  const tokenAccounts = await conn.getParsedTokenAccountsByOwner(pubkey, {
    programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
  });

  return tokenAccounts.value.map((account) => {
    const parsed = account.account.data.parsed.info;
    return {
      mint: parsed.mint as string,
      balance: Number(parsed.tokenAmount.amount),
      uiBalance: Number(parsed.tokenAmount.uiAmount),
      decimals: parsed.tokenAmount.decimals as number,
    };
  });
}

/**
 * Fetch native SOL balance for a wallet.
 */
export async function getSolBalance(walletAddress: string): Promise<number> {
  const conn = getAlchemyConnection();
  const pubkey = new PublicKey(walletAddress);
  return conn.getBalance(pubkey);
}

/**
 * Send a signed transaction to the network.
 */
export async function sendTransaction(
  serializedTransaction: Buffer
): Promise<string> {
  const conn = getAlchemyConnection();
  return conn.sendRawTransaction(serializedTransaction, {
    skipPreflight: false,
    maxRetries: 3,
  });
}

/**
 * Confirm a transaction with timeout.
 */
export async function confirmTransaction(
  signature: string,
  timeout = 30000
): Promise<boolean> {
  const conn = getAlchemyConnection();
  const latestBlockhash = await conn.getLatestBlockhash();

  const confirmation = await conn.confirmTransaction(
    {
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    },
    'confirmed'
  );

  return !confirmation.value.err;
}
