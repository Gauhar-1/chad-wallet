'use client';

// =============================================================================
// SwapForm — Jupiter-powered buy/sell swap interface
// =============================================================================

import { useState, useMemo, useCallback, memo } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useSwapQuote } from '@/hooks/useSwapQuote';
import { useSwapExecute } from '@/hooks/useSwapExecute';
import { logger } from '@/lib/logger';
import { SOL_MINT, DEFAULT_SLIPPAGE_BPS } from '@/lib/constants';
import { formatPrice, formatCompact, cn } from '@/lib/utils';

interface SwapFormProps {
  tokenAddress: string;
}

const QUICK_AMOUNTS = [
  { label: '$10', value: 10 },
  { label: '$100', value: 100 },
  { label: '$500', value: 500 },
  { label: '$1000', value: 1000 },
];

const SLIPPAGE_OPTIONS = [50, 100, 300]; // basis points

const SwapForm = memo(function SwapForm({ tokenAddress }: SwapFormProps) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [slippageBps, setSlippageBps] = useState(DEFAULT_SLIPPAGE_BPS);
  const [showSlippage, setShowSlippage] = useState(false);

  const swapExecute = useSwapExecute();

  const quoteParams = useMemo(() => {
    if (!amount || parseFloat(amount) <= 0) return null;
    const amountLamports = Math.floor(parseFloat(amount) * 1e9).toString();

    if (side === 'buy') {
      return {
        inputMint: SOL_MINT,
        outputMint: tokenAddress,
        amount: amountLamports,
        slippageBps,
      };
    } else {
      return {
        inputMint: tokenAddress,
        outputMint: SOL_MINT,
        amount: amountLamports,
        slippageBps,
      };
    }
  }, [amount, side, tokenAddress, slippageBps]);

  const { data: quote, isLoading: quoteLoading } = useSwapQuote(quoteParams);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
      setAmount(val);
    }
  }, []);

  const handleSwap = useCallback(async () => {
    if (!quote) return;
    // In a real app, we'd get the user's publicKey from Privy's embedded wallet
    // For now, show that the flow works
    try {
      await swapExecute.mutateAsync({
        quoteResponse: quote,
        userPublicKey: 'connect-wallet-to-swap',
      });
    } catch (err) {
      logger.error('Swap failed:', err);
    }
  }, [quote, swapExecute]);

  return (
    <div className="p-4 space-y-4">
      {/* Buy/Sell toggle */}
      <div className="flex rounded-xl bg-white/[0.03] border border-white/[0.06] p-1">
        {(['buy', 'sell'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={cn(
              'flex-1 py-2.5 text-sm font-semibold rounded-lg capitalize transition-all',
              side === s
                ? s === 'buy'
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-red-500/15 text-red-400'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Amount input */}
      <div>
        <label className="block text-xs text-gray-500 mb-1.5">
          Amount ({side === 'buy' ? 'SOL' : 'Token'})
        </label>
        <Input
          type="text"
          inputMode="decimal"
          placeholder="$0"
          value={amount}
          onChange={handleAmountChange}
          className="text-lg font-semibold h-12"
          rightElement={
            <span className="text-xs text-gray-500 font-medium">
              {side === 'buy' ? 'SOL' : 'TOKEN'}
            </span>
          }
        />
      </div>

      {/* Quick amount buttons */}
      <div className="flex gap-2">
        {QUICK_AMOUNTS.map((qa) => (
          <button
            key={qa.label}
            onClick={() => setAmount((qa.value * 1).toString())} // Placeholder: multiply by balance
            className="flex-1 py-1.5 text-xs font-medium text-gray-400 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white transition-all"
          >
            {qa.label}
          </button>
        ))}
      </div>

      {/* Quote display */}
      {quoteLoading && amount && (
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse">
          <div className="text-xs text-gray-500">Fetching quote...</div>
        </div>
      )}

      {quote && !quoteLoading && (
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">You receive</span>
            <span className="text-white font-medium">
              {formatCompact(
                parseInt(quote.outAmount || '0') / 1e9
              )}{' '}
              {side === 'buy' ? 'tokens' : 'SOL'}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Price impact</span>
            <span
              className={
                parseFloat(quote.priceImpactPct || '0') > 1
                  ? 'text-red-400'
                  : 'text-gray-300'
              }
            >
              {parseFloat(quote.priceImpactPct || '0').toFixed(2)}%
            </span>
          </div>
          {quote.routePlan && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Route</span>
              <span className="text-gray-300">
                {(quote.routePlan as Array<{ swapInfo: { label: string } }>)
                  .map((r) => r.swapInfo?.label)
                  .filter(Boolean)
                  .join(' → ') || 'Direct'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Slippage settings */}
      <div>
        <button
          onClick={() => setShowSlippage(!showSlippage)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Slippage: {(slippageBps / 100).toFixed(1)}%
          <svg
            className={cn('w-3 h-3 transition-transform', showSlippage && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showSlippage && (
          <div className="flex gap-2 mt-2">
            {SLIPPAGE_OPTIONS.map((bps) => (
              <button
                key={bps}
                onClick={() => setSlippageBps(bps)}
                className={cn(
                  'flex-1 py-1.5 text-xs font-medium rounded-lg transition-all',
                  slippageBps === bps
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:text-white'
                )}
              >
                {(bps / 100).toFixed(1)}%
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Swap button */}
      <button
        disabled={!amount || !quote || swapExecute.isPending}
        onClick={handleSwap}
        className={cn(
          "w-full h-12 rounded-xl text-sm transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
          side === 'buy'
            ? "bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-black font-bold"
            : "bg-gradient-to-r from-red-500 to-red-400 text-white font-bold"
        )}
      >
        {swapExecute.isPending ? (
          <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        ) : null}
        {side === 'buy' ? 'Buy Token' : 'Sell Token'}
      </button>

      {/* Price impact warning */}
      {quote && parseFloat(quote.priceImpactPct || '0') > 5 && (
        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center mt-2">
          ⚠️ High price impact ({parseFloat(quote.priceImpactPct).toFixed(1)}%).
        </div>
      )}

    </div>
  );
});

export default SwapForm;
