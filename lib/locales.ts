/** 클라이언트/서버 공용 로케일 상수 (server-only 아님) */
export const BASE_LOCALE = 'ko';
/** 활성 로케일 — 여기에 추가하면 전환 토글에 자동 노출된다. */
export const LOCALES: string[] = ['ko', 'en'];
export type Locale = string;

export const LOCALE_LABEL: Record<string, string> = { ko: '한국어', en: 'English', mn: 'Монгол', km: 'ខ្មែរ', id: 'Bahasa' };
export const LOCALE_SHORT: Record<string, string> = { ko: 'KR', en: 'EN', mn: 'MN', km: 'KM', id: 'ID' };
export const LANG_COOKIE = 'lang';
