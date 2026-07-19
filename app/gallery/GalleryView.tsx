'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Season } from '@/lib/gallery';
import { thumb, downloadUrl } from '@/lib/img';

interface UI {
  open: string; download: string; downloadAll: string; photos: string; empty: string;
  backToGallery: string; lCountry: string; lMonth: string; lTitle: string; lPhoto: string; lPeople: string;
}
interface CInfo { ko: string; en: string; flag: string }

export default function GalleryView({ seasons, cinfo, ui }: { seasons: Season[]; cinfo: Record<string, CInfo>; ui: UI }) {
  const ci = (id?: string): CInfo | undefined => (id ? cinfo[id] : undefined);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [pi, setPi] = useState(0);
  const touchX = useRef<number | null>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const season = openIdx != null ? seasons[openIdx] : null;
  const n = season ? season.photos.length : 0;

  const close = useCallback(() => setOpenIdx(null), []);
  const prev = useCallback(() => { if (n) setPi((p) => (p - 1 + n) % n); }, [n]);
  const next = useCallback(() => { if (n) setPi((p) => (p + 1) % n); }, [n]);

  useEffect(() => {
    if (openIdx == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') prev(); else if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [openIdx, close, prev, next]);

  // 필름스트립에서 현재 사진을 화면에 보이게
  useEffect(() => {
    const el = filmRef.current?.querySelector('.is-on') as HTMLElement | null;
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [pi, openIdx]);

  function downloadAll(s: Season) {
    s.photos.forEach((p, i) => {
      setTimeout(() => { const a = document.createElement('a'); a.href = downloadUrl(p); a.download = ''; document.body.appendChild(a); a.click(); a.remove(); }, i * 350);
    });
  }
  function onTouchStart(e: React.TouchEvent) { touchX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 45) (dx < 0 ? next() : prev());
    touchX.current = null;
  }

  if (!seasons.length) return <p className="muted" style={{ maxWidth: 760 }}>{ui.empty}</p>;

  const coverOf = (s: Season) => (s.cover && s.photos.includes(s.cover) ? s.cover : s.photos[0]);
  const sideIdx = (offset: number) => (n ? ((pi + offset) % n + n) % n : 0);

  const info = season ? ci(season.country) : undefined;
  const leftFrames = n >= 3 ? [sideIdx(-2), sideIdx(-1)] : [];
  const rightFrames = n >= 3 ? [sideIdx(1), sideIdx(2)] : [];

  return (
    <>
      <div className="galgrid">
        {seasons.map((s, i) => {
          const cinf = ci(s.country);
          return (
            <button key={s.id} className="galcard" onClick={() => { setOpenIdx(i); setPi(0); }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="galcard__cover" src={thumb(coverOf(s), 640)} alt="" loading="lazy" />
              <span className="galcard__scrim" />
              <span className="galcard__count">{s.photos.length}</span>
              <div className="galcard__cap">
                <div className="galcard__meta">
                  {cinf && <><span className="galcard__flag">{cinf.flag}</span><span>{cinf.ko}</span><i>{cinf.en}</i></>}
                  {s.date && <span className="galcard__date">· {s.date}</span>}
                </div>
                <b>{s.title}</b>
              </div>
            </button>
          );
        })}
      </div>

      {/* 미술관 벽 상세 */}
      {season && (
        <div className="museum" role="dialog" aria-modal="true">
          <div className="museum__top">
            <button className="museum__back" onClick={close}>← {ui.backToGallery}</button>
            <button className="museum__close" onClick={close} aria-label="닫기">✕</button>
          </div>

          <div className="museum__wall">
            {n > 1 && <button className="museum__nav museum__nav--prev" onClick={prev} aria-label="이전">‹</button>}
            <div className="museum__side museum__side--left">
              {leftFrames.map((idx) => (
                <button key={idx} className="frame frame--sm" onClick={() => setPi(idx)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb(season.photos[idx], 460)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
            <div className="museum__center" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div className="frame frame--main">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(season.photos[pi], 1400, 84)} alt={season.title} />
              </div>
              <div className="museum__placard">
                {info && <b>{info.flag} {info.ko} <i>{info.en}</i></b>}
                <span>{season.date}</span>
              </div>
            </div>
            <div className="museum__side museum__side--right">
              {rightFrames.map((idx) => (
                <button key={idx} className="frame frame--sm" onClick={() => setPi(idx)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb(season.photos[idx], 460)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
            {n > 1 && <button className="museum__nav museum__nav--next" onClick={next} aria-label="다음">›</button>}
          </div>

          <div className="museum__info">
            <dl className="museum__meta">
              <div><i>🏳</i><span>{ui.lCountry}</span><b>{info ? `${info.ko} ${info.en}` : '-'}</b></div>
              <div><i>📅</i><span>{ui.lMonth}</span><b>{season.date ?? '-'}</b></div>
              <div><i>🏷</i><span>{ui.lTitle}</span><b>{season.title}</b></div>
              <div><i>🖼</i><span>{ui.lPhoto}</span><b>{pi + 1} / {n}</b></div>
              {season.participants && <div><i>👥</i><span>{ui.lPeople}</span><b>{season.participants}</b></div>}
            </dl>
            <div className="museum__desc">
              <h2>{season.title}</h2>
              {season.description && <p>{season.description}</p>}
              {season.tags && season.tags.length > 0 && (
                <div className="museum__tags">{season.tags.map((tg) => <span key={tg}>#{tg}</span>)}</div>
              )}
              <div className="museum__dactions">
                <a className="lb__btn" href={season.photos[pi]} target="_blank" rel="noreferrer">{ui.open} ↗</a>
                <a className="lb__btn lb__btn--primary" href={downloadUrl(season.photos[pi])} download>{ui.download} ↓</a>
                <button className="lb__btn" onClick={() => downloadAll(season)}>{ui.downloadAll} ↓</button>
              </div>
            </div>
          </div>

          <div className="museum__strip">
            {n > 1 && <button className="museum__stripnav" onClick={prev} aria-label="이전">‹</button>}
            <div className="museum__filmstrip" ref={filmRef}>
              {season.photos.map((p, idx) => (
                <button key={idx} className={`museum__film${idx === pi ? ' is-on' : ''}`} onClick={() => setPi(idx)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb(p, 220, 62)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
            {n > 1 && <button className="museum__stripnav" onClick={next} aria-label="다음">›</button>}
          </div>
        </div>
      )}
    </>
  );
}
