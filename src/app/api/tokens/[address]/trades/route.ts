// =============================================================================
// API Route: GET /api/tokens/[address]/trades — Recent trades proxy
// =============================================================================

import { NextResponse } from 'next/server';
import { getTokenTrades } from '@/services/marketDataService';
import { solanaAddressSchema } from '@/lib/validators';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const parsed = solanaAddressSchema.safeParse(address);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid token address' },
        { status: 400 }
      );
    }

    const data = await getTokenTrades(parsed.data, 30);

    return NextResponse.json({ success: true, data: { items: data } }, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=20',
      },
    });
  } catch (error) {
    console.error('[API] Recent trades error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent trades' },
      { status: 502 }
    );
  }
}
