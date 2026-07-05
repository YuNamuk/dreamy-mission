/**
 * 표시 콘텐츠 로더 — 시드(lib/countries.ts) 위에 Supabase(app_3) 편집본을 덮어쓴다.
 *
 * - 공개 열람: 로그인 불필요. Supabase 편집본이 있으면 반영, 없으면(테이블 미생성 포함) 시드 그대로.
 * - 학생 편집: 로그인 후 app/edit-actions.ts 의 서버액션이 Supabase 에 저장 → 여기로 반영.
 *
 * 테이블(포털 백엔드 카드 → 테이블에서 생성):
 *   archive_content ( id text primary key, data jsonb not null default '{}',
 *                     updated_by text, updated_at timestamptz default now() )
 * 없어도 사이트는 시드로 정상 동작한다.
 */
import { supabase } from './supabase';
import { COUNTRIES, LATLNG, SEED_ADDRESS, type Country } from './countries';
import { COUNTRY_I18N } from './countries.en';
import { BASE_LOCALE, overlay, type Locale } from './i18n';

export const CONTENT_TABLE = 'archive_content';

/** 교육선교 방문 갤러리(시기별) */
export interface Visit {
  id: string;
  label: string;
  date?: string;
  photos: string[];
  /** 대표(커버) 사진 URL — 없으면 photos[0] */
  cover?: string;
}

/** 편집 가능한 필드만 담는 오버레이 */
export interface CountryEdit {
  intro?: string;
  themes?: { t?: string; d?: string }[];
  timeline?: { y: string; items: string[] }[];
  stats?: { capital?: string; pop?: string; area?: string; religion?: string; language?: string; government?: string; currency?: string; climate?: string; timezone?: string };
  /** 슬롯 id → 이미지 URL */
  images?: Record<string, string>;
  /** 카테고리(테마 index) → 갤러리 사진 URL 배열 (관리자 업로드) */
  catPhotos?: Record<string, string[]>;
  /** 방문 시기별 갤러리 */
  visits?: Visit[];
  /** 사역지 주소(관리자 입력) */
  address?: string;
  /** 주소 지오코딩 결과 좌표 [위도, 경도] */
  latlng?: [number, number];
  /** 언어별 번역 오버레이: locale → 같은 모양의 부분값(intro/stats/themes/timeline …) */
  i18n?: Record<string, unknown>;
}

/** 국가 콘텐츠에 언어 오버레이 적용 (base=ko 병합 결과 위에 시드 EN → DB 번역 순으로) */
function localizeCountry(base: Country, edit: CountryEdit | undefined, locale: Locale): Country {
  if (locale === BASE_LOCALE) return base;
  let out = overlay(base, COUNTRY_I18N[base.id]?.[locale]);
  out = overlay(out, (edit?.i18n as Record<string, unknown> | undefined)?.[locale]);
  return out;
}

export type EditMap = Record<string, CountryEdit>;

/** Supabase 에서 편집본 전체를 읽는다. 테이블 없거나 오류면 빈 맵. */
export async function loadEdits(): Promise<{ edits: EditMap; tableReady: boolean }> {
  if (!supabase) return { edits: {}, tableReady: false };
  const { data, error } = await supabase.from(CONTENT_TABLE).select('id, data');
  if (error) {
    // PGRST205 = 테이블 미생성. 그 외 오류도 시드로 폴백.
    return { edits: {}, tableReady: false };
  }
  const edits: EditMap = {};
  for (const row of (data ?? []) as { id: string; data: CountryEdit }[]) {
    edits[row.id] = row.data ?? {};
  }
  return { edits, tableReady: true };
}

/** 시드 + 편집본 병합 */
function merge(base: Country, edit?: CountryEdit): Country {
  if (!edit) return { ...base, address: SEED_ADDRESS[base.id] ?? '', site: LATLNG[base.id] };
  return {
    ...base,
    intro: edit.intro ?? base.intro,
    capital: edit.stats?.capital ?? base.capital,
    pop: edit.stats?.pop ?? base.pop,
    area: edit.stats?.area ?? base.area,
    religion: edit.stats?.religion ?? base.religion,
    language: edit.stats?.language ?? base.language,
    government: edit.stats?.government ?? base.government,
    currency: edit.stats?.currency ?? base.currency,
    climate: edit.stats?.climate ?? base.climate,
    timezone: edit.stats?.timezone ?? base.timezone,
    // 편집본에 themes 가 있으면 그 개수를 따른다(카테고리 추가/삭제 지원). 없으면 시드.
    themes: (edit.themes && edit.themes.length
      ? edit.themes.map((th, i) => ({
          t: th.t ?? base.themes[i]?.t ?? '',
          hint: base.themes[i]?.hint ?? '',
          d: th.d ?? base.themes[i]?.d ?? '',
        }))
      : base.themes),
    timeline: edit.timeline && edit.timeline.length ? edit.timeline : base.timeline,
    address: edit.address ?? SEED_ADDRESS[base.id] ?? '',
    site: (Array.isArray(edit.latlng) && edit.latlng.length === 2 ? edit.latlng : LATLNG[base.id]) as [number, number] | undefined,
  };
}

/** 특정 국가의 원본 편집본(오버레이) 로드 — 관리자 편집기 프리필용. */
export async function loadCountryEdit(id: string): Promise<CountryEdit> {
  if (!supabase) return {};
  const { data } = await supabase.from(CONTENT_TABLE).select('data').eq('id', id).limit(1);
  return ((data?.[0]?.data as CountryEdit) ?? {});
}

/** 국가 편집본 병합 저장(부분 패치). 관리자/편집 서버액션에서 호출. */
export async function applyCountryEdit(
  id: string,
  patch: Partial<CountryEdit>,
  updatedBy: string,
): Promise<{ ok: boolean; error?: string; needsTable?: boolean }> {
  if (!supabase) return { ok: false, error: '백엔드가 연결되지 않았습니다.' };
  const existing = await loadCountryEdit(id);
  const merged: CountryEdit = {
    ...existing,
    ...(patch.intro !== undefined ? { intro: patch.intro } : {}),
    ...(patch.themes ? { themes: patch.themes } : {}),
    ...(patch.timeline ? { timeline: patch.timeline } : {}),
    ...(patch.stats ? { stats: { ...(existing.stats ?? {}), ...patch.stats } } : {}),
    ...(patch.images ? { images: { ...(existing.images ?? {}), ...patch.images } } : {}),
    ...(patch.catPhotos ? { catPhotos: patch.catPhotos } : {}),
    ...(patch.visits ? { visits: patch.visits } : {}),
    ...(patch.address !== undefined ? { address: patch.address } : {}),
    ...(patch.latlng ? { latlng: patch.latlng } : {}),
  };
  const { error } = await supabase.from(CONTENT_TABLE).upsert(
    { id, data: merged, updated_by: updatedBy, updated_at: new Date().toISOString() },
    { onConflict: 'id' },
  );
  if (error) {
    const needsTable = /schema cache|does not exist|PGRST205|relation/i.test(error.message);
    return { ok: false, needsTable, error: needsTable ? `저장 테이블(${CONTENT_TABLE})이 없습니다.` : `저장 실패: ${error.message}` };
  }
  return { ok: true };
}

export async function getCountries(locale: Locale = BASE_LOCALE): Promise<Country[]> {
  const { edits } = await loadEdits();
  return COUNTRIES.map((c) => localizeCountry(merge(c, edits[c.id]), edits[c.id], locale));
}

export async function getCountry(id: string, locale: Locale = BASE_LOCALE): Promise<{
  country: Country | null;
  images: Record<string, string>;
  catPhotos: Record<string, string[]>;
  visits: Visit[];
} > {
  const base = COUNTRIES.find((c) => c.id === id);
  if (!base) return { country: null, images: {}, catPhotos: {}, visits: [] };
  const { edits } = await loadEdits();
  const edit = edits[id];
  const merged = localizeCountry(merge(base, edit), edit, locale);
  return { country: merged, images: edit?.images ?? {}, catPhotos: edit?.catPhotos ?? {}, visits: edit?.visits ?? [] };
}
