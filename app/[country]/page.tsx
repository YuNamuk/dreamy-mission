import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUser } from '@/lib/session';
import { getCountry } from '@/lib/content';
import { getSettings } from '@/lib/settings';
import { COUNTRIES, countryIndex } from '@/lib/countries';
import { resolvePhoto } from '@/lib/photos';
import { PHOTO_BASE } from '@/lib/uploaded-photos';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import EditController from '../components/EditController';
import CategoryGallery, { type Category } from '../components/CategoryGallery';
import VisitGallery from '../components/VisitGallery';
import LocatorMap from '../components/LocatorMap';

export const dynamic = 'force-dynamic';

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: id } = await params;
  const [user, { country, images, catPhotos, visits }, settings] = await Promise.all([getUser(), getCountry(id), getSettings()]);
  if (!country) notFound();
  const hasVisits = visits.some((v) => v.photos.length > 0);

  const idx = countryIndex(id);
  const prev = COUNTRIES[(idx - 1 + COUNTRIES.length) % COUNTRIES.length];
  const next = COUNTRIES[(idx + 1) % COUNTRIES.length];
  const indexLabel = String(idx + 1).padStart(2, '0');

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
    <main id="country-root">
      <Nav user={user} countries={COUNTRIES.map((c) => ({ id: c.id, ko: c.ko, en: c.en }))} active="missions" logo={settings.logoUrl} />

      {/* ── 통합 히어로 카드: 이름 · 설명 · 국가정보 · 위치 지도 ── */}
      <section className="section--wide" style={{ padding: '108px 48px 0' }}>
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
                ['수도', country.capital],
                ['인구', country.pop],
                ['면적', country.area],
                ['언어', country.language],
                ['종교', country.religion],
                ['정치체제', country.government],
                ['통화', country.currency],
                ['기후', country.climate],
                ['시차', country.timezone],
              ] as [string, string][]).map(([label, value]) => (
                <div className="fact" key={label}>
                  <div className="fact__label">{label}</div>
                  <div className="fact__val">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="chero__map">
            <LocatorMap countryId={id} />
            <div className="chero__pin">{country.ko}</div>
          </div>
        </div>
      </section>

      {/* ── 카테고리 갤러리 + 연혁 레일 ── */}
      <section className="section--wide country-body" style={{ padding: '48px 48px 0' }}>
        <div>
          <div className="eyebrow" style={{ fontSize: 12, letterSpacing: '.2em', marginBottom: 20 }}>
            전시 카테고리 · Categories <span style={{ color: 'var(--ink4)', fontWeight: 500 }}>— 눌러서 사진 보기</span>
          </div>
          <CategoryGallery categories={cats} />
        </div>

        <aside className="rail">
          <div className="eyebrow" style={{ fontSize: 12, letterSpacing: '.2em', marginBottom: 24 }}>연혁 · Chronicle</div>
          {[...country.timeline].reverse().map((t, ti) => (
            <div key={ti} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 14, marginBottom: 22 }}>
              <div style={{ fontFamily: 'var(--f-disp)', fontSize: 16, fontWeight: 800, color: 'var(--sky)', letterSpacing: '.02em' }}>{t.y}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingTop: 2 }}>
                {t.items.map((it, ii) => (
                  <div key={ii} style={{ fontSize: 12.5, color: 'var(--ink2)', lineHeight: 1.65, display: 'flex', gap: 7 }}>
                    <span style={{ color: 'var(--ink4)' }}>–</span>
                    <span>{it}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </aside>
      </section>

      {/* ── 교육선교 방문 갤러리 ── */}
      {hasVisits && (
        <section className="section--wide" style={{ padding: '18px 48px 0' }}>
          <div className="eyebrow" style={{ fontSize: 12, letterSpacing: '.2em', marginBottom: 20 }}>
            교육선교 방문 · Mission Visits <span style={{ color: 'var(--ink4)', fontWeight: 500 }}>— 눌러서 사진 보기</span>
          </div>
          <VisitGallery visits={visits} />
        </section>
      )}

      {/* ── 국가 내비 ── */}
      <nav className="section--wide country-nav" style={{ margin: '56px auto 0', padding: '32px 48px 72px', borderTop: '1px solid var(--line)' }}>
        <Link href={`/${prev.id}`} style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: 'var(--f-disp)', fontSize: 11.5, fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--ink4)' }}>← 이전</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{prev.ko}</div>
        </Link>
        <Link href="/" className="pill" style={{ padding: '11px 24px', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 800 }}>
          지도로 돌아가기
        </Link>
        <Link href={`/${next.id}`} style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--f-disp)', fontSize: 11.5, fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--ink4)' }}>다음 →</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{next.ko}</div>
        </Link>
      </nav>

      <Footer />

      {user && <EditController countryId={country.id} themeCount={0} />}
    </main>
  );
}

