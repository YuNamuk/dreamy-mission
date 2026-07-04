import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdmin } from '@/lib/admin';
import { getCountry } from '@/lib/content';
import { PHOTO_BASE } from '@/lib/uploaded-photos';
import { LOCALES, BASE_LOCALE } from '@/lib/locales';
import CountryEditor from './CountryEditor';
import VisitManager from './VisitManager';
import AdminLangTabs from '../AdminLangTabs';

export const dynamic = 'force-dynamic';

export default async function EditCountryPage({ params, searchParams }: { params: Promise<{ country: string }>; searchParams: Promise<{ lang?: string }> }) {
  const { country: id } = await params;
  const sp = await searchParams;
  const lang = sp.lang && LOCALES.includes(sp.lang) ? sp.lang : BASE_LOCALE;
  const admin = await getAdmin();
  if (!admin) {
    return (
      <main className="adminwrap">
        <div className="admincard" style={{ maxWidth: 460, margin: '80px auto', textAlign: 'center' }}>
          <h1>권한 없음</h1>
          <p className="muted">관리자만 접근할 수 있습니다.</p>
          <a className="abtn abtn--primary" href="/api/auth/login">로그인</a>
        </div>
      </main>
    );
  }
  const { country, images, catPhotos, visits } = await getCountry(id, lang);
  if (!country) notFound();

  const covers = country.themes.map((_, i) => images[`th-${id}-${i + 1}`] || `${PHOTO_BASE}/th-${id}-${i + 1}.jpg`);
  const gallery = country.themes.map((_, i) => catPhotos[String(i)] ?? []);

  return (
    <main className="adminwrap">
      <header className="adminhead">
        <div>
          <div className="eyebrow" style={{ fontSize: 11, letterSpacing: '.2em', color: 'var(--sky)' }}>콘텐츠 편집</div>
          <h1 style={{ margin: '4px 0 0' }}>{country.ko} <span className="muted" style={{ fontSize: 18 }}>{country.en}</span></h1>
        </div>
        <div className="adminhead__right">
          <Link className="abtn" href={`/${id}`} target="_blank">페이지 보기 ↗</Link>
        </div>
      </header>

      <AdminLangTabs current={lang} />
      {lang !== BASE_LOCALE && <div className="adminlangnote">번역 모드입니다. 비워두면 한국어 원문이 표시됩니다. (사진·카테고리 구성·방문 갤러리는 언어 공통이라 한국어 탭에서 관리)</div>}

      <CountryEditor
        key={lang}
        id={id}
        locale={lang}
        initial={{
          intro: country.intro,
          themes: country.themes.map((t) => ({ t: t.t, d: t.d })),
          stats: {
            capital: country.capital, pop: country.pop, area: country.area, religion: country.religion,
            language: country.language, government: country.government, currency: country.currency, climate: country.climate, timezone: country.timezone,
          },
          timeline: country.timeline,
        }}
        covers={covers}
        gallery={gallery}
        photoBase={PHOTO_BASE}
      />

      {lang === BASE_LOCALE && (
        <div style={{ marginTop: 16 }}>
          <VisitManager id={id} initial={visits} />
        </div>
      )}
    </main>
  );
}
