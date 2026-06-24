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
 * Fetch trending tokens from CoinGecko filtered/extracted for Solana
 */
export async function getTrendingTokens() {
  const res = await fetch(`${COINGECKO_API}/search/trending`, {
    headers: getCoinGeckoHeaders(),
    next: { revalidate: 60 }
  });
  
  if (!res.ok) {
    throw new Error(`CoinGecko trending fetch failed: ${res.status}`);
  }
  
  const data = await res.json();
  
  // Map and isolate tokens that have a valid Solana contract address
  return data.coins
    .map((coin: any) => {
      const solanaAddress = coin.item.platforms?.solana;
      
      // Fallback for native SOL if the item is Solana itself
      const verifiedAddress = coin.item.id === 'solana' 
        ? 'So11111111111111111111111111111111111111112' 
        : solanaAddress;

      if (!verifiedAddress) return null;

      return {
        address: verifiedAddress,
        coingeckoId: coin.item.id,
        symbol: coin.item.symbol.toUpperCase(),
        name: coin.item.name,
        decimals: 9,
        logoURI: coin.item.thumb || coin.item.small,
        price: coin.item.data?.price || 0,
        priceChange24hPercent: coin.item.data?.price_change_percentage_24h?.usd || 0,
        volume24hUSD: coin.item.data?.total_volume ? parseFloat(coin.item.data.total_volume.replace(/[^0-9.-]+/g, "")) : 0,
        marketCap: coin.item.data?.market_cap ? parseFloat(coin.item.data.market_cap.replace(/[^0-9.-]+/g, "")) : 0,
        rank: coin.item.market_cap_rank,
      };
    })
    .filter(Boolean); // Remove non-Solana assets from the dashboard tracking
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