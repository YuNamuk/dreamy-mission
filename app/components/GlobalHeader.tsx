/**
 * 드리미학교 홈페이지 전역 헤더 — 홈페이지(hp/header)와 동일한 고정 헤더를 mission 안에 재현.
 * 상단 고정(fixed) + 호버 드롭다운(CSS) + 방문상담 CTA. 링크는 홈페이지 절대경로(<a>, basePath 미적용).
 * 메뉴 데이터는 homepage lib/site-nav.json 스냅샷 — 홈페이지 메뉴 개편 시 함께 갱신할 것.
 */
interface NavChild { label: string; href: string }
interface NavItem { label: string; href: string | null; children: NavChild[] }

const NAV: NavItem[] = [
  { label: '학교', href: '/school', children: [
    { label: '학교 소개', href: '/school' }, { label: '교육철학', href: '/school/philosophy' },
    { label: '교육시설', href: '/facilities' }, { label: '학교 상징(SI)', href: '/brand' } ] },
  { label: '드리미교육', href: '/education', children: [
    { label: '빚음', href: '/education/bijeum' }, { label: '신앙교육', href: '/education/faith' },
    { label: '3P 교육', href: '/education/3p' }, { label: '생활교육', href: '/education/life' },
    { label: '편제표', href: '/education/schedule' }, { label: '수업 아카이브', href: '/archive' },
    { label: '학기별 전시', href: '/terms' }, { label: '아카이브 소식', href: '/news' } ] },
  { label: '입학', href: '/admission', children: [
    { label: '입학 안내', href: '/admission' }, { label: '고등학교 입학전형', href: '/admission/high' },
    { label: '중학교 입학전형', href: '/admission/middle' }, { label: '입학전형 공고문', href: '/admission/notice' },
    { label: '입학설명회', href: '/admission/session' }, { label: '방문상담 신청', href: '/admission/consult' },
    { label: '체험캠프', href: '/admission/camp' } ] },
  { label: '드리미광장', href: '/plaza', children: [
    { label: '공지사항', href: '/plaza/notice-legacy' }, { label: '영상 갤러리', href: '/plaza/videos' },
    { label: '사진 갤러리', href: '/plaza/photos' }, { label: 'Dreamy Books', href: '/plaza/activities/dreamy-books' },
    { label: '3P Festival', href: '/plaza/activities/3p-festival' }, { label: '학생들의 활동 내용', href: '/plaza/activities' },
    { label: '학생자치기구', href: '/plaza/student-groups' }, { label: '드리미 소식지', href: '/plaza/newsletter' } ] },
  { label: '교육선교', href: '/mission', children: [
    { label: '교육선교 홈', href: '/mission' }, { label: '소개 (About)', href: '/mission/about' },
    { label: '선교지 (Missions)', href: '/mission/missions' }, { label: '스토리', href: '/mission/stories' },
    { label: '갤러리', href: '/mission/gallery' }, { label: '함께하기 (후원·파트너)', href: '/mission/support' } ] },
  { label: '학부모 공간', href: null, children: [
    { label: '학부모 소식지', href: '/plaza/newsletter' }, { label: '학생 시스템', href: 'https://stu.dreamyedu.net' } ] },
  { label: 'FAQ', href: '/faq', children: [] },
];

export function GlobalHeader() {
  return (
    <header className="ghd">
      <div className="ghd__in">
        <a href="/" className="ghd__brand" aria-label="드리미학교 홈">
          <span className="ghd__mark" aria-hidden>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M4 8l8-5 8 5-8 5-8-5Z" strokeLinejoin="round" strokeLinecap="round" /></svg>
          </span>
          <span className="ghd__name">드리미학교 <i>DREAMY SCHOOL</i></span>
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
        <a href="/admission/consult" className="ghd__cta">방문상담 신청</a>
      </div>
    </header>
  );
}
