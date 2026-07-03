'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

/**
 * 로케이터 미니맵 — 주변국을 배경으로, 대상 국가만 브랜드 컬러로 하이라이트.
 * 정적(비인터랙티브) 디자인 요소.
 */
export default function LocatorMap({ countryId }: { countryId: string }) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    let ro: ResizeObserver | null = null;
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !elRef.current || mapRef.current) return;

      const map = L.map(elRef.current, {
        zoomControl: false, attributionControl: false,
        dragging: false, scrollWheelZoom: false, doubleClickZoom: false,
        touchZoom: false, boxZoom: false, keyboard: false, zoomSnap: 0.1,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd', maxZoom: 12,
      }).addTo(map);

      try {
        const gj = await fetch(`/geo/${countryId}.geo.json`).then((r) => r.json());
        const layer = L.geoJSON(gj, {
          style: { color: '#0089c2', weight: 1.6, fillColor: '#00a7e1', fillOpacity: 0.3 },
        }).addTo(map);
        const b = layer.getBounds();
        map.fitBounds(b, { padding: [22, 22] });
        // 주변국이 보이도록 살짝 축소
        map.setView(b.getCenter(), Math.max(2, map.getZoom() - 0.8), { animate: false });
      } catch {
        map.setView([20, 100], 3);
      }

      ro = new ResizeObserver(() => map.invalidateSize());
      ro.observe(elRef.current);
      setTimeout(() => map.invalidateSize(), 60);
    })();
    return () => {
      cancelled = true;
      if (ro) ro.disconnect();
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [countryId]);

  return <div ref={elRef} className="locmap" aria-label="위치 지도" />;
}
