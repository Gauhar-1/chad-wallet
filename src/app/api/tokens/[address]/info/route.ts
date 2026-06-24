// =============================================================================
// API Route: GET /api/tokens/[address]/info — Token overview proxy
// =============================================================================

import { NextResponse } from 'next/server';
import { getTokenOverview } from '@/services/marketDataService';
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

    const data = await getTokenOverview(parsed.data);

    return NextResponse.json({ success: true, data }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('[API] Token info error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token info' },
      { status: 502 }
    );
  }
}
