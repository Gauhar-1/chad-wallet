'use client';

// =============================================================================
// TokenSearch — Token search modal
// =============================================================================

import { useState, useCallback, memo } from 'react';
import Input from '@/components/ui/Input';
import TokenIcon from '@/components/common/TokenIcon';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface TokenSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const TokenSearch = memo(function TokenSearch({ isOpen, onClose }: TokenSearchProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-[#111827] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4">
          <Input
            placeholder="Search tokens by name, symbol, or address..."
            value={query}
            onChange={handleQueryChange}
            className="h-11"
            autoFocus
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto border-t border-white/[0.04]">
          <div className="p-4 text-center text-xs text-gray-500">
            {debouncedQuery
              ? 'Search results will appear here...'
              : 'Start typing to search tokens'}
          </div>
        </div>
      </div>
    </div>
  );
});

export default TokenSearch;
