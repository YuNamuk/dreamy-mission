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
        return (
          <Link key={id} href={`/${id}`} className={wide ? 'ccard ccard--wide' : 'ccard'}>
            {img && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img loading="lazy" src={img} alt="" className="ccard__img" />
                <span className="ccard__scrim" />
              </>
            )}
            {wide && (() => {
              const d = countrySilhouette(id);
              return d ? (
                <svg className="ccard__silo" viewBox="0 0 100 100" aria-hidden focusable="false">
                  <path d={d} />
                </svg>
              ) : null;
            })()}
            {wide && <span className="ccard__flag" aria-hidden>{FLAG[id]}</span>}
            <span className="ccard__en">{locale === 'ko' ? c.en : c.ko}</span>
            <span className="ccard__ko">
              {locale === 'ko' ? c.ko : c.en}
              {wide && c.years && <em className="ccard__years">{c.years}</em>}
            </span>
            <span className="ccard__desc">{home.taglines[id]}</span>
            {wide && c.themes?.length > 0 && (
              <span className="ccard__chips">
                {c.themes.slice(0, 3).map((th) => <em key={th.t}>{th.t}</em>)}
              </span>
            )}
            <span className="ccard__go">{t('cta.detail')}</span>
          </Link>
        );
      })}
    </div>
  );
}
