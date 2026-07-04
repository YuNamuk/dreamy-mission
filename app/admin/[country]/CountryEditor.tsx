'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveCountryContent, saveCountryStructure, uploadCover, addCatPhotos, removeCatPhoto } from '../actions';

interface Initial {
  intro: string;
  themes: { t: string; d: string }[];
  stats: { capital: string; pop: string; area: string; religion: string; language: string; government: string; currency: string; climate: string; timezone: string };
  timeline: { y: string; items: string[] }[];
}

export default function CountryEditor({ id, initial, covers, gallery, photoBase, locale = 'ko' }: { id: string; initial: Initial; covers: string[]; gallery: string[][]; photoBase: string; locale?: string }) {
  const isBase = locale === 'ko';
  const [intro, setIntro] = useState(initial.intro);
  const [themes, setThemes] = useState(initial.themes);
  const [stats, setStats] = useState(initial.stats);
  const [timeline, setTimeline] = useState(initial.timeline);
  const [coverUrls, setCoverUrls] = useState(covers);
  const [gal, setGal] = useState(gallery);
  const [galBusy, setGalBusy] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const galRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  async function onGalFiles(i: number, files: FileList | null) {
    if (!files || !files.length) return;
    setGalBusy(i); setMsg(null);
    const dataUrls: string[] = [];
    for (const f of Array.from(files).slice(0, 30)) {
      if (f.size > 8_000_000) continue;
      dataUrls.push(await new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(f); }));
    }
    start(async () => {
      const res = await addCatPhotos(id, i, dataUrls);
      setGalBusy(null);
      setMsg(res.ok ? `${res.added}장 추가했습니다.` : res.error ?? '실패');
      if (res.ok) router.refresh();
    });
  }
  function delGalPhoto(i: number, url: string) {
    start(async () => {
      const res = await removeCatPhoto(id, i, url);
      if (res.ok) { setGal((p) => p.map((arr, idx) => (idx === i ? arr.filter((u) => u !== url) : arr))); }
      else setMsg(res.error ?? '실패');
    });
  }

  function setTheme(i: number, k: 't' | 'd', v: string) {
    setThemes((p) => p.map((t, idx) => (idx === i ? { ...t, [k]: v } : t)));
  }

  /** 카테고리 구조(추가/삭제/순서)를 즉시 서버에 저장 */
  function persistStructure(nt: { t: string; d: string }[], nc: string[], ng: string[][]) {
    start(async () => {
      const res = await saveCountryStructure(id, { themes: nt.map((t) => ({ t: t.t, d: t.d })), covers: nc, galleries: ng });
      setMsg(res.ok ? '카테고리 구성을 저장했습니다.' : res.error ?? '저장 실패');
      if (res.ok) router.refresh();
    });
  }
  function addCategory() {
    const nt = [...themes, { t: '새 카테고리', d: '' }];
    const nc = [...coverUrls, `${photoBase}/th-${id}-${nt.length}.jpg`];
    const ng = [...gal, []];
    setThemes(nt); setCoverUrls(nc); setGal(ng);
    persistStructure(nt, nc, ng);
  }
  function removeCategory(i: number) {
    if (!confirm(`"${themes[i]?.t || '이 카테고리'}"를 삭제할까요? 이 카테고리의 갤러리 사진 목록도 사라집니다.`)) return;
    const nt = themes.filter((_, x) => x !== i);
    const nc = coverUrls.filter((_, x) => x !== i);
    const ng = gal.filter((_, x) => x !== i);
    setThemes(nt); setCoverUrls(nc); setGal(ng);
    persistStructure(nt, nc, ng);
  }
  function moveCategory(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= themes.length) return;
    const sw = <T,>(a: T[]) => { const b = [...a]; [b[i], b[j]] = [b[j], b[i]]; return b; };
    const nt = sw(themes), nc = sw(coverUrls), ng = sw(gal);
    setThemes(nt); setCoverUrls(nc); setGal(ng);
    persistStructure(nt, nc, ng);
  }
  function setYear(i: number, y: string) {
    setTimeline((p) => p.map((r, idx) => (idx === i ? { ...r, y } : r)));
  }
  function setItems(i: number, text: string) {
    setTimeline((p) => p.map((r, idx) => (idx === i ? { ...r, items: text.split('\n').map((s) => s.trim()).filter(Boolean) } : r)));
  }
  function addYear() { setTimeline((p) => [...p, { y: '', items: [] }]); }
  function delYear(i: number) { setTimeline((p) => p.filter((_, idx) => idx !== i)); }
  function moveYear(i: number, dir: -1 | 1) {
    setTimeline((p) => {
      const a = [...p]; const j = i + dir;
      if (j < 0 || j >= a.length) return p;
      [a[i], a[j]] = [a[j], a[i]];
      return a;
    });
  }

  function save() {
    setMsg(null);
    start(async () => {
      const cleanTimeline = timeline.filter((r) => r.y.trim() || r.items.length);
      const res = await saveCountryContent(id, { intro, themes, stats, timeline: cleanTimeline }, locale);
      setMsg(res.ok ? '저장했습니다. 사이트에 반영됩니다.' : res.error ?? '저장 실패');
      if (res.ok) router.refresh();
    });
  }

  function pickCover(i: number) {
    fileRefs.current[i]?.click();
  }
  function onCover(i: number, file: File | undefined) {
    if (!file) return;
    if (file.size > 8_000_000) { setMsg('이미지가 너무 큽니다 (최대 8MB).'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      start(async () => {
        const res = await uploadCover(id, i, dataUrl);
        if (res.ok && res.url) {
          setCoverUrls((p) => p.map((u, idx) => (idx === i ? res.url! : u)));
          setMsg('사진을 교체했습니다.');
        } else setMsg(res.error ?? '업로드 실패');
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* 소개 */}
      <section className="admincard">
        <h2>선교지 소개</h2>
        <textarea className="atextarea" rows={4} value={intro} onChange={(e) => setIntro(e.target.value)} />
      </section>

      {/* 통계 */}
      <section className="admincard">
        <h2>국가 정보</h2>
        <div className="agrid2">
          <label>수도<input className="ainput" value={stats.capital} onChange={(e) => setStats({ ...stats, capital: e.target.value })} /></label>
          <label>인구<input className="ainput" value={stats.pop} onChange={(e) => setStats({ ...stats, pop: e.target.value })} /></label>
          <label>면적<input className="ainput" value={stats.area} onChange={(e) => setStats({ ...stats, area: e.target.value })} /></label>
          <label>언어<input className="ainput" value={stats.language} onChange={(e) => setStats({ ...stats, language: e.target.value })} /></label>
          <label>종교<input className="ainput" value={stats.religion} onChange={(e) => setStats({ ...stats, religion: e.target.value })} /></label>
          <label>정치체제<input className="ainput" value={stats.government} onChange={(e) => setStats({ ...stats, government: e.target.value })} /></label>
          <label>통화<input className="ainput" value={stats.currency} onChange={(e) => setStats({ ...stats, currency: e.target.value })} /></label>
          <label>기후<input className="ainput" value={stats.climate} onChange={(e) => setStats({ ...stats, climate: e.target.value })} /></label>
          <label>시차<input className="ainput" value={stats.timezone} onChange={(e) => setStats({ ...stats, timezone: e.target.value })} /></label>
        </div>
      </section>

      {/* 카테고리 */}
      <section className="admincard">
        <h2>전시 카테고리 {isBase && <span className="muted" style={{ fontSize: 12, fontWeight: 400 }}>· 추가·삭제·순서변경은 즉시 저장됩니다</span>}</h2>
        <div style={{ display: 'grid', gap: 16 }}>
          {themes.map((th, i) => (
            <div key={i} className="acatwrap">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                <span className="muted" style={{ fontSize: 12, fontWeight: 700 }}>카테고리 {String(i + 1).padStart(2, '0')}</span>
                <span style={{ flex: 1 }} />
                {isBase && <>
                  <button className="abtn" onClick={() => moveCategory(i, -1)} disabled={i === 0 || pending} title="위로">↑</button>
                  <button className="abtn" onClick={() => moveCategory(i, 1)} disabled={i === themes.length - 1 || pending} title="아래로">↓</button>
                  <button className="alink" onClick={() => removeCategory(i)} disabled={pending}>삭제</button>
                </>}
              </div>
              <div className="acat" style={isBase ? undefined : { gridTemplateColumns: '1fr' }}>
                {isBase && (
                <div className="acat__media" onClick={() => pickCover(i)} title="클릭해서 커버 교체">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverUrls[i]} alt="" onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />
                  <span className="acat__change">커버 교체</span>
                  <input ref={(el) => { fileRefs.current[i] = el; }} type="file" accept="image/*" hidden onChange={(e) => onCover(i, e.target.files?.[0])} />
                </div>
                )}
                <div className="acat__body">
                  <input className="ainput" value={th.t} onChange={(e) => setTheme(i, 't', e.target.value)} placeholder="카테고리 제목" style={{ fontWeight: 700 }} />
                  <textarea className="atextarea" rows={4} value={th.d} onChange={(e) => setTheme(i, 'd', e.target.value)} placeholder="설명" />
                </div>
              </div>
              {isBase && <div className="acat__gallery">
                <div className="acat__gallery-hd">
                  <span className="muted" style={{ fontSize: 12.5 }}>
                    갤러리 사진 {gal[i]?.length ?? 0}장{(gal[i]?.length ?? 0) === 0 && ' · 미등록 시 기본 3장 자동 표시'}
                  </span>
                  <button className="abtn" onClick={() => galRefs.current[i]?.click()} disabled={pending}>
                    {galBusy === i ? '업로드 중…' : '사진 추가'}
                  </button>
                  <input ref={(el) => { galRefs.current[i] = el; }} type="file" accept="image/*" multiple hidden onChange={(e) => onGalFiles(i, e.target.files)} />
                </div>
                {(gal[i]?.length ?? 0) > 0 && (
                  <div className="avisit__grid" style={{ marginTop: 10 }}>
                    {gal[i].map((p) => (
                      <div key={p} className="avisit__ph">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p} alt="" />
                        <button className="avisit__del" onClick={() => delGalPhoto(i, p)} title="삭제">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>}
            </div>
          ))}
        </div>
        {isBase && <button className="abtn" style={{ marginTop: 14 }} onClick={addCategory} disabled={pending}>+ 카테고리 추가</button>}
      </section>

      {/* 연혁 */}
      <section className="admincard" id="sec-timeline">
        <h2>연혁 <span className="muted" style={{ fontSize: 12, fontWeight: 400 }}>· 연도별 활동. 사건은 한 줄에 하나씩</span></h2>
        <p className="muted" style={{ fontSize: 12, margin: '2px 0 12px' }}>상세 페이지에는 <b>최신 연도가 위</b>로 표시됩니다. 순서는 ↑↓로 조정하세요.</p>
        <div style={{ display: 'grid', gap: 12 }}>
          {timeline.map((r, i) => (
            <div key={i} className="acatwrap">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <input className="ainput" value={r.y} onChange={(e) => setYear(i, e.target.value)} placeholder="연도 (예: 2025)" style={{ width: 130, fontWeight: 700 }} />
                <span style={{ flex: 1 }} />
                <button className="abtn" onClick={() => moveYear(i, -1)} disabled={i === 0} title="위로">↑</button>
                <button className="abtn" onClick={() => moveYear(i, 1)} disabled={i === timeline.length - 1} title="아래로">↓</button>
                <button className="alink" onClick={() => delYear(i)}>삭제</button>
              </div>
              <textarea className="atextarea" rows={Math.max(2, r.items.length)} value={r.items.join('\n')} onChange={(e) => setItems(i, e.target.value)} placeholder="한 줄에 하나씩&#10;예: 겨자씨 초등학교 방문&#10;예: 교사 연수 진행" />
            </div>
          ))}
        </div>
        <button className="abtn" style={{ marginTop: 12 }} onClick={addYear}>+ 연도 추가</button>
      </section>

      <div className="adminsave">
        {msg && <span className="amsg">{msg}</span>}
        <button className="abtn abtn--primary" onClick={save} disabled={pending}>{pending ? '저장 중…' : '저장'}</button>
      </div>
    </div>
  );
}
