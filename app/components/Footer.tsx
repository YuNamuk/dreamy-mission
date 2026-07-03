/** 사이트 공통 네이비 푸터 — 로고 · 성경 구절 · SNS · 저작권. */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mark-white.png" alt="" />
          <b>Dreamy School · Missions</b>
        </div>
        <div className="site-footer__verse">
          “너희는 세상의 빛이라… 너희 착한 행실을 보고 하늘에 계신 너희 아버지께 영광을 돌리게 하라”
          <span>마태복음 5:14–16</span>
        </div>
        <div className="site-footer__meta">© 2026 Dreamy School. 드리미학교 교육선교 아카이브.</div>
      </div>
    </footer>
  );
}
