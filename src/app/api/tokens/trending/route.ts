// =============================================================================
// API Route: GET /api/tokens/trending — Proxy BirdEye trending tokens
// =============================================================================

import { NextResponse } from 'next/server';
import { getTrendingTokens } from '@/services/marketDataService';

export const revalidate = 60; // ISR: revalidate every 60s

export async function GET() {
  try {
    const data = await getTrendingTokens();

    return NextResponse.json({ success: true, data: { items: data } }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('[API] Trending tokens error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending tokens', data: { items: [] } },
      { status: 502 }
    );
  }
}
