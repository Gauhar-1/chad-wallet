// =============================================================================
// Utility Functions — Formatters, helpers, and class name merging
// =============================================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx, resolving conflicts correctly.
 * Example: cn('px-2 py-1', 'px-4') → 'py-1 px-4'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as a USD price.
 * - < $0.001 → scientific notation
 * - < $1 → up to 6 decimal places
 * - < $1000 → 2 decimal places
 * - >= $1000 → comma-separated with 2 decimals
 */
export function formatPrice(price: number): string {
  if (price === 0) return '$0.00';
  if (price < 0.000001) return `$${price.toExponential(2)}`;
  if (price < 0.001) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 1000) return `$${price.toFixed(2)}`;
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format a large number with K/M/B/T suffixes.
 */
export function formatCompact(num: number): string {
  if (num === 0) return '0';
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1e12) return `${sign}${(absNum / 1e12).toFixed(2)}T`;
  if (absNum >= 1e9) return `${sign}${(absNum / 1e9).toFixed(2)}B`;
  if (absNum >= 1e6) return `${sign}${(absNum / 1e6).toFixed(2)}M`;
  if (absNum >= 1e3) return `${sign}${(absNum / 1e3).toFixed(2)}K`;
  return `${sign}${absNum.toFixed(2)}`;
}

/**
 * Format a percentage change with + sign and color indicator.
 */
export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Truncate a wallet address: "ABcD...xYzW"
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address || address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format a Unix timestamp to a relative time string.
 */
export function formatTimeAgo(unixTimestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - unixTimestamp;

  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(unixTimestamp * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a Unix timestamp to a readable time.
 */
export function formatTime(unixTimestamp: number): string {
  return new Date(unixTimestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Convert lamports to SOL (9 decimals).
 */
export function lamportsToSol(lamports: number): number {
  return lamports / 1e9;
}

/**
 * Convert SOL to lamports.
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * 1e9);
}

/**
 * Convert raw token amount to UI amount using decimals.
 */
export function toUiAmount(rawAmount: number, decimals: number): number {
  return rawAmount / Math.pow(10, decimals);
}

/**
 * Convert UI amount to raw amount using decimals.
 */
export function toRawAmount(uiAmount: number, decimals: number): number {
  return Math.floor(uiAmount * Math.pow(10, decimals));
}

/**
 * Sleep for the given number of milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if a string is a valid Solana base58 address (32-44 chars, base58 charset).
 */
export function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}
