import Link from 'next/link';
import { getAdmin } from '@/lib/admin';
import { getHome } from '@/lib/home';
import { COUNTRIES } from '@/lib/countries';
import { resolvePhoto } from '@/lib/photos';
import { LOCALES, BASE_LOCALE } from '@/lib/locales';
import HomeEditor from './HomeEditor';
import AdminLangTabs from '../AdminLangTabs';

export const dynamic = 'force-dynamic';

export default async function AdminHomeEdit({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
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
  const home = await getHome(lang);
  const cardThumbs: Record<string, string> = {};
  for (const c of COUNTRIES) {
    cardThumbs[c.id] = home.cardImages?.[c.id] ?? resolvePhoto(`card-${c.id}`) ?? resolvePhoto(`th-${c.id}-1`) ?? '';
  }

  return (
    <main className="adminwrap">
      <header className="adminhead">
        <div>
          <div className="eyebrow" style={{ fontSize: 11, letterSpacing: '.2em', color: 'var(--sky)' }}>콘텐츠 편집</div>
          <h1 style={{ margin: '4px 0 0' }}>홈(첫 화면)</h1>
        </div>
        <div className="adminhead__right">
          <Link className="abtn" href="/" target="_blank">페이지 보기 ↗</Link>
        </div>
      </header>
      <AdminLangTabs current={lang} />
      {lang !== BASE_LOCALE && <div className="adminlangnote">번역 모드입니다. 비워두면 한국어 원문이 표시됩니다. (이미지는 언어 공통이라 한국어 탭에서 관리)</div>}
      <HomeEditor key={lang} initial={home} countries={COUNTRIES.map((c) => ({ id: c.id, ko: c.ko, en: c.en }))} cardThumbs={cardThumbs} locale={lang} />
    </main>
  );
}
