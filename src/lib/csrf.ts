// =============================================================================
// CSRF — Anti-CSRF token generation and validation for state-mutating routes
// =============================================================================

import { cookies } from 'next/headers';

const CSRF_COOKIE_NAME = 'chad_csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Generate a cryptographically random CSRF token.
 * Uses the Web Crypto API (available in Node 18+ and Edge runtime).
 */
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Set a new CSRF token cookie and return the token value.
 * Call this from a GET route or page to provision the token.
 */
export async function setCSRFToken(): Promise<string> {
  const token = generateToken();
  const cookieStore = await cookies();

  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 3600, // 1 hour
  });

  return token;
}

/**
 * Get the current CSRF token from cookies.
 */
export async function getCSRFToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE_NAME)?.value;
}

/**
 * Validate a CSRF token from the request header against the cookie.
 * Returns true if valid, false otherwise.
 */
export async function validateCSRFToken(request: Request): Promise<boolean> {
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  const cookieToken = await getCSRFToken();

  if (!headerToken || !cookieToken) return false;

  // Constant-time comparison to prevent timing attacks
  if (headerToken.length !== cookieToken.length) return false;

  let mismatch = 0;
  for (let i = 0; i < headerToken.length; i++) {
    mismatch |= headerToken.charCodeAt(i) ^ cookieToken.charCodeAt(i);
  }

  return mismatch === 0;
}

export { CSRF_HEADER_NAME };
