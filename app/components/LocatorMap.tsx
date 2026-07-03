'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

/**
 * 로케이터 미니맵 — 지형(terrain) 타일 위에 대상 국가를 하이라이트.
 * 휠 줌은 홈 지도와 동일한 방식(커서 앵커 고정 + 프레임 지수감쇠 lerp).
 */
export default function LocatorMap({ countryId }: { countryId: string }) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    let ro: ResizeObserver | null = null;
    let onWheel: ((e: WheelEvent) => void) | null = null;
    let raf = 0;
    let cancelled = false;

    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !elRef.current || mapRef.current) return;

      const map = L.map(elRef.current, {
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: false, // 커스텀 부드러운 휠 줌 사용
        dragging: true,
        doubleClickZoom: true,
        touchZoom: true,
        zoomSnap: 0,
        minZoom: 2,
        maxZoom: 16,
      });
      mapRef.current = map;
      map.zoomControl.setPosition('bottomright');

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16 }).addTo(map);

      // ── 홈과 동일한 부드러운 휠 줌 ──
      let targetZoom = map.getZoom();
      let anchorPx: import('leaflet').Point | null = null;
      const clampZ = (z: number) => Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), z));
      const wheelLoop = () => {
        const cz = map.getZoom();
        const anchor = anchorPx ? map.containerPointToLatLng(anchorPx) : map.getCenter();
        if (Math.abs(targetZoom - cz) < 0.006) { map.setZoomAround(anchor, targetZoom, { animate: false }); raf = 0; return; }
        map.setZoomAround(anchor, cz + (targetZoom - cz) * 0.32, { animate: false });
        raf = requestAnimationFrame(wheelLoop);
      };
      onWheel = (e: WheelEvent) => {
        e.preventDefault();
        map.stop();
        if (!raf) targetZoom = map.getZoom();
        const r = elRef.current!.getBoundingClientRect();
        anchorPx = L.point(e.clientX - r.left, e.clientY - r.top);
        const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * 400 : e.deltaY;
        targetZoom = clampZ(targetZoom + -dy * 0.0022);
        if (!raf) raf = requestAnimationFrame(wheelLoop);
      };
      elRef.current.addEventListener('wheel', onWheel, { passive: false });
      map.on('zoomend', () => { if (!raf) targetZoom = map.getZoom(); });

      try {
        const gj = await fetch(`/geo/${countryId}.geo.json`).then((r) => r.json());
        const layer = L.geoJSON(gj, {
          interactive: false,
          style: { color: '#0089c2', weight: 2, fillColor: '#00a7e1', fillOpacity: 0.22 },
        }).addTo(map);
        const b = layer.getBounds();
        map.fitBounds(b, { padding: [24, 24] });
        map.setView(b.getCenter(), Math.max(2, map.getZoom() - 0.7), { animate: false });
        targetZoom = map.getZoom();

        // 줌인할수록 하이라이트 페이드아웃 (저해상도 경계가 지형과 어긋나 어색해지므로)
        const baseZoom = map.getZoom();
        const updateHighlight = () => {
          const z = map.getZoom();
          const fade = Math.max(0, Math.min(1, 1 - (z - (baseZoom + 0.8)) / 1.8));
          layer.setStyle({ opacity: 0.9 * fade, fillOpacity: 0.22 * fade });
        };
        map.on('zoom zoomend', updateHighlight);
        updateHighlight();
      } catch {
        map.setView([20, 100], 3);
        targetZoom = 3;
      }

      ro = new ResizeObserver(() => map.invalidateSize());
      ro.observe(elRef.current);
      setTimeout(() => map.invalidateSize(), 60);
    })();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      if (onWheel && elRef.current) elRef.current.removeEventListener('wheel', onWheel);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [countryId]);

  return <div ref={elRef} className="locmap" aria-label="위치 지도" />;
}
