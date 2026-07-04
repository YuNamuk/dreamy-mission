'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Visit } from '@/lib/content';

export default function VisitGallery({ visits }: { visits: Visit[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [pi, setPi] = useState(0);
  const v = open != null ? visits[open] : null;

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(() => { if (v) setPi((p) => (p - 1 + v.photos.length) % v.photos.length); }, [v]);
  const next = useCallback(() => { if (v) setPi((p) => (p + 1) % v.photos.length); }, [v]);

  useEffect(() => {
    if (open == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, close, prev, next]);

  const shown = visits.filter((x) => x.photos.length > 0);
  if (shown.length === 0) return null;

  return (
    <>
      <div className="visitgrid">
        {shown.map((vs) => {
          const realIdx = visits.indexOf(vs);
          const cover = vs.cover && vs.photos.includes(vs.cover) ? vs.cover : vs.photos[0];
          const coverIdx = Math.max(0, vs.photos.indexOf(cover));
          return (
            <button key={vs.id} className="vcard" onClick={() => { setPi(coverIdx); setOpen(realIdx); }}>
              <div className="vcard__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cover} alt="" loading="lazy" />
                <span className="vcard__scrim" />
                <span className="vcard__count">{vs.photos.length}장</span>
                <div className="vcard__cap">
                  {vs.date && <span className="vcard__date">{vs.date}</span>}
                  <b>{vs.label}</b>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {v && (
        <div className="lb" onClick={close} role="dialog" aria-modal="true">
          <button className="lb__close" onClick={close} aria-label="닫기">✕</button>
          <div className="lb__inner" onClick={(e) => e.stopPropagation()}>
            <div className="lb__stage">
              {v.photos.length > 1 && <button className="lb__nav lb__nav--prev" onClick={prev} aria-label="이전">‹</button>}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lb__img" src={v.photos[pi]} alt={v.label} />
              {v.photos.length > 1 && <button className="lb__nav lb__nav--next" onClick={next} aria-label="다음">›</button>}
            </div>
            <div className="lb__meta">
              <div className="lb__title">{v.date && <span>{v.date}</span>}{v.label}</div>
              <p style={{ opacity: .8 }}>{pi + 1} / {v.photos.length}</p>
            </div>
            {v.photos.length > 1 && (
              <div className="lb__thumbs">
                {v.photos.map((p, idx) => (
                  <button key={idx} className={`lb__thumb${idx === pi ? ' is-on' : ''}`} onClick={() => setPi(idx)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
