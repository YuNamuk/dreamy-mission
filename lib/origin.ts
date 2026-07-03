import 'server-only';
import type { NextRequest } from 'next/server';

/** 프록시(Vercel) 뒤에서도 정확한 외부 origin 계산 — redirect_uri 일치에 중요. */
export function originOf(req: NextRequest): string {
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? req.nextUrl.host;
  return `${proto}://${host}`;
}

export const COOKIE_SECURE = process.env.NODE_ENV === 'production';
