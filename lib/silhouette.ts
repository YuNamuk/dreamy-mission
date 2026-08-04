import 'server-only';
import topo from 'world-atlas/countries-110m.json';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry, Position } from 'geojson';

/**
 * 나라 실루엣 SVG path — 선교지 카드 배경 워터마크용.
 * world-atlas(110m) 지오메트리를 정사각 viewBox(0 0 100 100)에 꽉 차게 정규화한다.
 * 지도 투영은 단순 등장방형(경위도 선형) + 위도별 가로 보정(cos φ) — 카드 워터마크에는 충분.
 */

const ISO: Record<string, number> = {
  mongolia: 496, philippines: 608, cambodia: 116, indonesia: 360, india: 356, pakistan: 586,
};

let cache: Map<number, string> | null = null;

function toPath(geom: Geometry): string {
  const rings: Position[][] = [];
  if (geom.type === 'Polygon') rings.push(...geom.coordinates);
  else if (geom.type === 'MultiPolygon') for (const poly of geom.coordinates) rings.push(...poly);
  if (!rings.length) return '';

  // 경도는 위도에 따라 좁아지므로 중앙 위도의 cos 로 보정(모양이 옆으로 퍼지는 것 방지)
  const lats = rings.flat().map((p) => p[1]);
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const kx = Math.cos((midLat * Math.PI) / 180) || 1;

  const pts = rings.map((r) => r.map(([lon, lat]) => [lon * kx, -lat] as const));
  const xs = pts.flat().map((p) => p[0]);
  const ys = pts.flat().map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = 100 / Math.max(maxX - minX, maxY - minY);
  const offX = (100 - (maxX - minX) * scale) / 2;
  const offY = (100 - (maxY - minY) * scale) / 2;
  const fx = (x: number) => ((x - minX) * scale + offX).toFixed(2);
  const fy = (y: number) => ((y - minY) * scale + offY).toFixed(2);

  return pts
    // 아주 작은 섬(필리핀·인도네시아)은 생략해 path 를 가볍게
    .filter((ring) => ring.length > 6)
    .map((ring) => `M${ring.map(([x, y]) => `${fx(x)},${fy(y)}`).join('L')}Z`)
    .join('');
}

function build(): Map<number, string> {
  const t = topo as { objects: { countries: unknown } };
  const fc = feature(t, t.objects.countries) as FeatureCollection;
  const m = new Map<number, string>();
  for (const f of fc.features) {
    const id = Number(f.id);
    if (Object.values(ISO).includes(id)) m.set(id, toPath(f.geometry));
  }
  return m;
}

/** 나라 id('mongolia' 등) → viewBox="0 0 100 100" 기준 SVG path d. 없으면 null. */
export function countrySilhouette(countryId: string): string | null {
  if (!cache) cache = build();
  const iso = ISO[countryId];
  return iso ? cache.get(iso) ?? null : null;
}
