import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    let publicKey: PublicKey;
    try {
      publicKey = new PublicKey(address);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid Solana address format' }, { status: 400 });
    }

    const rpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || 'https://api.mainnet-beta.solana.com';
    // const rpcUrl = 'https://api.testnet.solana.com';
    const connection = new Connection(rpcUrl, 'confirmed');

    // Fetch balance and price concurrently
    // Revalidate price every 60 seconds to avoid CoinGecko rate limits on Next.js side
    const [balanceLamports, priceRes] = await Promise.all([
      connection.getBalance(publicKey),
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd', {
        next: { revalidate: 60 }
      }).then(res => {
        if (!res.ok) throw new Error('Failed to fetch price');
        return res.json();
      }).catch(err => {
        console.warn('Price fetch error:', err);
        return null;
      })
    ]);

    const solBalance = balanceLamports / LAMPORTS_PER_SOL;
    const solPriceUsd = priceRes?.solana?.usd || 0;
    const usdBalance = solBalance * solPriceUsd;


    return NextResponse.json({
      solBalance,
      usdBalance,
      solPriceUsd
    });

  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
