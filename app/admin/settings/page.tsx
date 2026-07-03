import Link from 'next/link';
import { getAdmin } from '@/lib/admin';
import { getSettings } from '@/lib/settings';
import SettingsEditor from './SettingsEditor';

export const dynamic = 'force-dynamic';

export default async function AdminSettings() {
  const admin = await getAdmin();
  if (!admin || admin.role !== 'super') {
    return (
      <main className="adminwrap">
        <div className="admincard" style={{ maxWidth: 460, margin: '80px auto', textAlign: 'center' }}>
          <h1>권한 없음</h1>
          <p className="muted">사이트 설정은 전체 관리자만 접근할 수 있습니다.</p>
          <Link className="abtn abtn--primary" href="/admin">← 관리자</Link>
        </div>
      </main>
    );
  }
  const settings = await getSettings();

  return (
    <main className="adminwrap">
      <header className="adminhead">
        <div>
          <div className="eyebrow" style={{ fontSize: 11, letterSpacing: '.2em', color: 'var(--sky)' }}>전체 관리자</div>
          <h1 style={{ margin: '4px 0 0' }}>사이트 설정</h1>
        </div>
        <div className="adminhead__right">
          <Link className="abtn" href="/" target="_blank">사이트 보기 ↗</Link>
          <Link className="abtn" href="/admin">← 목록</Link>
        </div>
      </header>
      <SettingsEditor initial={settings} />
    </main>
  );
}
