/**
 * 다국어(i18n) 엔진 — ko 기본, en부터 시작하되 mn·km·id 등으로 확장 가능.
 *
 * 콘텐츠 번역은 각 콘텐츠 문서에 `i18n[locale]`(같은 모양의 부분 오버레이)을 두고,
 * `overlay(base, patch)`로 기본(ko) 위에 덮어쓴다. 없으면 ko로 폴백.
 * UI 고정 문구는 아래 UI 사전으로 번역한다.
 */
import 'server-only';
import { cookies, headers } from 'next/headers';
import { BASE_LOCALE, LOCALES, LANG_COOKIE, type Locale } from './locales';

export { BASE_LOCALE, LOCALES, LOCALE_LABEL, LOCALE_SHORT, LANG_COOKIE, type Locale } from './locales';

/** 쿠키(수동 선택) → 브라우저 Accept-Language → 기본(ko) */
export async function getLocale(): Promise<Locale> {
  try {
    const chosen = (await cookies()).get(LANG_COOKIE)?.value;
    if (chosen && LOCALES.includes(chosen)) return chosen;
    const al = (await headers()).get('accept-language') ?? '';
    for (const part of al.split(',')) {
      const code = part.trim().split(';')[0].split('-')[0].toLowerCase();
      if (LOCALES.includes(code)) return code;
    }
  } catch {
    /* 정적 렌더 등에서 헤더 불가 시 기본 */
  }
  return BASE_LOCALE;
}

/**
 * 기본(ko) 객체 위에 번역 patch(같은 모양의 부분값)를 덮어쓴다.
 * - 배열: index 정렬로 재귀
 * - 객체: patch 에 있는 키만 재귀
 * - 원시: patch 가 비어있지 않은 문자열일 때만 교체(그 외 ko 유지)
 */
export function overlay<T>(base: T, patch: unknown): T {
  if (patch === undefined || patch === null) return base;
  if (Array.isArray(base)) {
    const pa = Array.isArray(patch) ? patch : [];
    return base.map((item, i) => overlay(item, pa[i])) as unknown as T;
  }
  if (base && typeof base === 'object') {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    if (patch && typeof patch === 'object') {
      for (const k of Object.keys(patch as Record<string, unknown>)) {
        out[k] = overlay((base as Record<string, unknown>)[k], (patch as Record<string, unknown>)[k]);
      }
    }
    return out as unknown as T;
  }
  return (typeof patch === 'string' && patch.trim() ? (patch as unknown as T) : base);
}

/** UI 고정 문구 사전. 없는 로케일 키는 en → ko 순으로 폴백. */
const UI: Record<string, Record<string, string>> = {
  'cta.detail': { ko: '자세히 보기 →', en: 'View details →' },
  'cta.stories': { ko: '선교 이야기 보기', en: 'View mission stories' },
  'label.chronicle': { ko: '연혁 · Chronicle', en: 'Chronicle' },
  'label.categories': { ko: '전시 카테고리 · Categories', en: 'Categories' },
  'cta.backToMap': { ko: '지도로 돌아가기', en: 'Back to map' },
  'label.visits': { ko: '교육선교 방문 · Mission Visits', en: 'Mission Visits' },
  'label.visitsHint': { ko: '— 눌러서 사진 보기', en: '— tap to view photos' },
  'status.inProgress': { ko: '진행 중', en: 'In progress' },
  'label.journey': { ko: '선교 발자취', en: 'Mission Journey' },
  'nav.prev': { ko: '← 이전', en: '← Prev' },
  'nav.next': { ko: '다음 →', en: 'Next →' },
  'nav.allMissions': { ko: '선교지 전체', en: 'All Fields' },
  'auth.login': { ko: '드리미로 로그인', en: 'Sign in with Dreamy' },
  'auth.logout': { ko: '로그아웃', en: 'Sign out' },
  'auth.admin': { ko: '관리자', en: 'Admin' },
  'stories.empty': { ko: '아직 등록된 이야기가 없습니다. 학생들의 소감문과 계획서가 이곳에 차차 담깁니다.', en: 'No stories yet. Student reflections and plans will be gathered here over time.' },
  'facts.capital': { ko: '수도', en: 'Capital' },
  'facts.pop': { ko: '인구', en: 'Population' },
  'facts.area': { ko: '면적', en: 'Area' },
  'facts.language': { ko: '언어', en: 'Language' },
  'facts.religion': { ko: '종교', en: 'Religion' },
  'facts.government': { ko: '정치체제', en: 'Government' },
  'facts.currency': { ko: '통화', en: 'Currency' },
  'facts.climate': { ko: '기후', en: 'Climate' },
  'facts.timezone': { ko: '시차', en: 'Time zone' },
  'footer.tagline': { ko: '드리미학교 교육선교 아카이브', en: 'Dreamy School Education Mission Archive' },
  'story.kind.소감문': { ko: '소감문', en: 'Reflection' },
  'story.kind.계획서': { ko: '계획서', en: 'Plan' },
  'story.kind.이야기': { ko: '이야기', en: 'Story' },
};

/** UI 문구 번역기 생성 */
export function makeT(locale: Locale) {
  return (key: string): string => {
    const e = UI[key];
    if (!e) return key;
    return e[locale] ?? e[BASE_LOCALE] ?? key;
  };
}
