'use client';

// =============================================================================
// useSwapExecute — Jupiter swap execution mutation
// =============================================================================

import { useMutation, useQueryClient } from '@tanstack/react-query';

interface SwapExecuteParams {
  quoteResponse: Record<string, unknown>;
  userPublicKey: string;
}

async function executeSwap(params: SwapExecuteParams) {
  // Fetch CSRF token
  const csrfRes = await fetch('/api/auth/csrf');
  const { csrfToken } = await csrfRes.json();

  const payload = { ...params, csrfToken };

  const response = await fetch('/api/swap/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Swap failed' }));
    throw new Error(error.message || 'Failed to execute swap');
  }

  return response.json();
}

export function useSwapExecute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: executeSwap,
    onSuccess: () => {
      // Invalidate positions and recent trades after a successful swap
      queryClient.invalidateQueries({ queryKey: ['user-positions'] });
      queryClient.invalidateQueries({ queryKey: ['recent-trades'] });
    },
  });
}
