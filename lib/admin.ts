/**
 * 관리자 권한.
 *  - super  (전체 관리자): 관리자 추가/삭제 + 사이트 설정
 *  - content (콘텐츠 관리자): 각 페이지 콘텐츠·사진 수정
 * 기본 전체 관리자: namoogi@dreamyedu.net (드리미 로그인=구글 워크스페이스 계정)
 */
import 'server-only';
import { getUser } from './session';
import { supabase } from './supabase';

export type AdminRole = 'super' | 'content';
export interface Admin {
  email: string;
  role: AdminRole;
}
export const DEFAULT_SUPER = 'namoogi@dreamyedu.net';

/** 현재 로그인 사용자의 관리자 정보. 관리자가 아니면 null. */
export async function getAdmin(): Promise<Admin | null> {
  const user = await getUser();
  const email = user?.email?.toLowerCase();
  if (!email) return null;
  if (email === DEFAULT_SUPER) return { email, role: 'super' };
  if (!supabase) return null;
  try {
    const { data } = await supabase.from('admins').select('email, role').eq('email', email).limit(1);
    const row = data?.[0] as { email: string; role: string } | undefined;
    if (!row) return null;
    return { email: row.email, role: row.role === 'super' ? 'super' : 'content' };
  } catch {
    return null;
  }
}

export interface AdminRow {
  email: string;
  role: AdminRole;
  name: string | null;
}
export async function listAdmins(): Promise<AdminRow[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('admins').select('email, role, name').order('created_at', { ascending: true });
  return ((data as { email: string; role: string; name: string | null }[]) ?? []).map((r) => ({
    email: r.email,
    role: r.role === 'super' ? 'super' : 'content',
    name: r.name,
  }));
}
