/**
 * 드리미학교 홈페이지 전역 헤더 — 홈페이지(hp/header)와 같은 고정 헤더를 mission 안에 재현.
 * 상단 고정(fixed) + 호버 드롭다운(CSS) + 수업 검색 + 방문상담 CTA. 링크는 홈페이지 절대경로(<a>).
 *
 * ⚠ 메뉴는 **홈페이지에서 읽어 온다**(`/api/site-nav`). 예전에는 손으로 복사한 스냅샷을 썼는데,
 * 홈페이지에서 공지사항을 숨기고 3P Festival 을 옮긴 뒤 두 헤더가 갈라졌다(2026-08-22 사용자 지적).
 * 아래 NAV_FALLBACK 은 **연결이 안 될 때만** 쓰는 대비다 — 여기를 고쳐 맞추려 하지 말 것.
 */
interface NavChild { label: string; href: string }
interface NavItem { label: string; href: string | null; children: NavChild[] }

// 연결이 안 될 때만 쓰는 대비(홈페이지 메뉴의 옛 스냅샷)
const NAV_FALLBACK: NavItem[] = [
  { label: '학교', href: '/school', children: [
    { label: '학교 소개', href: '/school' }, { label: '교육철학', href: '/school/philosophy' }, { label: '교육시설', href: '/facilities' }, { label: '학교 상징(SI)', href: '/brand' } ] },
  { label: '드리미교육', href: '/education', children: [
    { label: '빚음', href: '/education/bijeum' }, { label: '신앙교육', href: '/education/faith' }, { label: '3P 교육', href: '/education/3p' }, { label: '생활교육', href: '/education/life' }, { label: '편제표', href: '/education/schedule' }, { label: '수업 아카이브', href: '/archive' }, { label: '학기별 전시', href: '/terms' } ] },
  { label: '입학', href: '/admission', children: [
    { label: '고등학교 입학전형 안내', href: '/admission/high' }, { label: '중학교 입학전형 안내', href: '/admission/middle' }, { label: '입학전형 공고문', href: '/admission/notice' }, { label: '입학설명회', href: '/admission/session' }, { label: '방문상담 신청', href: '/admission/consult' }, { label: '드리미학교 체험캠프', href: '/admission/camp' } ] },
  { label: '드리미광장', href: '/plaza', children: [
    { label: '공지사항', href: '/plaza/notice' }, { label: '영상 갤러리', href: '/plaza/videos' }, { label: '사진 갤러리', href: '/plaza/photos' }, { label: 'Dreamy Books', href: '/plaza/activities/dreamy-books' }, { label: '3P Festival', href: '/plaza/activities/3p-festival' }, { label: '학생들의 활동 내용', href: '/plaza/activities' }, { label: '학생자치기구', href: '/plaza/student-groups' }, { label: '드리미 소식지', href: '/plaza/newsletter' } ] },
  { label: '교육선교', href: '/mission', children: [
    { label: '교육선교 홈', href: '/mission' }, { label: '소개 (About)', href: '/mission/about' }, { label: '선교지 (Missions)', href: '/mission/missions' }, { label: '스토리', href: '/mission/stories' }, { label: '갤러리', href: '/mission/gallery' }, { label: '함께하기 (후원·파트너)', href: '/mission/support' } ] },
  { label: '학부모 공간', href: '/together', children: [
    { label: '학부모 공간 홈', href: '/together' }, { label: '학부모 소식지', href: '/plaza/newsletter' }, { label: '아카이브 소식', href: '/news' }, { label: '학생 시스템', href: 'https://stu.dreamyedu.net' } ] },
  { label: 'FAQ', href: '/faq', children: [
     ] },
];

import MissionUtils, { type UtilCountry } from './MissionUtils';
import type { DreamiUser } from '@/lib/dreami';

const HOMEPAGE = process.env.NEXT_PUBLIC_HOMEPAGE_ORIGIN || 'https://dreamyedu.vercel.app';

/** 홈페이지에서 메뉴를 읽어 온다. 실패하면 옛 스냅샷으로 버틴다(헤더가 사라지지 않게). */
async function loadNav(): Promise<NavItem[]> {
  try {
    const r = await fetch(`${HOMEPAGE}/api/site-nav`, { next: { revalidate: 300 } });
    if (!r.ok) return NAV_FALLBACK;
    const j = (await r.json()) as { items?: NavItem[] };
    return Array.isArray(j.items) && j.items.length ? j.items : NAV_FALLBACK;
  } catch {
    return NAV_FALLBACK;
  }
}

export async function GlobalHeader({ user = null, locale = 'ko', countries = [] }: { user?: DreamiUser | null; locale?: string; countries?: UtilCountry[] } = {}) {
  const NAV = await loadNav();
  return (
    <header className="ghd">
      <div className="ghd__in">
        <a href="/" className="ghd__brand" aria-label="드리미학교 홈">
          {/* 홈페이지와 동일한 Dreamy School 로고 (site-settings.logo) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy" src="https://efrgphjvpatsprhazirk.supabase.co/storage/v1/object/public/class-images/homepage/live/442057207162213b7cddd0594f001b0b33efd738-1280x229.png" alt="Dreamy School" className="ghd__logo" />
        </a>
        <nav className="ghd__nav" aria-label="드리미학교 전체 메뉴">
          {NAV.map((m) => (
            <div key={m.label} className="ghd__dd">
              <a href={m.href ?? m.children[0]?.href ?? '#'} className={`ghd__link${m.label === '교육선교' ? ' is-active' : ''}`}>{m.label}</a>
              {m.children.length > 0 && (
                <div className="ghd__panel">
                  {m.children.map((c) => (
                    <a key={c.href} href={c.href} className="ghd__plink" target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noopener' : undefined}>{c.label}</a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="ghd__right">
          {/* 홈페이지 헤더와 같은 순서 — 수업 검색 · 방문상담 · 유틸 */}
          <a href="/archive" className="ghd__search" aria-label="수업 검색">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <span>수업 검색</span>
          </a>
          <a href="/admission/consult" className="ghd__cta">방문상담 신청</a>
          <MissionUtils user={user} locale={locale} countries={countries} />
        </div>
      </div>
    </header>
  );
}
