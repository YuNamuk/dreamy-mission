import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUser } from '@/lib/session';
import { getCountry } from '@/lib/content';
import { getSettings } from '@/lib/settings';
import { COUNTRIES, countryIndex } from '@/lib/countries';

const OTH_FLAG: Record<string, string> = { mongolia: '🇲🇳', philippines: '🇵🇭', cambodia: '🇰🇭', indonesia: '🇮🇩', india: '🇮🇳', pakistan: '🇵🇰' };
import { resolvePhoto } from '@/lib/photos';
import { PHOTO_BASE } from '@/lib/uploaded-photos';
import { getLocale, makeT } from '@/lib/i18n';
import { getGallery } from '@/lib/gallery';
import CtaBand from '../components/CtaBand';
import { GlobalHeader } from '../components/GlobalHeader';
import Footer from '../components/Footer';
import { COUNTRY_LINKS, KIND_LABEL } from '@/lib/country-support';
import EditController from '../components/EditController';
import CategoryGallery, { type Category } from '../components/CategoryGallery';
import VisitGallery from '../components/VisitGallery';
import LocatorMap from '../components/LocatorMap';

export const dynamic = 'force-dynamic';

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: id } = await params;
  const locale = await getLocale();
  const t = makeT(locale);
  const [user, { country, images, catPhotos, visits }, settings, seasons] = await Promise.all([getUser(), getCountry(id, locale), getSettings(locale), getGallery(locale)]);
  const stories = seasons.filter((s) => s.country === id).sort((x, y) => (y.date ?? '').localeCompare(x.date ?? '')).slice(0, 3);
  if (!country) notFound();
  const hasVisits = visits.some((v) => v.photos.length > 0);

  const idx = countryIndex(id);
  const prev = COUNTRIES[(idx - 1 + COUNTRIES.length) % COUNTRIES.length];
  const next = COUNTRIES[(idx + 1) % COUNTRIES.length];
  const indexLabel = String(idx + 1).padStart(2, '0');
  const cname = (c: { ko: string; en: string }) => (locale === 'ko' ? c.ko : c.en);

  const cats: Category[] = country.themes.map((th, i) => {
    const n = i + 1;
    const cover = images[`th-${id}-${n}`] || resolvePhoto(`th-${id}-${n}`);
    const extra = catPhotos[String(i)] ?? [];
    const photos = (extra.length
      ? [cover, ...extra]
      : [cover, `${PHOTO_BASE}/gal-${id}-${n}-1.jpg`, `${PHOTO_BASE}/gal-${id}-${n}-2.jpg`, `${PHOTO_BASE}/gal-${id}-${n}-3.jpg`]
    ).filter(Boolean) as string[];
    return { num: String(n).padStart(2, '0'), t: th.t, d: th.d, cover: cover ?? null, photos };
  });

  return (
    <main id="country-root" className="country-page">
      <GlobalHeader user={user} locale={locale} countries={COUNTRIES.map((c) => ({ id: c.id, ko: c.ko, en: c.en }))} />

      {/* ── 통합 히어로 카드: 이름 · 설명 · 국가정보 · 위치 지도 ── */}
      <section className="section--wide" style={{ padding: '108px 20px 0' }}>
        <div className="chero">
          <div className="chero__left">
            <div className="chero__head">
              <h1>{country.en}</h1>
              <span className="chero__ko">{country.ko}</span>
              <span className="chero__meta">{indexLabel} / 06 · {country.years}</span>
            </div>

            <p data-field="intro" className="chero__intro">{country.intro}</p>

            <div className="country-facts">
              {([
                [t('facts.capital'), country.capital],
                [t('facts.pop'), country.pop],
                [t('facts.government'), country.government],
                [t('facts.currency'), country.currency],
                [t('facts.climate'), country.climate],
                [t('facts.timezone'), country.timezone],
                [t('facts.area'), country.area, true],
                [t('facts.language'), country.language, true],
                [t('facts.religion'), country.religion, true],
              ] as [string, string, boolean?][]).map(([label, value, wide]) => (
                <div className={wide ? 'fact fact--wide' : 'fact'} key={label}>
                  <div className="fact__label">{label}</div>
                  <div className="fact__val">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="chero__map">
            <LocatorMap countryId={id} site={country.site} label={country.ko} />
            <div className="chero__pin">{cname(country)}</div>
          </div>
        </div>
      </section>

      {/* ── 연혁 — ui/ 시안: 가로 노드 타임라인 ── */}
      {country.timeline.length > 0 && (
        <section className="section--wide" style={{ padding: '48px 20px 0' }}>
          <div className="eyebrow" style={{ fontSize: 12, letterSpacing: '.2em', marginBottom: 6 }}>{t('label.chronicle')}</div>
          <h2 style={{ margin: '0 0 26px', fontSize: 24, fontWeight: 800, letterSpacing: '-.01em', color: 'var(--navy)' }}>
            {locale === 'ko' ? '하나님께서 걸어오신 길' : 'The road God has walked'}
          </h2>
          <div className="chrono">
            {country.timeline.map((tl, ti) => (
              <div key={ti} className="chrono__item">
                <span className="chrono__dot" />
                <b>{tl.y}</b>
                <div>
                  {tl.items.map((it, ii) => <span key={ii}>{it}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 미션 카테고리 갤러리 ── */}
      <section className="section--wide" style={{ padding: '44px 20px 0' }}>
        <div className="eyebrow" style={{ fontSize: 12, letterSpacing: '.2em', marginBottom: 20 }}>
          {t('label.categories')} <span style={{ color: 'var(--ink4)', fontWeight: 500 }}>{t('label.visitsHint')}</span>
        </div>
        <CategoryGallery categories={cats} />
      </section>

      {/* ── 나라 이야기 — 갤러리 시즌 다크 카드 ── */}
      {stories.length > 0 && (
        <section className="section--wide" style={{ padding: '44px 20px 0' }}>
          <div className="eyebrow" style={{ fontSize: 12, letterSpacing: '.2em', marginBottom: 6 }}>STORIES</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-.01em', color: 'var(--navy)' }}>
              {locale === 'ko' ? `${country.ko} 이야기` : `${country.en} stories`}
            </h2>
            <Link href={`/gallery?country=${id}`} style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--sky)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              {locale === 'ko' ? '이야기 더보기 →' : 'More →'}
            </Link>
          </div>
          <div className="strow strow--3">
            {stories.map((s) => (
              <Link key={s.id} href={`/gallery?country=${id}`} className="stcard">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.cover ?? s.photos[0]} alt="" loading="lazy" />
                <span className="stcard__scrim" />
                {s.date && <span className="stcard__badge">{s.date}</span>}
                <span className="stcard__cap"><b>{s.title}</b></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── 소식·함께하기 — 이 나라의 선교편지·후원 ── */}
      {(COUNTRY_LINKS[id]?.length ?? 0) > 0 && (
        <section className="section--wide" style={{ padding: '40px 20px 0' }}>
          <div className="eyebrow" style={{ fontSize: 12, letterSpacing: '.2em', marginBottom: 6 }}>
            {locale === 'ko' ? '소식 · 함께하기' : 'LETTERS · SUPPORT'}
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--ink3)', margin: '0 0 16px' }}>
            {locale === 'ko' ? `${country.ko} 교육선교의 편지와 동행 방법입니다.` : `Letters and ways to walk with ${country.en}.`}
          </p>
          <div className="sup__grid">
            {COUNTRY_LINKS[id].map((it) => (
              <a key={it.name} href={it.href} className="sup__card" target={it.external ? '_blank' : undefined} rel={it.external ? 'noopener noreferrer' : undefined}>
                <b><span className="sup__kind">{KIND_LABEL[it.kind]}</span>{it.name}{it.external && <span className="sup__ext" aria-hidden> ↗</span>}</b>
                <span>{it.desc}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ── 교육선교 방문 갤러리 ── */}
      {hasVisits && (
        <section className="section--wide" style={{ padding: '18px 20px 0' }}>
          <div className="eyebrow" style={{ fontSize: 12, letterSpacing: '.2em', marginBottom: 20 }}>
            {t('label.visits')} <span style={{ color: 'var(--ink4)', fontWeight: 500 }}>{t('label.visitsHint')}</span>
          </div>
          <VisitGallery visits={visits} />
        </section>
      )}

      {/* ── 갤러리 연동 ── */}
      <section className="section--wide" style={{ padding: '26px 20px 0' }}>
        <Link href={`/gallery?country=${id}`} className="abtn">
          {locale === 'ko' ? `${country.ko} 교육선교 갤러리 보기 →` : `View ${country.en} gallery →`}
        </Link>
      </section>

      {/* ── 국가 내비 ── */}
      <nav className="section--wide country-nav" style={{ margin: '56px auto 0', padding: '32px 20px 72px', borderTop: '1px solid var(--line)' }}>
        <Link href={`/${prev.id}`} style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: 'var(--f-disp)', fontSize: 11.5, fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--ink4)' }}>{t('nav.prev')}</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{cname(prev)}</div>
        </Link>
        <Link href="/" className="pill" style={{ padding: '11px 24px', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 800 }}>
          {t('cta.backToMap')}
        </Link>
        <Link href={`/${next.id}`} style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--f-disp)', fontSize: 11.5, fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--ink4)' }}>{t('nav.next')}</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{cname(next)}</div>
        </Link>
      </nav>
      {/* ── 다른 나라 교육선교 (ui/ 시안) ── */}
      <section className="section--wide" style={{ padding: '40px 20px 0' }}>
        <div className="eyebrow" style={{ fontSize: 12, letterSpacing: '.2em', marginBottom: 14 }}>
          {locale === 'ko' ? '다른 나라 교육선교' : 'OTHER COUNTRIES'}
        </div>
        <div className="othc">
          {COUNTRIES.filter((c) => c.id !== id).map((c) => (
            <Link key={c.id} href={`/${c.id}`}><span className="othc__flag">{OTH_FLAG[c.id] ?? '🌍'}</span>{locale === 'ko' ? c.ko : c.en}</Link>
          ))}
        </div>
      </section>

      <CtaBand ko={locale === 'ko'} country={locale === 'ko' ? country.ko : country.en} />


      <Footer />

      {user && <EditController countryId={country.id} themeCount={0} />}
    </main>
  );
}

