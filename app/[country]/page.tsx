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

      {/* ── 벽면 헤더 ── */}
      <section className="section--wide" style={{ padding: '120px 48px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 22, flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--f-disp)', fontWeight: 500, fontSize: 'clamp(34px,4.6vw,72px)', lineHeight: 1, letterSpacing: '-.01em', color: 'var(--sky)' }}>
            {country.en}
          </h1>
          <span style={{ fontSize: 'clamp(19px,2.4vw,28px)', fontWeight: 600, letterSpacing: '-.01em' }}>{country.ko}</span>
          <span style={{ fontFamily: 'var(--f-disp)', fontSize: 15, fontWeight: 700, color: 'var(--ink4)', letterSpacing: '.06em' }}>
            {indexLabel} / 06 · {country.years}
          </span>
        </div>

        <p data-field="intro" style={{ margin: '30px 0 0', maxWidth: 960, fontSize: 16.5, lineHeight: 2, color: 'var(--ink2)', fontWeight: 300 }}>
          {country.intro}
        </p>

        <div className="country-stats">
          <Stat label="Capital · 수도" value={country.capital} />
          <Stat label="Population · Area" value={`${country.pop} · ${country.area}`} />
          <Stat label="Religion · 종교" value={country.religion} />
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
          {country.timeline.map((t, ti) => (
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow" style={{ fontSize: 11, letterSpacing: '.16em', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 14.5, fontWeight: 500 }}>{value}</div>
    </div>
  );
}
