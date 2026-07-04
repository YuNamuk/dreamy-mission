/**
 * 사이트 설정 (전체 관리자 전용) — 기본값 + Supabase(archive_content id='__settings__') 오버레이.
 */
import 'server-only';
import { supabase } from './supabase';
import { CONTENT_TABLE } from './content';
import { BASE_LOCALE, overlay, type Locale } from './i18n';

export type MapTile = 'terrain' | 'satellite' | 'simple';

export interface SiteSettings {
  mapTile: MapTile;
  tagline: string; // 대표 문구 (푸터)
  verse: string; // 대표 성경구절
  verseRef: string; // 구절 출처
  logoUrl: string | null; // 컬러 로고 (헤더)
  logoWhiteUrl: string | null; // 흰색 로고 (푸터)
}

export const SETTINGS_KEY = '__settings__';

export const SETTINGS_DEFAULT: SiteSettings = {
  mapTile: 'terrain',
  tagline: '드리미학교 교육선교 아카이브 · 선교를 그리다',
  verse: '너희는 세상의 빛이라… 너희 착한 행실을 보고 하늘에 계신 너희 아버지께 영광을 돌리게 하라',
  verseRef: '마태복음 5:14–16',
  logoUrl: null,
  logoWhiteUrl: null,
};

const SETTINGS_I18N: Record<Locale, Partial<SiteSettings>> = {
  en: {
    tagline: 'Dreamy School Education Mission Archive · Drawing the Mission',
    verse: 'Ye are the light of the world… let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven',
    verseRef: 'Matthew 5:14–16',
  },
};

export async function getSettings(locale: Locale = BASE_LOCALE): Promise<SiteSettings> {
  let base = SETTINGS_DEFAULT;
  let dbI18n: Record<string, unknown> | undefined;
  if (supabase) {
    try {
      const { data } = await supabase.from(CONTENT_TABLE).select('data').eq('id', SETTINGS_KEY).limit(1);
      const e = (data?.[0]?.data ?? {}) as Partial<SiteSettings> & { i18n?: Record<string, unknown> };
      base = {
        mapTile: (['terrain', 'satellite', 'simple'] as const).includes(e.mapTile as MapTile) ? (e.mapTile as MapTile) : SETTINGS_DEFAULT.mapTile,
        tagline: e.tagline ?? SETTINGS_DEFAULT.tagline,
        verse: e.verse ?? SETTINGS_DEFAULT.verse,
        verseRef: e.verseRef ?? SETTINGS_DEFAULT.verseRef,
        logoUrl: e.logoUrl ?? SETTINGS_DEFAULT.logoUrl,
        logoWhiteUrl: e.logoWhiteUrl ?? SETTINGS_DEFAULT.logoWhiteUrl,
      };
      dbI18n = e.i18n;
    } catch {
      base = SETTINGS_DEFAULT;
    }
  }
  if (locale === BASE_LOCALE) return base;
  let out = overlay(base, SETTINGS_I18N[locale]);
  out = overlay(out, dbI18n?.[locale]);
  return out;
}

export async function loadSettingsEdit(): Promise<Partial<SiteSettings>> {
  if (!supabase) return {};
  const { data } = await supabase.from(CONTENT_TABLE).select('data').eq('id', SETTINGS_KEY).limit(1);
  return (data?.[0]?.data as Partial<SiteSettings>) ?? {};
}
