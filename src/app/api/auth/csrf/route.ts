import { NextResponse } from 'next/server';
import { setCSRFToken } from '@/lib/csrf';

export async function GET() {
  const token = await setCSRFToken();
  return NextResponse.json({ csrfToken: token });
}
