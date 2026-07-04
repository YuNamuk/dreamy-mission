/**
 * 범용 정적 페이지 콘텐츠 (ABOUT·STORIES·MISSIONS·ARCHIVE) — 기본값 + Supabase 오버레이.
 * archive_content id = 'page_<key>'.
 */
import 'server-only';
import { supabase } from './supabase';
import { CONTENT_TABLE } from './content';
import { BASE_LOCALE, overlay, type Locale } from './i18n';

export interface PageSection {
  heading: string;
  body: string;
}
export interface PageContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: PageSection[];
}

export type PageKey = 'about' | 'stories' | 'missions' | 'archive';
export const PAGE_KEYS: PageKey[] = ['about', 'stories', 'missions', 'archive'];
export const PAGE_LABEL: Record<PageKey, string> = { about: 'ABOUT · 소개', stories: 'STORIES · 이야기', missions: 'MISSIONS · 선교지', archive: 'ARCHIVE · 아카이브' };

const DEFAULTS: Record<PageKey, PageContent> = {
  about: {
    eyebrow: 'About · Missio Dei',
    title: '선교를 그리다',
    subtitle: '우리는 가만히 서서, 비어 있지 않은 공간(間)에 대하여',
    sections: [
      { heading: '행하기에 앞서, 보는 것', body: '교육선교는 우리가 무언가를 하러 가는 일이 아니다. 우리가 그 땅에 닿기 전에, 하나님은 이미 그곳에서 일하고 계셨다. 선교는 그 일하심을 바라보고 그 흐름에 참여하는 것 — 행하기에 앞서 보는 것이다.' },
      { heading: '“가만히 서서 보라”', body: '“너희는 두려워하지 말고 가만히 서서 여호와께서 오늘 너희를 위하여 행하시는 구원을 보라” (출애굽기 14:13). 이 아카이브는 2022년부터 동행한 여섯 나라의 이야기와, 아직 오지 않은 여정을 담는다.' },
      { heading: '드리미학교 교육선교', body: '드리미학교는 각 나라의 크리스천 리더를 양성하고, 복음의 공공성 원리에 따라 교육의 성장과 발전을 돕는다. 교사·학생 교류, 3P 교육, 인성교육, 지역 선교를 통해 다음 세대를 세운다.' },
    ],
  },
  stories: {
    eyebrow: 'Stories',
    title: '선교 이야기',
    subtitle: '동행한 여섯 나라, 그곳에서 만난 이야기들',
    sections: [
      { heading: '', body: '각 나라 페이지의 전시 카테고리와 “교육선교 방문 갤러리”에서 현장의 이야기와 사진을 만나볼 수 있습니다. 학생들의 선교 소감문과 계획서도 이곳에 차차 담아갑니다.' },
    ],
  },
  missions: {
    eyebrow: '2022 — Present · Six Lands',
    title: '선교지',
    subtitle: '한국 드리미학교에서 여섯 나라로 이어진 교육선교의 발자취',
    sections: [],
  },
  archive: {
    eyebrow: 'Archive',
    title: '교육선교 아카이브',
    subtitle: '드리미학교 배움관 1층 상설전 「선교를 그리다」',
    sections: [
      { heading: '', body: '2022년부터 이어온 여섯 나라 교육선교의 기록입니다. 아래 나라를 눌러 각 선교지의 소개·전시 카테고리·연혁·방문 갤러리를 만나보세요.' },
    ],
  },
};

/** 페이지 기본값의 영어 시드(부분 오버레이). 없는 값은 ko로 폴백. */
const DEFAULTS_I18N: Partial<Record<PageKey, Record<Locale, Partial<PageContent>>>> = {
  about: {
    en: {
      title: 'Drawing the Mission',
      subtitle: 'We stand still, and consider the space (間) that is not empty',
      sections: [
        { heading: 'Seeing, before doing', body: 'Education mission is not about us going somewhere to do something. Before we ever reached that land, God was already at work there. Mission is to behold that work and join its current — to see before we do.' },
        { heading: '“Stand still and see”', body: '“Fear not, stand still, and see the salvation of the LORD, which he will shew to you to day” (Exodus 14:13). This archive holds the stories of six lands walked since 2022, and the journeys yet to come.' },
        { heading: 'Dreamy School Education Mission', body: 'Dreamy School raises up Christian leaders in each land and, by the principle of the public nature of the gospel, helps education grow. Through teacher–student exchange, 3P education, character education, and local mission, we build the next generation.' },
      ],
    },
  },
  stories: {
    en: {
      title: 'Mission Stories',
      subtitle: 'Six lands walked together, and the stories met there',
      sections: [{ heading: '', body: 'In each country’s exhibition categories and “Mission Visit galleries,” you can meet the stories and photos from the field. Students’ mission reflections and plans will also be gathered here over time.' }],
    },
  },
  missions: {
    en: {
      title: 'Mission Fields',
      subtitle: 'The footsteps of education mission, from Dreamy School in Korea to six lands',
    },
  },
  archive: {
    en: {
      title: 'Education Mission Archive',
      subtitle: 'Permanent exhibition “Drawing the Mission,” 1F of the Dreamy School learning hall',
      sections: [{ heading: '', body: 'A record of education mission across six lands since 2022. Tap a country below to meet each field’s introduction, exhibition categories, chronicle, and visit gallery.' }],
    },
  },
};

export async function getPage(key: PageKey, locale: Locale = BASE_LOCALE): Promise<PageContent> {
  const def = DEFAULTS[key];
  let base = def;
  let dbI18n: Record<string, unknown> | undefined;
  if (supabase) {
    try {
      const { data } = await supabase.from(CONTENT_TABLE).select('data').eq('id', `page_${key}`).limit(1);
      const e = (data?.[0]?.data ?? {}) as Partial<PageContent> & { i18n?: Record<string, unknown> };
      base = {
        eyebrow: e.eyebrow ?? def.eyebrow,
        title: e.title ?? def.title,
        subtitle: e.subtitle ?? def.subtitle,
        sections: e.sections?.length ? e.sections : def.sections,
      };
      dbI18n = e.i18n;
    } catch {
      base = def;
    }
  }
  if (locale === BASE_LOCALE) return base;
  let out = overlay(base, DEFAULTS_I18N[key]?.[locale]);
  out = overlay(out, dbI18n?.[locale]);
  return out;
}

export async function loadPageEdit(key: PageKey): Promise<Partial<PageContent>> {
  if (!supabase) return {};
  const { data } = await supabase.from(CONTENT_TABLE).select('data').eq('id', `page_${key}`).limit(1);
  return (data?.[0]?.data as Partial<PageContent>) ?? {};
}
