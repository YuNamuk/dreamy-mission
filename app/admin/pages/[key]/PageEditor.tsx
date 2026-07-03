'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { savePage } from '../../actions';
import type { PageContent, PageKey } from '@/lib/pages';

export default function PageEditor({ pageKey, initial }: { pageKey: PageKey; initial: PageContent }) {
  const [c, setC] = useState<PageContent>(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  function setF<K extends keyof PageContent>(k: K, v: PageContent[K]) { setC((p) => ({ ...p, [k]: v })); }
  function setSec(i: number, k: 'heading' | 'body', v: string) {
    setC((p) => ({ ...p, sections: p.sections.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)) }));
  }
  function addSec() { setC((p) => ({ ...p, sections: [...p.sections, { heading: '', body: '' }] })); }
  function delSec(i: number) { setC((p) => ({ ...p, sections: p.sections.filter((_, idx) => idx !== i) })); }
  function move(i: number, dir: -1 | 1) {
    setC((p) => {
      const arr = [...p.sections]; const j = i + dir;
      if (j < 0 || j >= arr.length) return p;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...p, sections: arr };
    });
  }

  function save() {
    setMsg(null);
    start(async () => {
      const res = await savePage(pageKey, c);
      setMsg(res.ok ? '저장했습니다. 페이지에 반영됩니다.' : res.error ?? '저장 실패');
      if (res.ok) router.refresh();
    });
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section className="admincard">
        <h2>제목</h2>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--ink3)', fontWeight: 600 }}>상단 라벨(eyebrow)
          <input className="ainput" style={{ width: '100%', marginTop: 4 }} value={c.eyebrow} onChange={(e) => setF('eyebrow', e.target.value)} />
        </label>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--ink3)', fontWeight: 600, marginTop: 10 }}>제목
          <input className="ainput" style={{ width: '100%', marginTop: 4 }} value={c.title} onChange={(e) => setF('title', e.target.value)} />
        </label>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--ink3)', fontWeight: 600, marginTop: 10 }}>부제
          <textarea className="atextarea" rows={2} value={c.subtitle} onChange={(e) => setF('subtitle', e.target.value)} />
        </label>
      </section>

      <section className="admincard">
        <h2>본문 섹션 <span className="muted" style={{ fontWeight: 400, fontSize: 12 }}>(제목 + 내용, 문단은 줄바꿈으로 구분)</span></h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {c.sections.map((s, i) => (
            <div key={i} className="acatwrap">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <input className="ainput" style={{ flex: 1 }} value={s.heading} onChange={(e) => setSec(i, 'heading', e.target.value)} placeholder="소제목 (비워도 됨)" />
                <button className="abtn" onClick={() => move(i, -1)} disabled={i === 0} title="위로">↑</button>
                <button className="abtn" onClick={() => move(i, 1)} disabled={i === c.sections.length - 1} title="아래로">↓</button>
                <button className="alink" onClick={() => delSec(i)}>삭제</button>
              </div>
              <textarea className="atextarea" rows={4} value={s.body} onChange={(e) => setSec(i, 'body', e.target.value)} placeholder="내용" />
            </div>
          ))}
        </div>
        <button className="abtn" style={{ marginTop: 12 }} onClick={addSec}>+ 섹션 추가</button>
      </section>

      <div className="adminsave">
        {msg && <span className="amsg">{msg}</span>}
        <button className="abtn abtn--primary" onClick={save} disabled={pending}>{pending ? '저장 중…' : '저장'}</button>
      </div>
    </div>
  );
}
