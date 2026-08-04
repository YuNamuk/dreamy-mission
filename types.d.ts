/** world-atlas topojson 은 타입 선언이 없다 — 실루엣 계산(lib/silhouette.ts)에서만 쓰므로 최소 선언. */
declare module 'topojson-client' {
  export function feature(topology: unknown, object: unknown): unknown;
}
declare module 'world-atlas/countries-110m.json' {
  const value: unknown;
  export default value;
}
