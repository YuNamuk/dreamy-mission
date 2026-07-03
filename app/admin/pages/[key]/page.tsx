import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdmin } from '@/lib/admin';
import { getPage, PAGE_KEYS, PAGE_LABEL, type PageKey } from '@/lib/pages';
import PageEditor from './PageEditor';

export const dynamic = 'force-dynamic';

export default async function AdminPageEdit({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!PAGE_KEYS.includes(key as PageKey)) notFound();
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
  const content = await getPage(key as PageKey);

  return (
    <main className="adminwrap">
      <header className="adminhead">
        <div>
          <div className="eyebrow" style={{ fontSize: 11, letterSpacing: '.2em', color: 'var(--sky)' }}>페이지 편집</div>
          <h1 style={{ margin: '4px 0 0' }}>{PAGE_LABEL[key as PageKey]}</h1>
        </div>
        <div className="adminhead__right">
          <Link className="abtn" href={`/${key}`} target="_blank">페이지 보기 ↗</Link>
          <Link className="abtn" href="/admin">← 목록</Link>
        </div>
      </header>
      <PageEditor pageKey={key as PageKey} initial={content} />
    </main>
  );
}
