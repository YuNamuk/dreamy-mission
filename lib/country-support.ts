/** 나라별 선교편지·후원 링크 — 국가 페이지 '소식·함께하기' 섹션과 SUPPORT 페이지가 공유. */
export interface CountryLink {
  name: string;
  desc: string;
  href: string;
  external?: boolean;
  kind: 'letter' | 'support';
}

export const COUNTRY_LINKS: Record<string, CountryLink[]> = {
  philippines: [
    { name: 'Dreamy School Philippines 소식', desc: '필리핀 드리미학교가 전하는 선교편지', href: 'https://same-leather-ba9.notion.site/47141aa191f747158b5ae952f344d45e', external: true, kind: 'letter' },
    { name: '장학 후원', desc: '필리핀 드리미학교 학생들의 배움을 잇는 장학 후원', href: '/together/philippines', kind: 'support' },
    { name: '어린이 그림책 후원', desc: '어린이들에게 모국어 그림책을 전하는 후원', href: '/together/picturebooks', kind: 'support' },
  ],
  cambodia: [
    { name: 'Cambodia Dream Ville 이야기', desc: '캄보디아 드림빌에서 온 소식', href: 'https://drive.google.com/file/d/1EGIzIfDaB2hvNTCgbErvZz5AzSDCh--0/view?usp=sharing', external: true, kind: 'letter' },
  ],
};

export const KIND_LABEL: Record<CountryLink['kind'], string> = { letter: '선교편지', support: '후원' };
