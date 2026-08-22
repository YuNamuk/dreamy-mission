import Link from 'next/link';
import { thumb } from '@/lib/img';
import { resolvePhoto } from '@/lib/photos';

/**
 * 교육선교 하위 페이지 공통 타이틀바 — 어느 메뉴에 있는지 한눈에 보이게.
 * 브레드크럼(홈 › 교육선교 › 현재) + 제목/설명 + 존 탭(소개·선교지·스토리·갤러리·함께하기).
 * ⚠ 홈페이지(dreamyedu.net)가 /mission/* 을 프록시하므로 홈페이지 링크는 절대경로 <a>,
 *   mission 내부 링크는 basePath 가 붙는 next/link 를 쓴다.
 */

export type MissionTab = 'home' | 'about' | 'missions' | 'stories' | 'gallery' | 'support';

const TABS: { key: MissionTab; href: string; ko: string; en: string }[] = [
  { key: 'home', href: '/', ko: '교육선교 홈', en: 'Home' },
  { key: 'about', href: '/about', ko: '소개', en: 'About' },
  { key: 'missions', href: '/missions', ko: '선교지', en: 'Missions' },
  { key: 'stories', href: '/stories', ko: '스토리', en: 'Stories' },
  { key: 'gallery', href: '/gallery', ko: '갤러리', en: 'Gallery' },
  { key: 'support', href: '/support', ko: '함께하기', en: 'Together' },
];

/** 메뉴별 타이틀 이미지(사진 슬롯) — 없으면 카드 사진으로 폴백. */
const TITLE_PHOTO: Record<string, string[]> = {
  home: ['card-mongolia'],
  about: ['draw-faith', 'th-mongolia-3', 'card-mongolia'],            // 신앙·빚음
  missions: ['draw-education', 'card-india', 'th-india-1'],           // 교육
  stories: ['th-philippines-5', 'draw-community', 'card-philippines'], // 학생들의 이야기
  gallery: ['th-cambodia-2', 'card-cambodia'],                        // 활동 사진
  support: ['draw-service', 'th-philippines-3', 'card-philippines'],  // 섬김·동행
  archive: ['draw-community', 'card-indonesia'],                      // 공동체
};

export default function PageTitleBar({
  eyebrow, title, subtitle, active, locale = 'ko', image,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  active?: MissionTab;
  locale?: string;
  /** 타이틀 이미지 직접 지정(미지정 시 메뉴 기본 사진) */
  image?: string | null;
}) {
  const ko = locale !== 'en';
  const photo =
    image ??
    (TITLE_PHOTO[active ?? 'home'] ?? []).map((slot) => resolvePhoto(slot)).find(Boolean) ??
    null;

  return (
    <div className={photo ? 'ptbar ptbar--img' : 'ptbar'}>
      {photo && (
        <div className="ptbar__photo" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb(photo, 1440, 62)} alt="" decoding="async" />
          <span className="ptbar__veil" />
        </div>
      )}
      <div className="section--wide ptbar__inner">
        <nav className="ptbar__crumbs" aria-label={ko ? '현재 위치' : 'Breadcrumb'}>
          <a href="/">{ko ? '홈' : 'Home'}</a>
          <span aria-hidden>›</span>
          <Link href="/">{ko ? '교육선교' : 'Missions'}</Link>
          {active && active !== 'home' && TABS.some((t) => t.key === active) && (
            <>
              <span aria-hidden>›</span>
              <strong>{ko ? TABS.find((t) => t.key === active)!.ko : TABS.find((t) => t.key === active)!.en}</strong>
            </>
          )}
        </nav>

        {eyebrow && <div className="ptbar__eyebrow">{eyebrow}</div>}
        <h1 className="ptbar__title">{title}</h1>
        {subtitle && <p className="ptbar__sub">{subtitle}</p>}

        <nav className="ptbar__tabs" aria-label={ko ? '교육선교 메뉴' : 'Missions menu'}>
          {TABS.map((t) => (
            <Link key={t.key} href={t.href} className={`ptbar__tab${active === t.key ? ' is-on' : ''}`} aria-current={active === t.key ? 'page' : undefined}>
              {ko ? t.ko : t.en}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
