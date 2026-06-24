// =============================================================================
// API Route: GET /api/user/positions — Fetch user token balances via Helius
// =============================================================================

import { NextResponse, type NextRequest } from 'next/server';
import { getTokenAccounts, getSolBalance } from '@/services/alchemyService';
import { solanaAddressSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    const parsed = solanaAddressSchema.safeParse(address);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    const walletAddress = parsed.data;

    // Fetch SOL balance and Token accounts in parallel
    const [solBalance, tokenAccounts] = await Promise.all([
      getSolBalance(walletAddress),
      getTokenAccounts(walletAddress),
    ]);

    // Add native SOL to the list
    const positions = [
      {
        mint: 'So11111111111111111111111111111111111111112', // Native SOL
        balance: solBalance,
        uiBalance: solBalance / 1e9,
        decimals: 9,
      },
      ...tokenAccounts,
    ];

    return NextResponse.json({ success: true, data: positions }, {
      headers: {
        'Cache-Control': 'no-store', // Balances should not be cached globally
      },
    });
  } catch (error) {
    console.error('[API] User positions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user positions' },
      { status: 502 }
    );
  }
}
