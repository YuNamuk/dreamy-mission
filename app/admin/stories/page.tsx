import Link from 'next/link';
import { getAdmin } from '@/lib/admin';
import { getStories } from '@/lib/stories';
import { COUNTRIES } from '@/lib/countries';
import StoriesEditor from './StoriesEditor';

export const dynamic = 'force-dynamic';

export default async function AdminStories() {
  const admin = await getAdmin();
  if (!admin) {
    return (
      <main className="adminwrap">
        <div className="admincard" style={{ maxWidth: 460, margin: '80px auto', textAlign: 'center' }}>
          <h1>권한 없음</h1>
          <a className="abtn abtn--primary" href="/api/auth/login">로그인</a>
        </div>
      </main>
    );
  }
  const stories = await getStories();

  return (
    <main className="adminwrap">
      <header className="adminhead">
        <div>
          <div className="eyebrow" style={{ fontSize: 11, letterSpacing: '.2em', color: 'var(--sky)' }}>STORIES 편집</div>
          <h1 style={{ margin: '4px 0 0' }}>선교 이야기</h1>
        </div>
        <div className="adminhead__right">
          <Link className="abtn" href="/stories" target="_blank">페이지 보기 ↗</Link>
          <Link className="abtn" href="/admin">← 목록</Link>
        </div>
      </header>
      <StoriesEditor initial={stories} countries={COUNTRIES.map((c) => ({ id: c.id, ko: c.ko }))} />
    </main>
  );
}
