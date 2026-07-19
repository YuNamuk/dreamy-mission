import { getUser } from '@/lib/session';
import { getSettings } from '@/lib/settings';
import { getGallery } from '@/lib/gallery';
import { COUNTRIES } from '@/lib/countries';
import { getLocale, makeT } from '@/lib/i18n';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import GalleryView from './GalleryView';

export const dynamic = 'force-dynamic';

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ country?: string }> }) {
  const [locale, sp] = await Promise.all([getLocale(), searchParams]);
  const t = makeT(locale);
  const [user, settings, all] = await Promise.all([getUser(), getSettings(), getGallery(locale)]);
  const filter = sp.country && COUNTRIES.some((c) => c.id === sp.country) ? sp.country : undefined;
  const seasons = filter ? all.filter((s) => s.country === filter) : all;
  const names: Record<string, string> = Object.fromEntries(COUNTRIES.map((c) => [c.id, locale === 'ko' ? c.ko : c.en]));
  const countryName = (id?: string) => (id ? names[id] : undefined);
  // 시즌이 있는 나라만 탭으로 (COUNTRIES 순서 유지)
  const tabCountries = COUNTRIES.filter((c) => all.some((s) => s.country === c.id));
  const ttl = locale === 'ko' ? '갤러리' : 'Gallery';
  const sub = filter
    ? (locale === 'ko' ? `${countryName(filter)} 교육선교 현장의 사진들` : `Photos from the ${countryName(filter)} education mission`)
    : (locale === 'ko' ? '학생들의 교육선교와 현장에서 만난 아이들 — 시즌별 사진 갤러리' : 'Students’ education mission and the children met on the field — a seasonal photo gallery');

  return (
    <main>
      <Nav user={user} countries={COUNTRIES.map((c) => ({ id: c.id, ko: c.ko, en: c.en }))} active="gallery" logo={settings.logoUrl} locale={locale} />
      <section className="section--wide staticpage" style={{ padding: '128px 48px 0' }}>
        <div className="eyebrow" style={{ fontSize: 12, letterSpacing: '.22em' }}>Gallery</div>
        <h1 className="staticpage__title">{ttl}</h1>
        <p className="staticpage__sub">{sub}</p>
      </section>
      {tabCountries.length > 0 && (
        <section className="section--wide" style={{ padding: '22px 48px 0' }}>
          <div className="galtabs">
            <a className={`galtab${!filter ? ' is-on' : ''}`} href="/gallery">{locale === 'ko' ? '전체' : 'All'}</a>
            {tabCountries.map((c) => (
              <a key={c.id} className={`galtab${filter === c.id ? ' is-on' : ''}`} href={`/gallery?country=${c.id}`}>{locale === 'ko' ? c.ko : c.en}</a>
            ))}
          </div>
        </section>
      )}
      <section className="section--wide" style={{ padding: '20px 48px 40px' }}>
        <GalleryView
          seasons={seasons}
          names={names}
          ui={{
            open: locale === 'ko' ? '원본 보기' : 'View original',
            download: locale === 'ko' ? '다운로드' : 'Download',
            downloadAll: locale === 'ko' ? '전체 다운로드' : 'Download all',
            photos: locale === 'ko' ? '장' : 'photos',
            back: locale === 'ko' ? '갤러리' : 'Gallery',
            empty: locale === 'ko' ? '아직 등록된 사진이 없습니다.' : 'No photos yet.',
          }}
        />
      </section>
      <Footer />
    </main>
  );
}
