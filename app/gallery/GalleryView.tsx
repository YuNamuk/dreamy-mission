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

  const info = season ? ci(season.country) : undefined;

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

      {/* 상세 보기 — 사진 한 장에 집중하는 단순 구조 */}
      {season && (
        <div className="lbx" role="dialog" aria-modal="true">
          <header className="lbx__bar">
            <button className="lbx__back" onClick={close}>← {ui.backToGallery}</button>
            <div className="lbx__title">
              <b>{season.title}</b>
              <span>
                {info && `${info.flag} ${info.ko}`}
                {season.date && ` · ${season.date}`}
                {` · ${pi + 1}/${n}`}
              </span>
            </div>
            <div className="lbx__acts">
              <a className="lbx__btn" href={season.photos[pi]} target="_blank" rel="noreferrer">{ui.open}</a>
              <a className="lbx__btn" href={downloadUrl(season.photos[pi])} download>{ui.download}</a>
              <button className="lbx__btn" onClick={() => downloadAll(season)}>{ui.downloadAll}</button>
              <button className="lbx__close" onClick={close} aria-label="닫기">✕</button>
            </div>
          </header>

          <div className="lbx__stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {n > 1 && <button className="lbx__nav lbx__nav--prev" onClick={prev} aria-label="이전">‹</button>}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="lbx__img" src={thumb(season.photos[pi], 1600, 86)} alt={season.title} />
            {n > 1 && <button className="lbx__nav lbx__nav--next" onClick={next} aria-label="다음">›</button>}
          </div>

          {(season.description || (season.tags && season.tags.length > 0) || season.participants) && (
            <div className="lbx__note">
              {season.description && <p>{season.description}</p>}
              <div className="lbx__notemeta">
                {season.participants && <span>{ui.lPeople} · {season.participants}</span>}
                {season.tags?.map((tg) => <span key={tg}>#{tg}</span>)}
              </div>
            </div>
          )}

          {n > 1 && (
            <div className="lbx__strip" ref={filmRef}>
              {season.photos.map((p, idx) => (
                <button key={idx} className={`lbx__film${idx === pi ? ' is-on' : ''}`} onClick={() => setPi(idx)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb(p, 220, 62)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
