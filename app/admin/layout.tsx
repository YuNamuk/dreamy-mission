import { getAdmin } from '@/lib/admin';
import { COUNTRIES } from '@/lib/countries';
import { PAGE_KEYS, PAGE_LABEL } from '@/lib/pages';
import AdminSidebar from './AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  // 비로그인/권한없음: 각 페이지가 자체 로그인 게이트를 렌더하므로 셸 없이 그대로.
  if (!admin) return <>{children}</>;

  return (
    <div className="adminshell">
      <AdminSidebar
        role={admin.role}
        email={admin.email}
        countries={COUNTRIES.map((c) => ({ id: c.id, ko: c.ko }))}
        pages={PAGE_KEYS.map((k) => ({ key: k, label: PAGE_LABEL[k] }))}
      />
      <div className="adminshell__main">{children}</div>
    </div>
  );
}
