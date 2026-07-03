import Link from 'next/link';
import { getAdmin } from '@/lib/admin';
import { getHome } from '@/lib/home';
import { COUNTRIES } from '@/lib/countries';
import HomeEditor from './HomeEditor';

export const dynamic = 'force-dynamic';

export default async function AdminHomeEdit() {
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
  const home = await getHome();

  return (
    <main className="adminwrap">
      <header className="adminhead">
        <div>
          <div className="eyebrow" style={{ fontSize: 11, letterSpacing: '.2em', color: 'var(--sky)' }}>콘텐츠 편집</div>
          <h1 style={{ margin: '4px 0 0' }}>홈(첫 화면)</h1>
        </div>
        <div className="adminhead__right">
          <Link className="abtn" href="/" target="_blank">페이지 보기 ↗</Link>
          <Link className="abtn" href="/admin">← 목록</Link>
        </div>
      </header>
      <HomeEditor initial={home} countries={COUNTRIES.map((c) => ({ id: c.id, ko: c.ko, en: c.en }))} />
    </main>
  );
}
