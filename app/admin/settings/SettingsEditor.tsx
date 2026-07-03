'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveSettings, uploadLogo } from '../actions';
import type { SiteSettings, MapTile } from '@/lib/settings';

const TILES: { k: MapTile; label: string }[] = [
  { k: 'terrain', label: '지형' },
  { k: 'satellite', label: '위성' },
  { k: 'simple', label: '심플' },
];

export default function SettingsEditor({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const colorRef = useRef<HTMLInputElement | null>(null);
  const whiteRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  function set<K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) { setS((p) => ({ ...p, [k]: v })); }

  function save() {
    setMsg(null);
    start(async () => {
      const res = await saveSettings({ mapTile: s.mapTile, tagline: s.tagline, verse: s.verse, verseRef: s.verseRef });
      setMsg(res.ok ? '저장했습니다. 사이트에 반영됩니다.' : res.error ?? '저장 실패');
      if (res.ok) router.refresh();
    });
  }

  function onLogo(kind: 'color' | 'white', file: File | undefined) {
    if (!file) return;
    if (file.size > 4_000_000) { setMsg('이미지가 너무 큽니다 (최대 4MB).'); return; }
    const r = new FileReader();
    r.onload = () => start(async () => {
      const res = await uploadLogo(kind, r.result as string);
      if (res.ok && res.url) { setS((p) => ({ ...p, [kind === 'white' ? 'logoWhiteUrl' : 'logoUrl']: res.url! })); setMsg('로고를 교체했습니다.'); }
      else setMsg(res.error ?? '업로드 실패');
    });
    r.readAsDataURL(file);
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section className="admincard">
        <h2>기본 지도 타일</h2>
        <p className="muted" style={{ fontSize: 13 }}>홈 지도가 처음 표시될 형태입니다.</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {TILES.map((t) => (
            <button key={t.k} className={`abtn${s.mapTile === t.k ? ' abtn--primary' : ''}`} onClick={() => set('mapTile', t.k)}>{t.label}</button>
          ))}
        </div>
      </section>

      <section className="admincard">
        <h2>대표 문구 · 성경구절 (푸터)</h2>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--ink3)', fontWeight: 600 }}>대표 문구
          <input className="ainput" style={{ width: '100%', marginTop: 4 }} value={s.tagline} onChange={(e) => set('tagline', e.target.value)} />
        </label>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--ink3)', fontWeight: 600, marginTop: 10 }}>대표 성경구절
          <textarea className="atextarea" rows={2} value={s.verse} onChange={(e) => set('verse', e.target.value)} />
        </label>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--ink3)', fontWeight: 600, marginTop: 8 }}>구절 출처
          <input className="ainput" style={{ maxWidth: 260 }} value={s.verseRef} onChange={(e) => set('verseRef', e.target.value)} />
        </label>
      </section>

      <section className="admincard">
        <h2>로고</h2>
        <p className="muted" style={{ fontSize: 13 }}>헤더용(컬러)과 푸터용(흰색) 로고. PNG 권장(투명 배경).</p>
        <div className="agrid2" style={{ marginTop: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink3)', fontWeight: 600, marginBottom: 6 }}>헤더 로고 (컬러)</div>
            <div className="logobox" onClick={() => colorRef.current?.click()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.logoUrl || '/mark.png'} alt="" />
              <span>클릭해서 교체</span>
              <input ref={colorRef} type="file" accept="image/*" hidden onChange={(e) => onLogo('color', e.target.files?.[0])} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink3)', fontWeight: 600, marginBottom: 6 }}>푸터 로고 (흰색)</div>
            <div className="logobox logobox--dark" onClick={() => whiteRef.current?.click()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.logoWhiteUrl || '/mark-white.png'} alt="" />
              <span>클릭해서 교체</span>
              <input ref={whiteRef} type="file" accept="image/*" hidden onChange={(e) => onLogo('white', e.target.files?.[0])} />
            </div>
          </div>
        </div>
      </section>

      <div className="adminsave">
        {msg && <span className="amsg">{msg}</span>}
        <button className="abtn abtn--primary" onClick={save} disabled={pending}>{pending ? '저장 중…' : '저장'}</button>
      </div>
    </div>
  );
}
