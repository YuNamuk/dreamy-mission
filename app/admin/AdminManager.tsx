'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addAdmin, removeAdmin } from './actions';
import type { AdminRow } from '@/lib/admin';

export default function AdminManager({ admins, meEmail }: { admins: AdminRow[]; meEmail: string }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'content' | 'super'>('content');
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  function submit() {
    setMsg(null);
    start(async () => {
      const res = await addAdmin(email, role, name);
      if (res.ok) { setEmail(''); setName(''); setMsg('추가했습니다.'); router.refresh(); }
      else setMsg(res.error ?? '실패');
    });
  }
  function remove(e: string) {
    if (!confirm(`${e} 관리자를 삭제할까요?`)) return;
    start(async () => {
      const res = await removeAdmin(e);
      if (res.ok) { setMsg('삭제했습니다.'); router.refresh(); }
      else setMsg(res.error ?? '실패');
    });
  }

  return (
    <section className="admincard">
      <h2>관리자 관리 <span className="muted" style={{ fontWeight: 400, fontSize: 13 }}>(전체 관리자 전용)</span></h2>

      <div className="adminadd">
        <input className="ainput" placeholder="이메일 (@dreamyedu.net)" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="ainput" placeholder="이름(선택)" value={name} onChange={(e) => setName(e.target.value)} style={{ maxWidth: 140 }} />
        <select className="ainput" value={role} onChange={(e) => setRole(e.target.value as 'content' | 'super')} style={{ maxWidth: 140 }}>
          <option value="content">콘텐츠 관리자</option>
          <option value="super">전체 관리자</option>
        </select>
        <button className="abtn abtn--primary" onClick={submit} disabled={pending || !email}>추가</button>
      </div>
      {msg && <div className="amsg">{msg}</div>}

      <table className="atable">
        <thead>
          <tr><th>이메일</th><th>이름</th><th>권한</th><th></th></tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a.email}>
              <td>{a.email}</td>
              <td>{a.name ?? '—'}</td>
              <td><span className={`rolechip rolechip--${a.role}`}>{a.role === 'super' ? '전체' : '콘텐츠'}</span></td>
              <td style={{ textAlign: 'right' }}>
                {a.email !== meEmail && a.email !== 'namoogi@dreamyedu.net' ? (
                  <button className="alink" onClick={() => remove(a.email)} disabled={pending}>삭제</button>
                ) : (
                  <span className="muted" style={{ fontSize: 12 }}>기본</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
