import Link from 'next/link';
import { getUser } from '@/lib/session';
import { getCountries } from '@/lib/content';
import { getHome } from '@/lib/home';
import { getSettings } from '@/lib/settings';
import { getGallery } from '@/lib/gallery';
import CtaBand from './components/CtaBand';
import { resolvePhoto } from '@/lib/photos';
import { getLocale, makeT } from '@/lib/i18n';
import { GlobalHeader } from './components/GlobalHeader';
import Footer from './components/Footer';
import MapHero from './components/MapHero';
import { IconEducation, IconService, IconCommunity, IconFaith } from './components/icons';

export const dynamic = 'force-dynamic';

const CARD_ORDER = ['mongolia', 'philippines', 'cambodia', 'indonesia', 'india', 'pakistan'];
const CARD_FLAG: Record<string, string> = { mongolia: '🇲🇳', philippines: '🇵🇭', cambodia: '🇰🇭', indonesia: '🇮🇩', india: '🇮🇳', pakistan: '🇵🇰' };
const DRAW_ICONS = [<IconEducation key="e" size={22} />, <IconCommunity key="c" size={22} />, <IconService key="s" size={22} />, <IconFaith key="f" size={22} />];
const DRAW_SLOTS = ['draw-education', 'draw-community', 'draw-service', 'draw-faith'];

export default async function Home() {
  const locale = await getLocale();
  const t = makeT(locale);
  const [user, countries, home, settings, seasons] = await Promise.all([getUser(), getCountries(locale), getHome(locale), getSettings(), getGallery(locale)]);
  const byId = Object.fromEntries(countries.map((c) => [c.id, c]));
  const navCountries = countries.map((c) => ({ id: c.id, ko: c.ko, en: c.en }));

  const heroCountries = countries.map((c) => ({
    id: c.id,
    ko: c.ko,
    en: c.en,
    pin: resolvePhoto(`card-${c.id}`),
    site: c.site,
    summary: home.taglines[c.id] ?? c.intro.slice(0, 60),
    status: c.timeline.length ? { year: c.timeline[c.timeline.length - 1].y, items: c.timeline[c.timeline.length - 1].items.slice(0, 3) } : undefined,
  }));

  const journey = home.journey
    .filter((j) => byId[j.id])
    .map((j) => ({ y: j.y, id: j.id, ko: byId[j.id].ko, en: byId[j.id].en, desc: j.desc }))
    .reverse(); // 최신 순

  return (
    <main>
      <GlobalHeader user={user} locale={locale} countries={navCountries} />

      {/* ── 히어로: 풀블리드 지도 + 타이틀(좌)·발자취(우) 오버레이 ── */}
      <div id="map">
        <MapHero
          countries={heroCountries}
          journey={journey}
          hero={{ l1: home.heroLine1, l2: home.heroLine2, l3: home.heroLine3, sub: home.heroSub }}
          defaultLayer={settings.mapTile}
          ui={{ detail: t('cta.detail'), inProgress: t('status.inProgress'), journey: t('label.journey') }}
        />
      </div>

      {/* ── 다크 포토 국가 카드 ── */}
      <div id="stories" className="country-cards">
        {CARD_ORDER.map((id) => {
          const c = byId[id];
          if (!c) return null;
          const img = home.cardImages?.[id] ?? resolvePhoto(`card-${id}`) ?? resolvePhoto(`th-${id}-1`);
          return (
            <Link key={id} href={`/${id}`} className={`ccard ccard--light${id === journey[0]?.id ? ' ccard--active' : ''}`}>
              {img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt="" className="ccard__img" />
              )}
              {id === journey[0]?.id && <span className="ccard__badge">{locale === 'ko' ? '활동 국가' : 'Focus'}</span>}
              <span className="ccard__body">
                <span><span className="ccard__flag">{CARD_FLAG[id]}</span> <span className="ccard__ko2">{locale === 'ko' ? c.ko : c.en}</span></span>
                <span className="ccard__en2">{locale === 'ko' ? c.en : c.ko}</span>
                <span className="ccard__desc2">{home.taglines[id]}</span>
                <span className="ccard__go2">{t('cta.detail')} →</span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* ── FOCUS COUNTRY (ui/ 시안 5) — 최신 발자취 국가, 콘텐츠는 실데이터 ── */}
      {(() => {
        const fid = journey[0]?.id;
        const fc = fid ? byId[fid] : null;
        if (!fc) return null;
        const season = seasons.find((s) => s.country === fid);
        const cover = season?.cover ?? season?.photos[0] ?? resolvePhoto(`card-${fid}`);
        const startYear = fc.timeline[0]?.y;
        return (
          <section className="section--wide" style={{ padding: '64px 20px 8px' }}>
            <div className="focusc">
              <div>
                <div className="eyebrow" style={{ fontSize: 12, letterSpacing: '.2em', marginBottom: 10 }}>FOCUS COUNTRY</div>
                <h2 style={{ margin: 0, fontSize: 30, fontWeight: 900, letterSpacing: '-.015em', color: 'var(--navy)' }}>
                  <span style={{ fontFamily: 'var(--f-disp)' }}>{fc.en}</span> {fc.ko} 사역
                </h2>
                <p style={{ margin: '14px 0 0', fontSize: 14.5, lineHeight: 1.85, color: 'var(--ink2)', maxWidth: 420 }}>{fc.intro}</p>
                {startYear && (
                  <div className="focusc__start"><b>{startYear}</b><span>{locale === 'ko' ? '사역 시작' : 'Since'}</span></div>
                )}
                <div>
                  <Link href={`/${fid}`} className="focusc__btn">{locale === 'ko' ? `${fc.ko} 이야기 더 보기 →` : `More about ${fc.en} →`}</Link>
                </div>
              </div>
              {cover && (
                <Link href={`/${fid}`} className="focusc__photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt="" loading="lazy" />
                  <span className="focusc__badge">{locale === 'ko' ? fc.ko : fc.en}</span>
                </Link>
              )}
            </div>
            {fc.timeline.length > 0 && (
              <div style={{ marginTop: 40 }}>
                <div className="eyebrow" style={{ fontSize: 12, letterSpacing: '.2em', marginBottom: 16 }}>
                  {locale === 'ko' ? `${fc.ko} 주요 연혁` : `${fc.en} chronicle`}
                </div>
                <div className="chrono">
                  {fc.timeline.map((tl, ti) => (
                    <div key={ti} className="chrono__item">
                      <span className="chrono__dot" />
                      <b>{tl.y}</b>
                      <div>
                        {tl.items.slice(0, 2).map((it, ii) => <span key={ii}>{it}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })()}

      {/* ── 우리가 그리는 세상 ── */}
      <section id="about" className="draws">
        <div className="draws__inner">
          <div className="draws__lead">
            <h2>{home.drawsTitle}</h2>
            <p>{home.drawsSub}</p>
            <Link href="/philippines" className="draws__btn">
              {t('cta.stories')}
            </Link>
          </div>
          <div className="draw-cards">
            {home.draws.map((d, i) => {
              const img = resolvePhoto(DRAW_SLOTS[i]);
              return (
                <div key={i} className="dcard">
                  {img && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="dcard__img" />
                      <span className="dcard__scrim" />
                    </>
                  )}
                  {DRAW_ICONS[i]}
                  <b>{d.ko}</b>
                  <span>{d.d}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 최근 선교 이야기 (ui/ 시안) ── */}
      {seasons.length > 0 && (
        <section className="section--wide" style={{ padding: '56px 20px 8px' }}>
          <div className="eyebrow" style={{ fontSize: 12, letterSpacing: '.2em', marginBottom: 6 }}>MISSION ARCHIVE</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-.01em', color: 'var(--navy)' }}>{locale === 'ko' ? '최근 선교 이야기' : 'Recent mission stories'}</h2>
            <Link href="/gallery" style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--sky)', textDecoration: 'none', whiteSpace: 'nowrap' }}>{locale === 'ko' ? '전체 아카이브 보기 →' : 'View all →'}</Link>
          </div>
          <div className="strow">
            {[...seasons].sort((x, y) => (y.date ?? '').localeCompare(x.date ?? '')).slice(0, 4).map((s) => (
              <Link key={s.id} href={s.country ? `/gallery?country=${s.country}` : '/gallery'} className="stcard">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.cover ?? s.photos[0]} alt="" loading="lazy" />
                <span className="stcard__scrim" />
                {s.country && byId[s.country] && <span className="stcard__badge">{locale === 'ko' ? byId[s.country].ko : byId[s.country].en}</span>}
                <span className="stcard__cap">{s.date && <i>{s.date}</i>}<b>{s.title}</b></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CtaBand ko={locale === 'ko'} />

      <Footer />
    </main>
  );
}
