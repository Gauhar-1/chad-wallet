// =============================================================================
// API Route: GET /api/swap/quote — Jupiter swap quote proxy
// =============================================================================

import { NextResponse, type NextRequest } from 'next/server';
import { getSwapQuote } from '@/services/swapService';
import { swapQuoteSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const parsed = swapQuoteSchema.safeParse({
      inputMint: searchParams.get('inputMint'),
      outputMint: searchParams.get('outputMint'),
      amount: searchParams.get('amount'),
      slippageBps: searchParams.get('slippageBps') || '100',
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid swap parameters', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const quote = await getSwapQuote(parsed.data);

    return NextResponse.json(quote, {
      headers: {
        'Cache-Control': 'no-store', // Quotes must be fresh
      },
    });
  } catch (error) {
    console.error('[API] Swap quote error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch swap quote' },
      { status: 502 }
    );
  }
}
