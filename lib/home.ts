/**
 * 홈(첫 화면) 편집 콘텐츠 — 기본값 + Supabase(archive_content id='__home__') 오버레이.
 * 관리자 콘텐츠 편집에서 수정한다.
 */
import 'server-only';
import { supabase } from './supabase';
import { CONTENT_TABLE } from './content';

export interface HomeJourney {
  y: string;
  id: string;
  desc: string;
}
export interface HomeDraw {
  ko: string;
  d: string;
}
export interface HomeContent {
  heroLine1: string;
  heroLine2: string;
  heroLine3: string;
  heroSub: string;
  journey: HomeJourney[];
  taglines: Record<string, string>;
  draws: HomeDraw[]; // 4개 (아이콘은 순서 고정: 교육·공동체·섬김·신앙)
  drawsTitle: string;
  drawsSub: string;
}

export const HOME_KEY = '__home__';

export const HOME_DEFAULT: HomeContent = {
  heroLine1: '드리미학교',
  heroLine2: '',
  heroLine3: '교육선교',
  heroSub: '성공이 아닌 섬김을,\n나의 일이 아닌 하나님의 일하심을,\n선교는 사랑하는 것임을,\n배워갑니다.',
  journey: [
    { y: '2021', id: 'mongolia', desc: '밝은미래학교 협력 · 인턴 교사 파송 · 3P 교육' },
    { y: '2022', id: 'philippines', desc: '필리핀 드리미학교 건축 · 교사 훈련 · 학생 교육선교' },
    { y: '2023', id: 'cambodia', desc: 'NIBC 협력 · 드림빌 타운 프로젝트 구상' },
    { y: '2024', id: 'indonesia', desc: 'CGA 첫 만남 · 교사 26명 방한 · 40만 달러 기증' },
    { y: '2025', id: 'india', desc: '방갈로르·마니푸르 교류 · 도서관·IT·미술 교육' },
    { y: '2026', id: 'pakistan', desc: 'PGI 협력 · 고등학교 설립 · 교사연수 82명' },
  ],
  taglines: {
    mongolia: '밝은미래학교와 협력하며 3P 페스티벌·교사연수로 몽골 공교육의 성장을 돕습니다.',
    philippines: '마닐라 빈민촌에 필리핀 드리미학교를 세우고, 쓰레기산 아이들과 교육으로 함께합니다.',
    cambodia: '씨엠립 겨자씨학교·유치원과 함께하며, 교육·의료 중심의 드림빌 커뮤니티를 세웁니다.',
    indonesia: '자카르타 JIU·CGA와 교육 철학을 나누며 교사·학생 교류로 함께 자랍니다.',
    india: '방갈로르·나갈랜드·마니푸르에서 고아와 소외된 아이들의 배움의 집이 됩니다.',
    pakistan: '소수자와 기독교 공동체를 위한 대학 PGI를 세우고, 교사연수로 동역합니다.',
  },
  draws: [
    { ko: '교육', d: '배움으로 꿈을 여는 아이들' },
    { ko: '공동체', d: '함께 자라고 함께 만들어가는 공동체' },
    { ko: '섬김', d: '작은 손길이 모여 큰 변화를 만듭니다' },
    { ko: '신앙', d: '복음으로 세상을 밝히는 빛과 소금이 됩니다' },
  ],
  drawsTitle: '우리가 그리는 세상',
  drawsSub: '모든 아이들이 존중받고 배우며, 하나님의 사랑 안에서 꿈을 이루는 세상.',
};

export async function getHome(): Promise<HomeContent> {
  if (!supabase) return HOME_DEFAULT;
  try {
    const { data } = await supabase.from(CONTENT_TABLE).select('data').eq('id', HOME_KEY).limit(1);
    const e = (data?.[0]?.data ?? {}) as Partial<HomeContent>;
    return {
      heroLine1: e.heroLine1 ?? HOME_DEFAULT.heroLine1,
      heroLine2: e.heroLine2 ?? HOME_DEFAULT.heroLine2,
      heroLine3: e.heroLine3 ?? HOME_DEFAULT.heroLine3,
      heroSub: e.heroSub ?? HOME_DEFAULT.heroSub,
      journey: e.journey?.length ? e.journey : HOME_DEFAULT.journey,
      taglines: { ...HOME_DEFAULT.taglines, ...(e.taglines ?? {}) },
      draws: e.draws?.length === 4 ? e.draws : HOME_DEFAULT.draws,
      drawsTitle: e.drawsTitle ?? HOME_DEFAULT.drawsTitle,
      drawsSub: e.drawsSub ?? HOME_DEFAULT.drawsSub,
    };
  } catch {
    return HOME_DEFAULT;
  }
}

export async function loadHomeEdit(): Promise<Partial<HomeContent>> {
  if (!supabase) return {};
  const { data } = await supabase.from(CONTENT_TABLE).select('data').eq('id', HOME_KEY).limit(1);
  return (data?.[0]?.data as Partial<HomeContent>) ?? {};
}
