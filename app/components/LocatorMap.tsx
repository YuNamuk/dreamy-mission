'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

/**
 * 로케이터 미니맵 — 지형(terrain) 타일 위에 주변국을 배경으로, 대상 국가만 하이라이트.
 * 줌/드래그 가능(휠은 페이지 스크롤 보호를 위해 비활성, +/-·더블클릭·핀치로 줌).
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
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: false, // 페이지 스크롤 보호
        dragging: true,
        doubleClickZoom: true,
        touchZoom: true,
        zoomSnap: 0.25,
        minZoom: 2,
      });
      mapRef.current = map;
      map.zoomControl.setPosition('bottomright');

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
      }).addTo(map);

      try {
        const gj = await fetch(`/geo/${countryId}.geo.json`).then((r) => r.json());
        const layer = L.geoJSON(gj, {
          interactive: false,
          style: { color: '#0089c2', weight: 2, fillColor: '#00a7e1', fillOpacity: 0.22 },
        }).addTo(map);
        const b = layer.getBounds();
        map.fitBounds(b, { padding: [24, 24] });
        map.setView(b.getCenter(), Math.max(2, map.getZoom() - 0.7), { animate: false });
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
