'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  role: 'super' | 'content';
  email: string;
  countries: { id: string; ko: string }[];
  pages: { key: string; label: string }[];
}

export default function AdminSidebar({ role, email, countries, pages }: Props) {
  const path = usePathname();
  const isActive = (href: string) => (href === '/admin' ? path === '/admin' : path === href || path.startsWith(href + '/'));

  const Item = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className={`adminside__lnk${isActive(href) ? ' is-active' : ''}`}>
      {children}
    </Link>
  );

  return (
    <aside className="adminside">
      <div className="adminside__brand">DREAMY · ADMIN</div>

      <div className="adminside__grp">
        <Item href="/admin">개요</Item>
        <Item href="/admin/home">홈 화면</Item>
      </div>

      <div className="adminside__grp">
        <div className="adminside__lbl">선교지 상세</div>
        {countries.map((c) => (
          <Item key={c.id} href={`/admin/${c.id}`}>{c.ko}</Item>
        ))}
      </div>

      <div className="adminside__grp">
        <div className="adminside__lbl">콘텐츠</div>
        <Item href="/admin/stories">STORIES 이야기</Item>
        {pages.map((p) => (
          <Item key={p.key} href={`/admin/pages/${p.key}`}>{p.label}</Item>
        ))}
      </div>

      {role === 'super' && (
        <div className="adminside__grp">
          <div className="adminside__lbl">설정</div>
          <Item href="/admin/settings">사이트 설정</Item>
        </div>
      )}

      <div className="adminside__foot">
        <span className={`rolechip rolechip--${role}`}>{role === 'super' ? '전체 관리자' : '콘텐츠 관리자'}</span>
        <span className="muted" style={{ fontSize: 12, wordBreak: 'break-all' }}>{email}</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link className="abtn" href="/" target="_blank">사이트 ↗</Link>
          <a className="abtn" href="/api/auth/logout">로그아웃</a>
        </div>
      </div>
    </aside>
  );
}
