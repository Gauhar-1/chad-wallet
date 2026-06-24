// =============================================================================
// API Route: POST /api/swap/execute — Jupiter swap transaction proxy
// =============================================================================

import { NextResponse } from 'next/server';
import { buildSwapTransaction } from '@/services/swapService';
import { solanaAddressSchema, swapExecuteSchema } from '@/lib/validators';
import { validateCSRFToken } from '@/lib/csrf';

export async function POST(request: Request) {
  try {
    const isValidCSRF = await validateCSRFToken(request);
    if (!isValidCSRF) {
      return NextResponse.json({ error: 'Invalid or missing CSRF token' }, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields
    const userPubKeyResult = solanaAddressSchema.safeParse(body.userPublicKey);
    if (!userPubKeyResult.success) {
      return NextResponse.json(
        { error: 'Invalid user public key' },
        { status: 400 }
      );
    }

    const quoteResponseResult = swapExecuteSchema.pick({ quoteResponse: true }).safeParse(body);
    if (!quoteResponseResult.success) {
      return NextResponse.json(
        { error: 'Missing or invalid quote response' },
        { status: 400 }
      );
    }

    const swapResult = await buildSwapTransaction({
      quoteResponse: quoteResponseResult.data.quoteResponse as any,
      userPublicKey: userPubKeyResult.data,
    });

    return NextResponse.json(swapResult, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[API] Swap execute error:', error);
    const message = error instanceof Error ? error.message : 'Swap failed';
    return NextResponse.json(
      { error: message },
      { status: 502 }
    );
  }
}
