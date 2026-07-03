'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import 'leaflet/dist/leaflet.css';
import { LATLNG, SEOUL_LATLNG } from '@/lib/countries';
import { IconGospel, IconEducation, IconService, IconFaith } from './icons';

export interface HeroCountry {
  id: string;
  ko: string;
  en: string;
  pin: string | null;
  summary: string;
  status?: { year: string; items: string[] };
}
export interface JourneyRow {
  y: string;
  id: string;
  ko: string;
  en: string;
  desc: string;
}
export interface HeroText {
  l1: string;
  l2: string;
  l3: string;
  sub: string;
}

const VALUES = [
  { icon: <IconFaith size={15} />, ko: '복음', en: 'Gospel' },
  { icon: <IconEducation size={15} />, ko: '교육', en: 'Education' },
  { icon: <IconService size={15} />, ko: '섬김', en: 'Service' },
  { icon: <IconGospel size={15} />, ko: '사랑', en: 'Love' },
];

const LAYERS = {
  simple: { label: '기본', url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', subdomains: 'abcd', maxZoom: 19, attribution: 'OSM · CARTO' },
  terrain: { label: '지형', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', maxZoom: 19, attribution: 'Esri' },
  satellite: { label: '위성', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', maxZoom: 19, attribution: 'Esri' },
} as const;
type LayerKey = keyof typeof LAYERS;

// 라벨이 서로 겹치지 않도록 국가별 방향 지정
const LABEL_DIR: Record<string, 'left' | 'right' | 'top' | 'bottom'> = {
  mongolia: 'top', pakistan: 'left', india: 'right',
  philippines: 'right', cambodia: 'left', indonesia: 'bottom',
};

function curve(a: [number, number], b: [number, number], bend = 0.16, n = 36): [number, number][] {
  const [latA, lngA] = a; const [latB, lngB] = b;
  const midLat = (latA + latB) / 2, midLng = (lngA + lngB) / 2;
  const vx = lngB - lngA, vy = latB - latA;
  const len = Math.hypot(vx, vy) || 1, k = bend * len;
  const cLat = midLat + (vx / len) * k, cLng = midLng + (-vy / len) * k;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) { const t = i / n, mt = 1 - t; pts.push([mt * mt * latA + 2 * mt * t * cLat + t * t * latB, mt * mt * lngA + 2 * mt * t * cLng + t * t * lngB]); }
  return pts;
}

export default function MapHero({ countries, journey, hero, defaultLayer = 'terrain' }: { countries: HeroCountry[]; journey: JourneyRow[]; hero: HeroText; defaultLayer?: LayerKey }) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const tileRef = useRef<import('leaflet').TileLayer | null>(null);
  const [layer, setLayer] = useState<LayerKey>(defaultLayer);
  const router = useRouter();

  useEffect(() => {
    let ro: ResizeObserver | null = null;
    let onMore: ((e: Event) => void) | null = null;
    let onWheel: ((e: WheelEvent) => void) | null = null;
    let raf = 0;
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !elRef.current || mapRef.current) return;
      const map = L.map(elRef.current, {
        zoomControl: true,
        scrollWheelZoom: false, // 커스텀 부드러운 휠 줌 사용
        touchZoom: true,
        dragging: true,
        attributionControl: true,
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: true,
        zoomSnap: 0, // 완전 연속 줌
        zoomAnimation: true,
        fadeAnimation: true,
        inertia: true,
      });
      mapRef.current = map;
      map.zoomControl.setPosition('bottomright');
      const conf = LAYERS[defaultLayer];
      tileRef.current = L.tileLayer(conf.url, { maxZoom: conf.maxZoom, attribution: conf.attribution, ...('subdomains' in conf ? { subdomains: conf.subdomains } : {}) }).addTo(map);

      // ── 커스텀 부드러운 줌 (휠 입력 누적 → 프레임마다 지수감쇠 lerp, 커서 앵커 고정) ──
      let targetZoom = map.getZoom();
      let anchorPx: import('leaflet').Point | null = null;
      const clampZ = (z: number) => Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), z));
      const wheelLoop = () => {
        const cz = map.getZoom();
        const anchor = anchorPx ? map.containerPointToLatLng(anchorPx) : map.getCenter();
        if (Math.abs(targetZoom - cz) < 0.006) {
          map.setZoomAround(anchor, targetZoom, { animate: false });
          raf = 0;
          return;
        }
        map.setZoomAround(anchor, cz + (targetZoom - cz) * 0.32, { animate: false }); // scale += (target-scale)*0.32
        raf = requestAnimationFrame(wheelLoop);
      };
      onWheel = (e: WheelEvent) => {
        e.preventDefault();
        map.stop(); // 진행 중인 flyTo(클릭 줌) 즉시 중단 → 휠이 바로 먹히도록
        if (!raf) targetZoom = map.getZoom(); // 외부 이동(클릭 줌 등) 후 목표값 동기화
        const r = elRef.current!.getBoundingClientRect();
        anchorPx = L.point(e.clientX - r.left, e.clientY - r.top);
        const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * 400 : e.deltaY;
        targetZoom = clampZ(targetZoom + -dy * 0.0022);
        if (!raf) raf = requestAnimationFrame(wheelLoop);
      };
      elRef.current.addEventListener('wheel', onWheel, { passive: false });
      map.on('zoomend', () => { if (!raf) targetZoom = map.getZoom(); });

      const dests = countries.map((c) => LATLNG[c.id]).filter(Boolean) as [number, number][];
      for (const c of countries) {
        const d = LATLNG[c.id]; if (!d) continue;
        L.polyline(curve(SEOUL_LATLNG, d), { color: '#ffffff', weight: 1.6, opacity: 0.9, dashArray: '1 8', lineCap: 'round', interactive: false }).addTo(map);
        L.polyline(curve(SEOUL_LATLNG, d), { color: '#2f6fd0', weight: 1.1, opacity: 0.55, dashArray: '1 8', lineCap: 'round', interactive: false }).addTo(map);
      }

      L.marker(SEOUL_LATLNG, { interactive: false, icon: L.divIcon({ className: '', iconSize: [0, 0], iconAnchor: [0, 0],
        html: '<div style="transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:3px"><div style="width:12px;height:12px;border-radius:50%;background:#2f6fd0;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)"></div><div style="font-size:11px;font-weight:800;color:#0e2a52;white-space:nowrap;background:rgba(255,255,255,.9);padding:1px 8px;border-radius:999px;box-shadow:0 2px 6px rgba(14,36,56,.15)">드리미학교</div></div>' }) }).addTo(map);

      for (const c of countries) {
        const d = LATLNG[c.id]; if (!d) continue;
        const dir = LABEL_DIR[c.id] || 'right';
        const dot = c.pin
          ? `<img src="${c.pin}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;border:2.5px solid #fff;box-shadow:0 3px 12px rgba(14,36,56,.4)"/>`
          : `<span style="display:block;width:100%;height:100%;border-radius:50%;background:#2f6fd0;border:2.5px solid #fff;box-shadow:0 3px 12px rgba(14,36,56,.4)"></span>`;
        const pos = dir === 'left' ? 'right:calc(100% + 7px);top:50%;transform:translateY(-50%)'
          : dir === 'top' ? 'bottom:calc(100% + 8px);left:50%;transform:translateX(-50%)'
          : dir === 'bottom' ? 'top:calc(100% + 8px);left:50%;transform:translateX(-50%)'
          : 'left:calc(100% + 7px);top:50%;transform:translateY(-50%)';
        const m = L.marker(d, { title: c.ko, icon: L.divIcon({ className: '', iconSize: [0, 0], iconAnchor: [0, 0], popupAnchor: [0, -24],
          html: `<div style="position:relative;width:36px;height:36px;transform:translate(-50%,-50%);cursor:pointer">
            ${dot}
            <span style="position:absolute;${pos};background:rgba(255,255,255,.96);border-radius:9px;padding:3px 9px;box-shadow:0 3px 10px rgba(14,36,56,.2);white-space:nowrap;line-height:1.12">
              <b style="display:block;font-size:11.5px;font-weight:700;color:#0e2a52">${c.ko}</b>
              <span style="font-size:9px;font-weight:700;color:#a8b7c3;text-transform:uppercase;letter-spacing:.05em;font-family:var(--f-disp)">${c.en}</span>
            </span>
          </div>` }) }).addTo(map);
        const statusHtml = c.status && c.status.items.length
          ? `<div class="mm-pop__now"><div class="mm-pop__nowh">${c.status.year}<span>진행 중</span></div>${c.status.items.map((i) => `<div class="mm-pop__li"><i>–</i><span>${i}</span></div>`).join('')}</div>`
          : '';
        m.bindPopup(
          `<div class="mm-pop"><div class="mm-pop__hd"><b>${c.ko}</b><i>${c.en}</i></div><div class="mm-pop__sum">${c.summary}</div>${statusHtml}<a href="/${c.id}" class="mm-pop__more" data-detail="${c.id}">자세히 보기 →</a></div>`,
          { closeButton: true, minWidth: 216, maxWidth: 284, autoPan: false },
        );
        // 클릭 → Leaflet 내장 flyTo 로 부드럽게 줌인(지도 보여진 채, 타일 재로딩 없이). 팝업은 살짝 아래로.
        m.on('click', () => {
          const z = 5;
          const center = map.unproject(map.project(L.latLng(d), z).subtract(L.point(0, 90)), z);
          map.flyTo(center, z, { duration: 1.4, easeLinearity: 0.25 });
          map.once('moveend', () => {
            targetZoom = map.getZoom();
            m.openPopup();
          });
        });
      }

      // 팝업의 '자세히 보기' → SPA 이동
      onMore = (e: Event) => {
        const t = (e.target as HTMLElement)?.closest?.('.mm-pop__more');
        if (t) { e.preventDefault(); router.push(`/${t.getAttribute('data-detail')}`); }
      };
      elRef.current.addEventListener('click', onMore);

      const wide = window.innerWidth > 900;
      map.fitBounds(L.latLngBounds([SEOUL_LATLNG, ...dests]), { paddingTopLeft: [wide ? 300 : 20, 90], paddingBottomRight: [wide ? 320 : 20, 60] });
      ro = new ResizeObserver(() => map.invalidateSize()); ro.observe(elRef.current);
      setTimeout(() => map.invalidateSize(), 60);
    })();
    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      if (onMore && elRef.current) elRef.current.removeEventListener('click', onMore);
      if (onWheel && elRef.current) elRef.current.removeEventListener('wheel', onWheel);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [countries, router]);

  useEffect(() => {
    (async () => {
      const map = mapRef.current; if (!map) return;
      const L = (await import('leaflet')).default;
      if (tileRef.current) map.removeLayer(tileRef.current);
      const conf = LAYERS[layer];
      tileRef.current = L.tileLayer(conf.url, { maxZoom: conf.maxZoom, attribution: conf.attribution, ...('subdomains' in conf ? { subdomains: conf.subdomains } : {}) }).addTo(map);
      tileRef.current.bringToBack();
    })();
  }, [layer]);

  return (
    <section className="herox">
      <div ref={elRef} className="herox__map" aria-label="선교지 지도" />
      <div className="herox__scrim" />

      <div className="herox__overlay">
        <div className="herox__title">
          <h1 className="herox__h">
            {hero.l1}
            {hero.l3 ? <><br /><span className="acc">{hero.l3}</span></> : null}
            {hero.l2 ? <><br />{hero.l2}</> : null}
          </h1>
          <p className="herox__sub">
            {hero.sub.split('\n').filter(Boolean).map((line, i) => (
              <span key={i} style={{ display: 'block' }}>
                {line.split('**').map((part, j) => (j % 2 === 1 ? <b key={j} className="herox__em">{part}</b> : part))}
              </span>
            ))}
          </p>
          <div className="valuechips">
            {VALUES.map((v) => (
              <div key={v.ko} className="valuechip">{v.icon}<b>{v.ko}</b><span>{v.en}</span></div>
            ))}
          </div>
        </div>

        <aside className="tlpanel herox__journey">
          <div className="tlpanel__head">선교 발자취</div>
          <div className="tlpanel__eyebrow">Mission Journey</div>
          <div className="tlpanel__list">
            {journey.map((j) => (
              <Link key={j.y} href={`/${j.id}`} className="tl-row" style={{ display: 'block' }}>
                <div className="tl-row__year">{j.y}</div>
                <div className="tl-row__name">{j.ko}<em>{j.en}</em></div>
                <div className="tl-row__desc">{j.desc}</div>
              </Link>
            ))}
          </div>
        </aside>

        <div className="herox__switch" role="group" aria-label="지도 형태">
          {(Object.keys(LAYERS) as LayerKey[]).map((k) => (
            <button key={k} className={`herox__swbtn${layer === k ? ' is-on' : ''}`} onClick={() => setLayer(k)}>{LAYERS[k].label}</button>
          ))}
        </div>
      </div>
    </section>
  );
}
