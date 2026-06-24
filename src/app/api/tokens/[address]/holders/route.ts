// =============================================================================
// API Route: GET /api/tokens/[address]/holders — Top traders proxy
// =============================================================================

import { NextResponse } from 'next/server';
import { getTopTraders } from '@/services/marketDataService';
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

    const data = await getTopTraders(parsed.data);

    return NextResponse.json({ success: true, data: { items: data } }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('[API] Top holders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top holders' },
      { status: 502 }
    );
  }
}
