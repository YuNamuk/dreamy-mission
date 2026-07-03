'use client';

import { useCallback, useEffect, useState } from 'react';

export interface Category {
  num: string;
  t: string;
  d: string;
  cover: string | null;
  photos: string[];
}

export default function CategoryGallery({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [pi, setPi] = useState(0);
  const cat = open != null ? categories[open] : null;

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(() => { if (cat) setPi((p) => (p - 1 + cat.photos.length) % cat.photos.length); }, [cat]);
  const next = useCallback(() => { if (cat) setPi((p) => (p + 1) % cat.photos.length); }, [cat]);

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

  return (
    <>
      <div className="catgrid">
        {categories.map((c, i) => (
          <button key={i} className="catcard" onClick={() => { setPi(0); setOpen(i); }}>
            <div className="catcard__media">
              {c.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.cover} alt="" loading="lazy" />
              ) : (
                <div className="catcard__ph" />
              )}
              <span className="catcard__count">{c.photos.length}장</span>
            </div>
            <div className="catcard__body">
              <div className="catcard__head">
                <span className="catcard__num">{c.num}</span>
                <h3>{c.t}</h3>
              </div>
              <p>{c.d}</p>
              <span className="catcard__more">사진 보기 →</span>
            </div>
          </button>
        ))}
      </div>

      {cat && (
        <div className="lb" onClick={close} role="dialog" aria-modal="true">
          <button className="lb__close" onClick={close} aria-label="닫기">✕</button>
          <div className="lb__inner" onClick={(e) => e.stopPropagation()}>
            <div className="lb__stage">
              {cat.photos.length > 1 && <button className="lb__nav lb__nav--prev" onClick={prev} aria-label="이전">‹</button>}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lb__img" src={cat.photos[pi]} alt={cat.t} onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }} />
              {cat.photos.length > 1 && <button className="lb__nav lb__nav--next" onClick={next} aria-label="다음">›</button>}
            </div>
            <div className="lb__meta">
              <div className="lb__title"><span>{cat.num}</span>{cat.t}</div>
              <p>{cat.d}</p>
            </div>
            {cat.photos.length > 1 && (
              <div className="lb__thumbs">
                {cat.photos.map((p, idx) => (
                  <button key={idx} className={`lb__thumb${idx === pi ? ' is-on' : ''}`} onClick={() => setPi(idx)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p} alt="" onError={(e) => { const el = e.currentTarget.closest('.lb__thumb') as HTMLElement | null; if (el) el.style.display = 'none'; }} />
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
