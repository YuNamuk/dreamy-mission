'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addVisit, removeVisit, addVisitPhotos, removeVisitPhoto, setVisitCover, moveVisitPhoto } from '../actions';
import type { Visit } from '@/lib/content';

export default function VisitManager({ id, initial }: { id: string; initial: Visit[] }) {
  const visits = initial; // 서버 새로고침(router.refresh) 시 최신 목록 반영
  const [label, setLabel] = useState('');
  const [date, setDate] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busyVisit, setBusyVisit] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const router = useRouter();

  function create() {
    setMsg(null);
    start(async () => {
      const res = await addVisit(id, label, date);
      if (res.ok) { setLabel(''); setDate(''); setMsg('방문 갤러리를 추가했습니다.'); router.refresh(); }
      else setMsg(res.error ?? '실패');
    });
  }
  function del(vid: string) {
    if (!confirm('이 방문 갤러리를 삭제할까요? (사진 목록도 사라집니다)')) return;
    start(async () => {
      const res = await removeVisit(id, vid);
      setMsg(res.ok ? '삭제했습니다.' : res.error ?? '실패');
      if (res.ok) router.refresh();
    });
  }
  function delPhoto(vid: string, url: string) {
    start(async () => {
      const res = await removeVisitPhoto(id, vid, url);
      if (res.ok) router.refresh(); else setMsg(res.error ?? '실패');
    });
  }
  function makeCover(vid: string, url: string) {
    start(async () => {
      const res = await setVisitCover(id, vid, url);
      if (res.ok) { setMsg('커버로 지정했습니다.'); router.refresh(); } else setMsg(res.error ?? '실패');
    });
  }
  function movePhoto(vid: string, url: string, dir: -1 | 1) {
    start(async () => {
      const res = await moveVisitPhoto(id, vid, url, dir);
      if (res.ok) router.refresh(); else setMsg(res.error ?? '실패');
    });
  }
  async function onFiles(vid: string, files: FileList | null) {
    if (!files || !files.length) return;
    setBusyVisit(vid);
    setMsg(null);
    const dataUrls: string[] = [];
    for (const f of Array.from(files).slice(0, 30)) {
      if (f.size > 8_000_000) continue;
      dataUrls.push(await new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(f); }));
    }
    start(async () => {
      const res = await addVisitPhotos(id, vid, dataUrls);
      setBusyVisit(null);
      setMsg(res.ok ? `${res.added}장 추가했습니다.` : res.error ?? '실패');
      if (res.ok) router.refresh();
    });
  }

  return (
    <section className="admincard">
      <h2>교육선교 방문 갤러리 <span className="muted" style={{ fontWeight: 400, fontSize: 13 }}>(시기별 사진)</span></h2>
      <p className="muted">방문 시기(예: “2026년 1월 학생 교육선교”)를 추가하고 사진을 업로드하세요. 국가 페이지에 예쁜 갤러리로 표시됩니다.</p>

      <div className="adminadd">
        <input className="ainput" placeholder="제목 (예: 2026년 1월 학생 교육선교)" value={label} onChange={(e) => setLabel(e.target.value)} style={{ flex: 1, minWidth: 220 }} />
        <input className="ainput" placeholder="시기 (예: 2026.01)" value={date} onChange={(e) => setDate(e.target.value)} style={{ maxWidth: 130 }} />
        <button className="abtn abtn--primary" onClick={create} disabled={pending || !label}>추가</button>
      </div>
      {msg && <div className="amsg" style={{ marginBottom: 8 }}>{msg}</div>}

      <div style={{ display: 'grid', gap: 14 }}>
        {visits.length === 0 && <p className="muted" style={{ fontSize: 13 }}>아직 방문 갤러리가 없습니다.</p>}
        {visits.map((v) => (
          <div key={v.id} className="avisit">
            <div className="avisit__hd">
              <div>
                <b>{v.label}</b> {v.date && <span className="muted">· {v.date}</span>}
                <span className="muted" style={{ marginLeft: 8, fontSize: 12 }}>사진 {v.photos.length}장</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="abtn" onClick={() => fileRefs.current[v.id]?.click()} disabled={pending}>
                  {busyVisit === v.id ? '업로드 중…' : '사진 추가'}
                </button>
                <input ref={(el) => { fileRefs.current[v.id] = el; }} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(v.id, e.target.files)} />
                <button className="alink" onClick={() => del(v.id)} disabled={pending}>삭제</button>
              </div>
            </div>
            {v.photos.length > 0 && (
              <>
                <div className="muted" style={{ fontSize: 12, margin: '2px 0 8px' }}>★ 커버 지정 · ‹ › 순서 변경 · ✕ 삭제 <span style={{ marginLeft: 6 }}>(커버 미지정 시 첫 사진)</span></div>
                <div className="avisit__grid">
                  {v.photos.map((p, pi) => {
                    const isCover = (v.cover ?? v.photos[0]) === p;
                    return (
                      <div key={p} className={`avisit__ph${isCover ? ' is-cover' : ''}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p} alt="" />
                        {isCover && <span className="avisit__coverbadge">커버</span>}
                        <div className="avisit__tools">
                          <button onClick={() => movePhoto(v.id, p, -1)} disabled={pi === 0 || pending} title="앞으로">‹</button>
                          <button className={isCover ? 'is-on' : ''} onClick={() => makeCover(v.id, p)} disabled={pending} title="커버로 지정">★</button>
                          <button onClick={() => movePhoto(v.id, p, 1)} disabled={pi === v.photos.length - 1 || pending} title="뒤로">›</button>
                        </div>
                        <button className="avisit__del" onClick={() => delPhoto(v.id, p)} title="삭제">✕</button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
