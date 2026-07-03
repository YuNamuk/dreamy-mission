import { NextRequest, NextResponse } from 'next/server';
import { authorizeUrl, dreamiReady, STATE_COOKIE } from '@/lib/dreami';
import { originOf, COOKIE_SECURE } from '@/lib/origin';

export async function GET(req: NextRequest) {
  const origin = originOf(req);
  if (!dreamiReady) return NextResponse.redirect(new URL('/?error=login_not_configured', origin));

  const state = crypto.randomUUID();
  const redirectUri = `${origin}/auth/callback`;
  const res = NextResponse.redirect(authorizeUrl(redirectUri, state));
  // state 로 CSRF 방지 — 콜백에서 대조.
  res.cookies.set(STATE_COOKIE, state, { httpOnly: true, sameSite: 'lax', secure: COOKIE_SECURE, path: '/', maxAge: 600 });
  return res;
}
