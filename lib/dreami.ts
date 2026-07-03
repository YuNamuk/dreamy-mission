/**
 * "드리미로 로그인" — 드리미학교 포털 OAuth2(Authorization Code) / OpenID Connect.
 * client_secret 이 서버 env 에 주입돼 있으므로 서버사이드 confidential 흐름을 쓴다(안전).
 *
 * 흐름:
 *   1) /api/auth/login   → 포털 authorize 로 보냄(state 쿠키로 CSRF 방지)
 *   2) /auth/callback    → code 를 토큰으로 교환 → access_token 을 httpOnly 쿠키에 저장
 *   3) getUser()         → access_token 으로 userinfo 조회(현재 로그인 사용자)
 *
 * 포털이 redirect_uri 를 "<앱주소>/auth/callback" 으로 등록한다 — 그래서 콜백 라우트가 거기 있어야 한다.
 */
import 'server-only';

export const ISSUER = (process.env.DREAMI_ISSUER || 'https://stu.dreamyedu.net').replace(/\/+$/, '');
export const CLIENT_ID = process.env.DREAMI_CLIENT_ID || '';
const CLIENT_SECRET = process.env.DREAMI_CLIENT_SECRET || '';

export const TOKEN_COOKIE = 'dreami_token';
export const STATE_COOKIE = 'dreami_state';

/** 로그인 설정이 주입됐는지. */
export const dreamiReady = Boolean(CLIENT_ID && CLIENT_SECRET);

export interface DreamiUser {
  sub: string;
  email: string;
  name: string | null;
  role: 'student' | 'teacher' | 'admin' | null;
  cohort: string | null;
  picture: string | null;
}

/** 로그인 시작 URL — state 는 호출부에서 만들어 쿠키에도 저장한다. */
export function authorizeUrl(redirectUri: string, state: string): string {
  const q = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    state,
  });
  return `${ISSUER}/oauth/authorize?${q.toString()}`;
}

/** 인가 코드 → access_token. 실패 시 throw. */
export async function exchangeCode(code: string, redirectUri: string): Promise<string> {
  const res = await fetch(`${ISSUER}/api/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    cache: 'no-store',
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  const data = (await res.json()) as { access_token?: string; error_description?: string; error?: string };
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || `토큰 교환 실패 (${res.status})`);
  }
  return data.access_token;
}

/** access_token 으로 현재 사용자 조회. 토큰이 없거나 만료면 null. */
export async function fetchUser(accessToken: string): Promise<DreamiUser | null> {
  const res = await fetch(`${ISSUER}/api/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return (await res.json()) as DreamiUser;
}
