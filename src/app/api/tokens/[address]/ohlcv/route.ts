// =============================================================================
// API Route: GET /api/tokens/[address]/ohlcv — OHLCV chart data proxy
// =============================================================================

import { NextResponse, type NextRequest } from 'next/server';
import { getTokenOHLCV } from '@/services/marketDataService';
import { solanaAddressSchema, timeframeSchema } from '@/lib/validators';

export async function GET(
  request: NextRequest,
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

    const { searchParams } = new URL(request.url);
    const timeframe = timeframeSchema.safeParse(
      searchParams.get('timeframe') || '1H'
    );

    const data = await getTokenOHLCV(
      parsed.data,
      timeframe.success ? timeframe.data : '1H'
    );

    return NextResponse.json({ success: true, data: { items: data } }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('[API] OHLCV error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OHLCV data' },
      { status: 502 }
    );
  }
}
