'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addSeason, updateSeasonMeta, removeSeason, addSeasonPhotos, removeSeasonPhoto, setSeasonCover, moveSeasonPhoto, clearGallery } from '../actions';
import type { Season } from '@/lib/gallery';
import { thumb } from '@/lib/img';

export default function GalleryEditor({ initial, countries }: { initial: Season[]; countries: { id: string; ko: string }[] }) {
  const seasons = initial; // router.refresh 시 최신 반영
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [country, setCountry] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const router = useRouter();

  const run = (fn: () => Promise<{ ok: boolean; error?: string; added?: number }>, okMsg?: string) => {
    setMsg(null);
    start(async () => {
      const res = await fn();
      setMsg(res.ok ? (okMsg ?? '저장했습니다.') : res.error ?? '실패');
      if (res.ok) router.refresh();
    });
  };

  function create() {
    if (!title.trim()) return;
    run(async () => { const r = await addSeason(title, date, country); if (r.ok) { setTitle(''); setDate(''); setCountry(''); } return r; }, '시즌을 추가했습니다.');
  }
  async function onFiles(sid: string, files: FileList | null) {
    if (!files || !files.length) return;
    setBusy(sid); setMsg(null);
    const dataUrls: string[] = [];
    for (const f of Array.from(files).slice(0, 40)) {
      if (f.size > 12_000_000) continue;
      dataUrls.push(await new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(f); }));
    }
    start(async () => {
      const res = await addSeasonPhotos(sid, dataUrls);
      setBusy(null);
      setMsg(res.ok ? `${res.added}장 추가했습니다.` : res.error ?? '실패');
      if (res.ok) router.refresh();
    });
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section className="admincard">
        <h2>시즌 추가 <span className="muted" style={{ fontSize: 12, fontWeight: 400 }}>· 예: “2026 겨울 필리핀 교육선교”</span></h2>
        <div className="adminadd">
          <input className="ainput" placeholder="시즌 제목" value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          <input className="ainput" placeholder="시기 (예: 2026.01)" value={date} onChange={(e) => setDate(e.target.value)} style={{ maxWidth: 130 }} />
          <select className="ainput" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">나라(선택)</option>
            {countries.map((c) => <option key={c.id} value={c.id}>{c.ko}</option>)}
          </select>
          <button className="abtn abtn--primary" onClick={create} disabled={pending || !title.trim()}>추가</button>
        </div>
        {msg && <div className="amsg" style={{ marginTop: 6 }}>{msg}</div>}
        <div style={{ marginTop: 10 }}>
          <button className="alink" onClick={() => { if (confirm('갤러리의 모든 시즌과 사진 목록을 삭제할까요? 되돌릴 수 없습니다.')) run(() => clearGallery(), '전체 삭제했습니다.'); }} disabled={pending}>⚠ 전체 일괄 삭제</button>
        </div>
      </section>

      {seasons.length === 0 && <p className="muted">시즌이 없습니다. 위에서 추가하세요.</p>}

      {seasons.map((s) => (
        <section key={s.id} className="admincard">
          <div className="agrid2" style={{ gridTemplateColumns: '1fr 130px 140px', alignItems: 'end' }}>
            <label>제목<input className="ainput" defaultValue={s.title} onBlur={(e) => e.target.value !== s.title && run(() => updateSeasonMeta(s.id, { title: e.target.value }))} /></label>
            <label>시기<input className="ainput" defaultValue={s.date ?? ''} onBlur={(e) => (e.target.value || '') !== (s.date || '') && run(() => updateSeasonMeta(s.id, { date: e.target.value }))} /></label>
            <label>나라
              <select className="ainput" defaultValue={s.country ?? ''} onChange={(e) => run(() => updateSeasonMeta(s.id, { country: e.target.value }))}>
                <option value="">(없음)</option>
                {countries.map((c) => <option key={c.id} value={c.id}>{c.ko}</option>)}
              </select>
            </label>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '12px 0 8px' }}>
            <span className="muted" style={{ fontSize: 12.5, flex: 1 }}>사진 {s.photos.length}장 · ★커버 · ‹›순서 · ✕삭제</span>
            <button className="abtn" onClick={() => fileRefs.current[s.id]?.click()} disabled={pending}>{busy === s.id ? '업로드 중…' : '사진 추가'}</button>
            <input ref={(el) => { fileRefs.current[s.id] = el; }} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(s.id, e.target.files)} />
            <button className="alink" onClick={() => { if (confirm('이 시즌을 삭제할까요?')) run(() => removeSeason(s.id), '삭제했습니다.'); }} disabled={pending}>시즌 삭제</button>
          </div>
          {s.photos.length > 0 && (
            <div className="avisit__grid">
              {s.photos.map((p, pi) => {
                const isCover = (s.cover ?? s.photos[0]) === p;
                return (
                  <div key={p} className={`avisit__ph${isCover ? ' is-cover' : ''}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb(p, 280)} alt="" loading="lazy" />
                    {isCover && <span className="avisit__coverbadge">커버</span>}
                    <div className="avisit__tools">
                      <button onClick={() => run(() => moveSeasonPhoto(s.id, p, -1))} disabled={pi === 0 || pending} title="앞으로">‹</button>
                      <button className={isCover ? 'is-on' : ''} onClick={() => run(() => setSeasonCover(s.id, p))} disabled={pending} title="커버로">★</button>
                      <button onClick={() => run(() => moveSeasonPhoto(s.id, p, 1))} disabled={pi === s.photos.length - 1 || pending} title="뒤로">›</button>
                    </div>
                    <button className="avisit__del" onClick={() => run(() => removeSeasonPhoto(s.id, p))} title="삭제">✕</button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
