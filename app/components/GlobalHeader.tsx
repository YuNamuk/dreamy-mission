/**
 * 드리미학교 홈페이지 전역 헤더 — 교육선교(mission)가 홈페이지 디자인 안에서 서빙될 때의 상단 프레임.
 * 링크는 홈페이지 절대경로(같은 도메인 프록시 /mission/* 전제) — basePath 프리픽스를 피하려고 <a> 사용.
 */
const MENU = [
  { label: '학교', href: '/school' },
  { label: '드리미교육', href: '/education' },
  { label: '입학', href: '/admission' },
  { label: '드리미광장', href: '/plaza' },
  { label: '교육선교', href: '/mission', active: true },
  { label: 'FAQ', href: '/faq' },
];

export function GlobalHeader() {
  return (
    <div className="ghd">
      <div className="ghd__in">
        <a href="/" className="ghd__brand" aria-label="드리미학교 홈">
          <span className="ghd__mark" aria-hidden>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M4 8l8-5 8 5-8 5-8-5Z" strokeLinejoin="round" strokeLinecap="round" /></svg>
          </span>
          <span className="ghd__name">드리미학교 <i>DREAMY SCHOOL</i></span>
        </a>
        <nav className="ghd__nav" aria-label="드리미학교 전체 메뉴">
          {MENU.map((m) => (
            <a key={m.href} href={m.href} className={`ghd__link${m.active ? ' is-active' : ''}`}>{m.label}</a>
          ))}
        </nav>
      </div>
    </div>
  );
}
