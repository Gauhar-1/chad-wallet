// =============================================================================
// API Route: GET /api/tokens/price — Proxy BirdEye token prices
// =============================================================================

import { NextResponse, type NextRequest } from 'next/server';
import { getTokenPrice, getMultipleTokenPrices } from '@/services/marketDataService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const addresses = searchParams.get('addresses');

    if (!addresses) {
      return NextResponse.json(
        { error: 'Missing addresses parameter' },
        { status: 400 }
      );
    }

    const addressList = addresses.split(',').filter(Boolean);

    let data;
    if (addressList.length === 1) {
      data = await getTokenPrice(addressList[0]);
    } else {
      data = await getMultipleTokenPrices(addressList);
    }

    return NextResponse.json({ success: true, data }, {
      headers: {
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('[API] Token price error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token price' },
      { status: 502 }
    );
  }
}
