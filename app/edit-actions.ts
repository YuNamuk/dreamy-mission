'use server';

/**
 * 학생 편집 저장 — 로그인(드리미 세션) 검증 후 Supabase(app_3)에 upsert.
 * 공개 열람자는 이 액션을 부를 수 없다(세션 없으면 거부).
 */
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/session';
import { supabase } from '@/lib/supabase';
import { CONTENT_TABLE, type CountryEdit } from '@/lib/content';
import { findCountry } from '@/lib/countries';

export interface SaveResult {
  ok: boolean;
  error?: string;
  needsTable?: boolean;
}

export async function saveCountryEdit(
  countryId: string,
  patch: { intro?: string; themes?: { t?: string; d?: string }[]; images?: Record<string, string> },
): Promise<SaveResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: '로그인이 필요합니다. (드리미학교 구성원만 편집 가능)' };
  if (!findCountry(countryId)) return { ok: false, error: '알 수 없는 국가입니다.' };
  if (!supabase) return { ok: false, error: '백엔드가 아직 연결되지 않았습니다.' };

  // 기존 편집본과 병합(다른 필드 보존).
  const { data: existingRows } = await supabase.from(CONTENT_TABLE).select('data').eq('id', countryId).limit(1);
  const existing: CountryEdit = (existingRows?.[0]?.data as CountryEdit) ?? {};

  const merged: CountryEdit = {
    ...existing,
    ...(patch.intro !== undefined ? { intro: patch.intro } : {}),
    ...(patch.themes ? { themes: patch.themes } : {}),
    ...(patch.images ? { images: { ...(existing.images ?? {}), ...patch.images } } : {}),
  };

  const { error } = await supabase.from(CONTENT_TABLE).upsert(
    { id: countryId, data: merged, updated_by: user.sub, updated_at: new Date().toISOString() },
    { onConflict: 'id' },
  );

  if (error) {
    // 테이블 미생성(PGRST205 등)이면 콘솔 안내.
    const needsTable = /schema cache|does not exist|PGRST205|relation/i.test(error.message);
    return {
      ok: false,
      needsTable,
      error: needsTable
        ? `아직 저장 테이블이 없어요. 포털 백엔드 카드에서 '${CONTENT_TABLE}' 테이블을 만들어 주세요.`
        : `저장 실패: ${error.message}`,
    };
  }

  revalidatePath(`/${countryId}`);
  revalidatePath('/');
  return { ok: true };
}
