/**
 * STORIES — 학생 선교 소감문·계획서 목록.
 * archive_content id='stories_list' 의 data.list 에 배열로 저장. 없으면 빈 목록.
 */
import 'server-only';
import { supabase } from './supabase';
import { CONTENT_TABLE } from './content';
import { BASE_LOCALE, overlay, type Locale } from './i18n';

export interface Story {
  id: string;
  title: string;
  author?: string;
  /** 국가 id 또는 자유 라벨 */
  country?: string;
  /** 예: 2025 여름 */
  date?: string;
  /** 종류 표시용 */
  kind?: '소감문' | '계획서' | '이야기';
  body: string;
}

export const STORIES_KEY = 'stories_list';

export async function getStories(locale: Locale = BASE_LOCALE): Promise<Story[]> {
  if (!supabase) return [];
  try {
    const { data } = await supabase.from(CONTENT_TABLE).select('data').eq('id', STORIES_KEY).limit(1);
    const doc = (data?.[0]?.data ?? {}) as { list?: Story[]; i18n?: Record<string, { list?: Partial<Story>[] }> };
    const list = Array.isArray(doc.list) ? doc.list : [];
    if (locale === BASE_LOCALE) return list;
    return overlay(list, doc.i18n?.[locale]?.list);
  } catch {
    return [];
  }
}

export async function loadStoriesEdit(): Promise<Story[]> {
  return getStories();
}
