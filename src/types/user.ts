// =============================================================================
// User Types — Authentication and profile representations
// =============================================================================

/** Privy user representation */
export interface PrivyUser {
  id: string;
  createdAt: Date;
  linkedAccounts: LinkedAccount[];
  wallet?: EmbeddedWallet;
}

/** Linked authentication account */
export interface LinkedAccount {
  type: 'google_oauth' | 'apple_oauth' | 'email' | 'wallet';
  address?: string;
  email?: string;
  name?: string;
  profilePictureUrl?: string;
  verifiedAt: Date;
}

/** Embedded wallet info */
export interface EmbeddedWallet {
  address: string;
  chainType: 'solana' | 'ethereum';
  walletClient: string;
  connectorType: string;
}

/** Supabase user profile */
export interface UserProfile {
  id: string;
  privy_id: string;
  display_name: string | null;
  avatar_url: string | null;
  wallet_address: string | null;
  created_at: string;
  updated_at: string;
}

/** User watchlist item */
export interface WatchlistItem {
  id: string;
  user_id: string;
  token_address: string;
  token_symbol: string;
  added_at: string;
}
