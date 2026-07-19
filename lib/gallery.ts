/**
 * 교육선교 갤러리 — 시즌(방문 시기)별 예쁜 사진 전시.
 * archive_content id='gallery' 의 data.seasons 에 배열로 저장. 없으면 기존 업로드 이미지로 더미 시드.
 *
 * Season = { id, title, date?, country?(국가 id로 나라 페이지 연동), cover?, photos[] }
 */
import 'server-only';
import { supabase } from './supabase';
import { CONTENT_TABLE } from './content';
import { COUNTRIES } from './countries';
import { resolvePhoto } from './photos';
import { BASE_LOCALE, overlay, type Locale } from './i18n';

export interface Season {
  id: string;
  title: string;
  date?: string;
  /** 국가 id (선택) — 나라 페이지와 연동 */
  country?: string;
  /** 대표 커버 URL (없으면 photos[0]) */
  cover?: string;
  photos: string[];
}

export const GALLERY_KEY = 'gallery';

/** 기존 업로드 이미지로 만드는 더미 시드 (관리자에서 일괄 삭제 후 재구성 전까지 노출) */
function seedSeasons(locale: Locale): Season[] {
  return COUNTRIES.map((c) => {
    const slots = [`card-${c.id}`, `th-${c.id}-1`, `th-${c.id}-2`, `th-${c.id}-3`, `th-${c.id}-4`, `th-${c.id}-5`];
    const photos = slots.map((s) => resolvePhoto(s)).filter((u): u is string => !!u);
    const name = locale === BASE_LOCALE ? c.ko : c.en;
    return {
      id: `seed-${c.id}`,
      title: locale === BASE_LOCALE ? `${name} 교육선교` : `${name} Education Mission`,
      date: '샘플',
      country: c.id,
      cover: photos[0],
      photos,
    };
  }).filter((s) => s.photos.length > 0);
}

export async function getGallery(locale: Locale = BASE_LOCALE): Promise<Season[]> {
  if (!supabase) return seedSeasons(locale);
  try {
    const { data } = await supabase.from(CONTENT_TABLE).select('data').eq('id', GALLERY_KEY).limit(1);
    const doc = data?.[0]?.data as { seasons?: Season[]; i18n?: Record<string, { seasons?: Partial<Season>[] }> } | undefined;
    if (!doc || !Array.isArray(doc.seasons)) return seedSeasons(locale); // 편집 이력 없음 → 더미
    const seasons = doc.seasons;
    if (locale === BASE_LOCALE) return seasons;
    return overlay(seasons, doc.i18n?.[locale]?.seasons);
  } catch {
    return seedSeasons(locale);
  }
}

/** 관리자 편집용 원본(오버레이 미적용) */
export async function loadGalleryRaw(): Promise<{ seasons: Season[]; isSeed: boolean }> {
  if (!supabase) return { seasons: seedSeasons(BASE_LOCALE), isSeed: true };
  const { data } = await supabase.from(CONTENT_TABLE).select('data').eq('id', GALLERY_KEY).limit(1);
  const doc = data?.[0]?.data as { seasons?: Season[] } | undefined;
  if (!doc || !Array.isArray(doc.seasons)) return { seasons: seedSeasons(BASE_LOCALE), isSeed: true };
  return { seasons: doc.seasons, isSeed: false };
}
