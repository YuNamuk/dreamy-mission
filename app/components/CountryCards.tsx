import Link from 'next/link';
import { getCountries } from '@/lib/content';
import { getHome } from '@/lib/home';
import { resolvePhoto } from '@/lib/photos';
import { getLocale, makeT } from '@/lib/i18n';
import { countrySilhouette } from '@/lib/silhouette';

const ORDER = ['mongolia', 'philippines', 'cambodia', 'indonesia', 'india', 'pakistan'];
const FLAG: Record<string, string> = {
  mongolia: '🇲🇳', philippines: '🇵🇭', cambodia: '🇰🇭', indonesia: '🇮🇩', india: '🇮🇳', pakistan: '🇵🇰',
};

/**
 * 6개국 다크 포토 카드.
 *  - 기본(strip): 홈·아카이브의 6열 띠
 *  - wide: 선교지 페이지용 2열 대형 카드 — 나라별로 한눈에 보이도록 기간·한 줄 소개·테마 키워드까지
 */
export default async function CountryCards({ variant = 'strip' }: { variant?: 'strip' | 'wide' }) {
  const locale = await getLocale();
  const t = makeT(locale);
  const [countries, home] = await Promise.all([getCountries(locale), getHome(locale)]);
  const byId = Object.fromEntries(countries.map((c) => [c.id, c]));
  const wide = variant === 'wide';

  return (
    <div className={wide ? 'country-cards country-cards--wide' : 'country-cards'}>
      {ORDER.map((id) => {
        const c = byId[id];
        if (!c) return null;
        const img = home.cardImages?.[id] ?? resolvePhoto(`card-${id}`) ?? resolvePhoto(`th-${id}-1`);

        // ── 선교지 페이지: 글 패널 | 사진 을 좌우로 나눈 카드(글이 사진 위에 얹히지 않게) ──
        if (wide) {
          const d = countrySilhouette(id);
          // 테마 제목은 "이름 — 설명" 형태 → 칩에는 앞부분만
          const chips = (c.themes ?? []).slice(0, 3).map((th) => th.t.split('—')[0].trim());
          return (
            <Link key={id} href={`/${id}`} className="wcard">
              <div className="wcard__body">
                {d && (
                  <svg className="wcard__silo" viewBox="0 0 100 100" aria-hidden focusable="false"><path d={d} /></svg>
                )}
                <div className="wcard__head">
                  <span className="wcard__flag" aria-hidden>{FLAG[id]}</span>
                  <span className="wcard__en">{locale === 'ko' ? c.en : c.ko}</span>
                </div>
                <h3 className="wcard__ko">
                  {locale === 'ko' ? c.ko : c.en}
                  {c.years && <em>{c.years}</em>}
                </h3>
                <p className="wcard__desc">{home.taglines[id]}</p>
                {chips.length > 0 && (
                  <ul className="wcard__chips">
                    {chips.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                )}
                <span className="wcard__go">{t('cta.detail')}</span>
              </div>
              <div className="wcard__shot">
                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img loading="lazy" src={img} alt="" />
                )}
              </div>
            </Link>
          );
        }

        return (
          <Link key={id} href={`/${id}`} className="ccard">
            {img && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img loading="lazy" src={img} alt="" className="ccard__img" />
                <span className="ccard__scrim" />
              </>
            )}
            <span className="ccard__en">{locale === 'ko' ? c.en : c.ko}</span>
            <span className="ccard__ko">{locale === 'ko' ? c.ko : c.en}</span>
            <span className="ccard__desc">{home.taglines[id]}</span>
            <span className="ccard__go">{t('cta.detail')}</span>
          </Link>
        );
      })}
    </div>
  );
}
