'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveHome, uploadHomeCard } from '../actions';
import type { HomeContent } from '@/lib/home';

export default function HomeEditor({ initial, countries, cardThumbs }: { initial: HomeContent; countries: { id: string; ko: string; en: string }[]; cardThumbs: Record<string, string> }) {
  const [h, setH] = useState<HomeContent>(initial);
  const [thumbs, setThumbs] = useState<Record<string, string>>(cardThumbs);
  const [cardBusy, setCardBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const cardRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const router = useRouter();
  const koOf = (id: string) => countries.find((c) => c.id === id)?.ko ?? id;

  function onCardFile(id: string, file: File | undefined) {
    if (!file) return;
    if (file.size > 8_000_000) { setMsg('이미지가 너무 큽니다 (최대 8MB).'); return; }
    setCardBusy(id); setMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      start(async () => {
        const res = await uploadHomeCard(id, dataUrl);
        setCardBusy(null);
        if (res.ok && res.url) {
          setThumbs((p) => ({ ...p, [id]: res.url! }));
          setH((p) => ({ ...p, cardImages: { ...p.cardImages, [id]: res.url! } }));
          setMsg('카드 이미지를 교체했습니다.'); router.refresh();
        }
        else setMsg(res.error ?? '업로드 실패');
      });
    };
    reader.readAsDataURL(file);
  }

  function set<K extends keyof HomeContent>(k: K, v: HomeContent[K]) { setH((p) => ({ ...p, [k]: v })); }
  function setJourney(i: number, k: 'y' | 'desc', v: string) {
    setH((p) => ({ ...p, journey: p.journey.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)) }));
  }
  function setTagline(id: string, v: string) { setH((p) => ({ ...p, taglines: { ...p.taglines, [id]: v } })); }
  function setDraw(i: number, k: 'ko' | 'd', v: string) {
    setH((p) => ({ ...p, draws: p.draws.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)) }));
  }

  function save() {
    setMsg(null);
    start(async () => {
      const res = await saveHome(h);
      setMsg(res.ok ? '저장했습니다. 홈에 반영됩니다.' : res.error ?? '저장 실패');
      if (res.ok) router.refresh();
    });
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section className="admincard">
        <h2>히어로 타이틀</h2>
        <div className="agrid2">
          <label>1줄<input className="ainput" value={h.heroLine1} onChange={(e) => set('heroLine1', e.target.value)} /></label>
          <label>2줄<input className="ainput" value={h.heroLine2} onChange={(e) => set('heroLine2', e.target.value)} /></label>
          <label>3줄 (파란 강조)<input className="ainput" value={h.heroLine3} onChange={(e) => set('heroLine3', e.target.value)} /></label>
        </div>
        <label style={{ display: 'block', marginTop: 10, fontSize: 12, color: 'var(--ink3)', fontWeight: 600 }}>소개 문구
          <textarea className="atextarea" rows={2} value={h.heroSub} onChange={(e) => set('heroSub', e.target.value)} />
        </label>
      </section>

      <section className="admincard">
        <h2>선교 발자취</h2>
        <p className="muted" style={{ fontSize: 12, margin: '2px 0 10px' }}>홈 화면에는 <b>최신 연도가 위</b>로 표시됩니다.</p>
        <div style={{ display: 'grid', gap: 8 }}>
          {h.journey.map((j, i) => (
            <div key={i} className="atl" style={{ gridTemplateColumns: '70px 120px 1fr' }}>
              <input className="ainput" value={j.y} onChange={(e) => setJourney(i, 'y', e.target.value)} />
              <input className="ainput" value={koOf(j.id)} disabled style={{ background: 'var(--wash)' }} />
              <input className="ainput" value={j.desc} onChange={(e) => setJourney(i, 'desc', e.target.value)} />
            </div>
          ))}
        </div>
      </section>

      <section className="admincard">
        <h2>나라 카드 <span className="muted" style={{ fontSize: 12, fontWeight: 400 }}>· 이미지 + 한 줄 소개</span></h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {countries.map((c) => (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: 12, alignItems: 'start' }}>
              <div
                className="acat__media"
                style={{ height: 66, aspectRatio: 'auto' }}
                onClick={() => cardRefs.current[c.id]?.click()}
                title="클릭해서 카드 이미지 교체"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {thumbs[c.id] ? <img src={thumbs[c.id]} alt="" onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} /> : null}
                <span className="acat__change">{cardBusy === c.id ? '업로드…' : '이미지 교체'}</span>
                <input ref={(el) => { cardRefs.current[c.id] = el; }} type="file" accept="image/*" hidden onChange={(e) => onCardFile(c.id, e.target.files?.[0])} />
              </div>
              <div style={{ display: 'grid', gap: 6 }}>
                <div style={{ fontSize: 12, color: 'var(--ink3)', fontWeight: 700 }}>{c.ko} <span className="muted" style={{ fontWeight: 400 }}>{c.en}</span></div>
                <input className="ainput" value={h.taglines[c.id] ?? ''} onChange={(e) => setTagline(c.id, e.target.value)} placeholder="한 줄 소개" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admincard">
        <h2>우리가 그리는 세상</h2>
        <div className="agrid2">
          <label>제목<input className="ainput" value={h.drawsTitle} onChange={(e) => set('drawsTitle', e.target.value)} /></label>
          <label>부제<input className="ainput" value={h.drawsSub} onChange={(e) => set('drawsSub', e.target.value)} /></label>
        </div>
        <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
          {h.draws.map((d, i) => (
            <div key={i} className="atl" style={{ gridTemplateColumns: '110px 1fr' }}>
              <input className="ainput" value={d.ko} onChange={(e) => setDraw(i, 'ko', e.target.value)} />
              <input className="ainput" value={d.d} onChange={(e) => setDraw(i, 'd', e.target.value)} />
            </div>
          ))}
        </div>
      </section>

      <div className="adminsave">
        {msg && <span className="amsg">{msg}</span>}
        <button className="abtn abtn--primary" onClick={save} disabled={pending}>{pending ? '저장 중…' : '저장'}</button>
      </div>
    </div>
  );
}
