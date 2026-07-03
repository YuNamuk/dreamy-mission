import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdmin } from '@/lib/admin';
import { getCountry } from '@/lib/content';
import { PHOTO_BASE } from '@/lib/uploaded-photos';
import CountryEditor from './CountryEditor';
import VisitManager from './VisitManager';

export const dynamic = 'force-dynamic';

export default async function EditCountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: id } = await params;
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
  const { country, images, catPhotos, visits } = await getCountry(id);
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
          <Link className="abtn" href="/admin">← 목록</Link>
        </div>
      </header>

      <CountryEditor
        id={id}
        initial={{
          intro: country.intro,
          themes: country.themes.map((t) => ({ t: t.t, d: t.d })),
          stats: { capital: country.capital, pop: country.pop, area: country.area, religion: country.religion },
          timeline: country.timeline,
        }}
        covers={covers}
        gallery={gallery}
      />

      <div style={{ marginTop: 16 }}>
        <VisitManager id={id} initial={visits} />
      </div>
    </main>
  );
}
