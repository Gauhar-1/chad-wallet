// =============================================================================
// Market Data Service — Client for CoinGecko & Jupiter Price APIs
// =============================================================================

// Note: CoinGecko's Demo API Plan uses a specific subdomain
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const JUPITER_PRICE_API = 'https://api.jup.ag/price/v2';

// Helper to get headers with the server-side API key
function getCoinGeckoHeaders() {
  const apiKey = process.env.COINGECKO_API_KEY;
  if (!apiKey) {
    console.warn("Warning: COINGECKO_API_KEY is missing from environment variables.");
  }
  return {
    'accept': 'application/json',
    'x-cg-demo-api-key': apiKey || '',
  };
}

/**
 * Fetch live market data for a strict list of top Solana ecosystem tokens.
 * Uses concurrent parallel fetching and filters out any assets that fail to return live data.
 */
export async function getTrendingTokens() {
  // Strict List of top Solana token mints
  const TOP_SOLANA_TOKENS = [
    { symbol: 'SOL', address: 'So11111111111111111111111111111111111111112' },
    { symbol: 'JUP', address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN' },
    { symbol: 'WIF', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYtM2wYSzjn' },
    { symbol: 'BONK', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
    { symbol: 'PYTH', address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3HbsfGQ2N2LwwF' },
    { symbol: 'RAY', address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R' },
    { symbol: 'JTO', address: 'jtojtomepa8beP8AuQc6eP9N2r6q2Y3J8kU6q8Q4hQ3' },
    { symbol: 'BOME', address: 'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82' },
    { symbol: 'POPCAT', address: '7GCihgDB8fe6KNjn2TW33WwNxgzZpA4C7k7A4N17N5pE' },
    { symbol: 'MEW', address: 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScBAB' },
  ];

  try {
    // 1. Fire high-speed concurrent requests for each token individually
    const fetchPromises = TOP_SOLANA_TOKENS.map(async (token) => {
      try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${token.address}`, {
          next: { revalidate: 30 } // Cache endpoints for 30 seconds
        });
        
        if (!res.ok) return null;
        const data = await res.json();
        
        // Isolate pairs for this specific asset and grab the one with the highest liquidity
        const pairs = data.pairs?.filter((p: any) => p.baseToken.address === token.address) || [];
        const bestPair = pairs.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];

        if (!bestPair) return null;

        return {
          address: token.address,
          coingeckoId: token.address,
          symbol: token.symbol,
          name: bestPair.baseToken.name || token.symbol,
          decimals: 9,
          logoURI: bestPair.info?.imageUrl || null,
          price: parseFloat(bestPair.priceUsd) || 0,
          priceChange24hPercent: bestPair.priceChange?.h24 || 0,
          volume24hUSD: bestPair.volume?.h24 || 0,
          marketCap: bestPair.fdv || 0,
          rank: 0,
        };
      } catch (err) {
        console.error(`Failed fetching pair for ${token.symbol}:`, err);
        return null;
      }
    });

    // 2. Resolve all promises concurrently
    const results = await Promise.all(fetchPromises);
    
    // 3. Strict Filter: Extract only successfully resolved live data payloads
    const mappedTokens = results.filter(Boolean);

    if (mappedTokens.length === 0) throw new Error("All token fetches returned null");
    
    return mappedTokens;

  } catch (error) {
    console.error("Failed to execute concurrent trending fetch:", error);
    
    // Secure UI fallback state using a single guaranteed live token asset (SOL)
    return [{
      address: 'So11111111111111111111111111111111111111112',
      coingeckoId: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      decimals: 9,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      price: 0,
      priceChange24hPercent: 0,
      volume24hUSD: 0,
      marketCap: 0,
      rank: 1,
    }];
  }
}


/**
 * Resolve a Solana contract address to a CoinGecko ID.
 */
export async function getCoinGeckoId(address: string): Promise<string> {
  // Native Solana Mint Wrap
  if (address === 'So11111111111111111111111111111111111111112') return 'solana';
  
  // Avoid refetching if it's already a text ID
  if (address.length < 32 || address.includes('-')) return address; 

  const res = await fetch(`${COINGECKO_API}/coins/solana/contract/${address}`, {
    headers: getCoinGeckoHeaders()
  });
  
  if (!res.ok) return address;
  const data = await res.json();
  return data.id;
}

/**
 * Fetch OHLCV data from CoinGecko mapped to standard chart layout
 */
export async function getTokenOHLCV(address: string, timeframe: string = '1D') {
  const coinGeckoId = await getCoinGeckoId(address);
  
  let days = '1';
  if (timeframe === '1D') days = '1';      // 30-minute interval bars
  else if (timeframe === '1W') days = '7'; // 4-hour interval bars
  else if (timeframe === '1M') days = '30';// 4-hour interval bars
  
  const res = await fetch(`${COINGECKO_API}/coins/${coinGeckoId}/ohlc?vs_currency=usd&days=${days}`, {
    headers: getCoinGeckoHeaders(),
    next: { revalidate: 30 }
  });
  
  if (!res.ok) {
    throw new Error(`CoinGecko OHLC fetch failed: ${res.status}`);
  }
  
  const rawData = await res.json();
  
  return rawData.map((candle: number[]) => ({
    time: Math.floor(candle[0] / 1000), // Convert ms to Unix timestamp seconds for chart library
    o: candle[1],
    h: candle[2],
    l: candle[3],
    c: candle[4],
    v: 0, 
  }));
}

/**
 * Fetch true live spot prices directly from Jupiter via clean base58 Mint Addresses
 */
export async function getTokenPrice(address: string) {
  const res = await fetch(`${JUPITER_PRICE_API}/price?ids=${address}`, {
    next: { revalidate: 15 }
  });
  
  if (!res.ok) {
    throw new Error(`Jupiter price fetch failed: ${res.status}`);
  }
  
  const data = await res.json();
  return data.data[address]?.price || 0;
}

export async function getMultipleTokenPrices(addresses: string[]) {
  if (!addresses.length) return {};
  const ids = addresses.join(',');
  const res = await fetch(`${JUPITER_PRICE_API}/price?ids=${ids}`, {
    next: { revalidate: 15 }
  });
  
  if (!res.ok) throw new Error(`Jupiter multiple price fetch failed: ${res.status}`);
  
  const data = await res.json();
  const result: Record<string, any> = {};
  
  addresses.forEach((addr) => {
    result[addr] = { value: data.data[addr]?.price || 0, priceChange24h: 0 };
  });
  return result;
}

export async function getTokenOverview(address: string) {
  const res = await fetch(`${COINGECKO_API}/coins/solana/contract/${address}`, {
    headers: getCoinGeckoHeaders()
  });
  if (!res.ok) return null;
  const data = await res.json();
  
  return {
    address: data.contract_address || address,
    symbol: data.symbol?.toUpperCase() || '',
    name: data.name || '',
    decimals: data.detail_platforms?.solana?.decimal_place || 9,
    logoURI: data.image?.large || data.image?.small || '',
    price: data.market_data?.current_price?.usd || 0,
    priceChange24hPercent: data.market_data?.price_change_percentage_24h || 0,
    liquidity: 0,
    marketCap: data.market_data?.market_cap?.usd || 0,
    supply: data.market_data?.total_supply || 0,
    holderCount: 0,
    volume24hUSD: data.market_data?.total_volume?.usd || 0,
    extensions: {
      website: data.links?.homepage?.[0] || '',
      twitter: data.links?.twitter_screen_name ? `https://twitter.com/${data.links.twitter_screen_name}` : '',
      telegram: data.links?.telegram_channel_identifier ? `https://t.me/${data.links.telegram_channel_identifier}` : '',
      discord: data.links?.chat_url?.find((url: string) => url.includes('discord')) || '',
      description: data.description?.en || '',
    }
  };
}

export async function getTopTraders(address: string) { return []; }
export async function getTokenTrades(address: string, limit = 50) { return []; }