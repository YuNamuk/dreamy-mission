'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveStories } from '../actions';
import type { Story } from '@/lib/stories';
import RefText from '../RefText';

const KINDS: Story['kind'][] = ['소감문', '계획서', '이야기'];

export default function StoriesEditor({ initial, countries, locale = 'ko', refData }: { initial: Story[]; countries: { id: string; ko: string }[]; locale?: string; refData?: Story[] }) {
  const isBase = locale === 'ko';
  const [list, setList] = useState<Story[]>(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  function upd(i: number, k: keyof Story, v: string) {
    setList((p) => p.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)));
  }
  function add() {
    setList((p) => [...p, { id: Math.random().toString(36).slice(2, 10), title: '', kind: '소감문', body: '' }]);
  }
  function del(i: number) {
    if (!confirm('이 이야기를 삭제할까요?')) return;
    setList((p) => p.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    setList((p) => {
      const a = [...p]; const j = i + dir;
      if (j < 0 || j >= a.length) return p;
      [a[i], a[j]] = [a[j], a[i]];
      return a;
    });
  }
  function save() {
    setMsg(null);
    start(async () => {
      const res = await saveStories(list, locale);
      setMsg(res.ok ? '저장했습니다. STORIES 페이지에 반영됩니다.' : res.error ?? '저장 실패');
      if (res.ok) router.refresh();
    });
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section className="admincard">
        <h2>이야기 목록 <span className="muted" style={{ fontSize: 12, fontWeight: 400 }}>· 학생 소감문·계획서·현장 이야기</span></h2>
        {list.length === 0 && <p className="muted">아직 등록된 이야기가 없습니다. 아래에서 추가하세요.</p>}
        <div style={{ display: 'grid', gap: 14 }}>
          {list.map((s, i) => (
            <div key={s.id} className="acatwrap">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <span className="muted" style={{ fontSize: 12, fontWeight: 700 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ flex: 1 }} />
                {isBase && <>
                  <button className="abtn" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                  <button className="abtn" onClick={() => move(i, 1)} disabled={i === list.length - 1}>↓</button>
                  <button className="alink" onClick={() => del(i)}>삭제</button>
                </>}
              </div>
              {refData?.[i] && <RefText>{refData[i].title}</RefText>}
              <input className="ainput" style={{ width: '100%', fontWeight: 700 }} value={s.title} onChange={(e) => upd(i, 'title', e.target.value)} placeholder="제목" />
              <div className="agrid2" style={{ marginTop: 8 }}>
                <label>작성자<input className="ainput" value={s.author ?? ''} onChange={(e) => upd(i, 'author', e.target.value)} placeholder="이름 (선택)" /></label>
                <label>시기<input className="ainput" value={s.date ?? ''} onChange={(e) => upd(i, 'date', e.target.value)} placeholder="예: 2025 여름 (선택)" /></label>
                {isBase && <label>나라
                  <select className="ainput" value={s.country ?? ''} onChange={(e) => upd(i, 'country', e.target.value)}>
                    <option value="">(선택 안 함)</option>
                    {countries.map((c) => <option key={c.id} value={c.id}>{c.ko}</option>)}
                  </select>
                </label>}
                {isBase && <label>종류
                  <select className="ainput" value={s.kind ?? '소감문'} onChange={(e) => upd(i, 'kind', e.target.value)}>
                    {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </label>}
              </div>
              {refData?.[i] && <RefText>{refData[i].body}</RefText>}
              <textarea className="atextarea" style={{ marginTop: 8 }} rows={6} value={s.body} onChange={(e) => upd(i, 'body', e.target.value)} placeholder="내용 (문단은 줄바꿈으로 구분)" />
            </div>
          ))}
        </div>
        {isBase && <button className="abtn" style={{ marginTop: 14 }} onClick={add}>+ 이야기 추가</button>}
      </section>

      <div className="adminsave">
        {msg && <span className="amsg">{msg}</span>}
        <button className="abtn abtn--primary" onClick={save} disabled={pending}>{pending ? '저장 중…' : '저장'}</button>
      </div>
    </div>
  );
}
