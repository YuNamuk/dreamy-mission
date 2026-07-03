/**
 * 현재 로그인 사용자 — 서버 컴포넌트/라우트에서 호출.
 * httpOnly 쿠키의 access_token 으로 드리미 userinfo 를 조회한다.
 */
import 'server-only';
import { cookies } from 'next/headers';
import { TOKEN_COOKIE, fetchUser, type DreamiUser } from './dreami';

export async function getUser(): Promise<DreamiUser | null> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  try {
    return await fetchUser(token);
  } catch {
    return null;
  }
}
