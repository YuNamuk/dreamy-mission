'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Season } from '@/lib/gallery';

interface UI { open: string; download: string; photos: string; empty: string; back: string; }

export default function GalleryView({ seasons, names, ui }: { seasons: Season[]; names: Record<string, string>; ui: UI }) {
  const countryName = (id?: string) => (id ? names[id] : undefined);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [pi, setPi] = useState<number | null>(null);
  const season = openIdx != null ? seasons[openIdx] : null;

  const closePhoto = useCallback(() => setPi(null), []);
  const prev = useCallback(() => { if (season) setPi((p) => p == null ? 0 : (p - 1 + season.photos.length) % season.photos.length); }, [season]);
  const next = useCallback(() => { if (season) setPi((p) => p == null ? 0 : (p + 1) % season.photos.length); }, [season]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (pi != null) { if (e.key === 'Escape') closePhoto(); else if (e.key === 'ArrowLeft') prev(); else if (e.key === 'ArrowRight') next(); }
      else if (openIdx != null && e.key === 'Escape') setOpenIdx(null);
    };
    document.addEventListener('keydown', onKey);
    const lock = openIdx != null || pi != null;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [openIdx, pi, closePhoto, prev, next]);

  if (!seasons.length) return <p className="muted" style={{ maxWidth: 760 }}>{ui.empty}</p>;

  const cover = (s: Season) => (s.cover && s.photos.includes(s.cover) ? s.cover : s.photos[0]);

  return (
    <>
      <div className="galgrid">
        {seasons.map((s, i) => (
          <button key={s.id} className="galcard" onClick={() => { setOpenIdx(i); setPi(null); }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {cover(s) && <img src={cover(s)} alt="" loading="lazy" />}
            <span className="galcard__scrim" />
            <span className="galcard__count">{s.photos.length}</span>
            <div className="galcard__cap">
              <div className="galcard__meta">{s.date && <span>{s.date}</span>}{s.country && countryName(s.country) && <span>{countryName(s.country)}</span>}</div>
              <b>{s.title}</b>
            </div>
          </button>
        ))}
      </div>

      {/* 시즌 열람 오버레이 */}
      {season && (
        <div className="galview" role="dialog" aria-modal="true">
          <div className="galview__bar">
            <button className="galview__back" onClick={() => setOpenIdx(null)}>← {ui.back}</button>
            <div className="galview__title">
              <b>{season.title}</b>
              <span className="muted">{[season.date, season.country && countryName(season.country), `${season.photos.length} ${ui.photos}`].filter(Boolean).join(' · ')}</span>
            </div>
            <button className="galview__close" onClick={() => setOpenIdx(null)} aria-label="닫기">✕</button>
          </div>
          <div className="galview__grid">
            {season.photos.map((p, idx) => (
              <button key={idx} className="galthumb" onClick={() => setPi(idx)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 사진 라이트박스 */}
      {season && pi != null && (
        <div className="lb" onClick={closePhoto} role="dialog" aria-modal="true">
          <button className="lb__close" onClick={closePhoto} aria-label="닫기">✕</button>
          <div className="lb__inner" onClick={(e) => e.stopPropagation()}>
            <div className="lb__stage">
              {season.photos.length > 1 && <button className="lb__nav lb__nav--prev" onClick={prev} aria-label="이전">‹</button>}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lb__img" src={season.photos[pi]} alt={season.title} />
              {season.photos.length > 1 && <button className="lb__nav lb__nav--next" onClick={next} aria-label="다음">›</button>}
            </div>
            <div className="lb__meta">
              <div className="lb__title">{season.title}</div>
              <div className="lb__actions">
                <span style={{ opacity: .8 }}>{pi + 1} / {season.photos.length}</span>
                <a className="lb__btn" href={season.photos[pi]} target="_blank" rel="noreferrer">{ui.open} ↗</a>
                <a className="lb__btn lb__btn--primary" href={`${season.photos[pi]}?download`} download>{ui.download} ↓</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
