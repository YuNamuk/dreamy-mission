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
import { PHOTO_BASE } from './uploaded-photos';
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
  /** 상세 설명 */
  description?: string;
  /** 태그 */
  tags?: string[];
  /** 참여자 (예: "교사 6명, 학생 32명") */
  participants?: string;
}

export const GALLERY_KEY = 'gallery';

/** 더미 시드 — 이전에 올린 현장 사진(gal-<나라>-<주제>-<k>.jpg, 원본 비율)으로 구성 */
function seedSeasons(locale: Locale): Season[] {
  return COUNTRIES.map((c) => {
    const photos: string[] = [];
    for (let n = 1; n <= c.themes.length; n++)
      for (let k = 1; k <= 3; k++) photos.push(`${PHOTO_BASE}/gal-${c.id}-${n}-${k}.jpg`);
    const name = locale === BASE_LOCALE ? c.ko : c.en;
    const ko = locale === BASE_LOCALE;
    return {
      id: `seed-${c.id}`,
      title: ko ? `${name} 교육선교` : `${name} Education Mission`,
      date: '2026.05',
      country: c.id,
      cover: photos[0],
      photos,
      description: ko
        ? `드리미학교 학생들이 ${name}에 방문해 현지 아이들과 함께한 교육선교 현장의 사진들입니다. 배움과 나눔, 만남과 성장의 순간을 담았습니다.`
        : `Photos from the education mission where Dreamy School students visited ${name} and served alongside local children — moments of learning, sharing, meeting, and growth.`,
      tags: ko ? ['교육선교', name, '현장', '2026'] : ['Education Mission', name, 'Field', '2026'],
      participants: ko ? '교사·학생 교육선교팀' : 'Teacher·student mission team',
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
