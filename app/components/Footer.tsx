import { getSettings } from '@/lib/settings';
import { getLocale } from '@/lib/i18n';

/** 사이트 공통 네이비 푸터 — 로고 · 대표 성경구절 · 대표 문구 (사이트 설정에서 관리). */
export default async function Footer() {
  const s = await getSettings(await getLocale());
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.logoWhiteUrl || '/mark-white.png'} alt="" />
          <b>Dreamy School · Missions</b>
        </div>
        <div className="site-footer__verse">
          “{s.verse}”
          <span>{s.verseRef}</span>
        </div>
        <div className="site-footer__meta">{s.tagline}</div>
      </div>
    </footer>
  );
}
