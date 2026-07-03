import { NextRequest, NextResponse } from 'next/server';
import { exchangeCode, STATE_COOKIE, TOKEN_COOKIE } from '@/lib/dreami';
import { originOf, COOKIE_SECURE } from '@/lib/origin';

// 포털이 redirect_uri 를 "<앱주소>/auth/callback" 으로 등록 → 이 라우트가 그 콜백.
export async function GET(req: NextRequest) {
  const origin = originOf(req);
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const saved = req.cookies.get(STATE_COOKIE)?.value;

  if (!code || !state || !saved || state !== saved) {
    return NextResponse.redirect(new URL('/?error=state', origin));
  }
  try {
    const token = await exchangeCode(code, `${origin}/auth/callback`);
    const res = NextResponse.redirect(new URL('/', origin));
    res.cookies.set(TOKEN_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: COOKIE_SECURE, path: '/', maxAge: 3600 });
    res.cookies.delete(STATE_COOKIE);
    return res;
  } catch {
    return NextResponse.redirect(new URL('/?error=auth', origin));
  }
}
