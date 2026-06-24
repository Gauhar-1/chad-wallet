// =============================================================================
// Supabase Service — Browser and server client initialization
// =============================================================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

/**
 * Get the browser-side Supabase client (singleton, uses anon key).
 * Safe to use in client components.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  browserClient = createClient(url, anonKey, {
    auth: {
      persistSession: false, // Privy handles auth, not Supabase Auth
    },
  });

  return browserClient;
}

/**
 * Get a server-side Supabase client (uses service role key).
 * Only use in API routes and server components — never expose to client.
 */
export function getSupabaseServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase server environment variables');
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
