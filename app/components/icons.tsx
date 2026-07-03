/** 브랜드 결에 맞춘 라운드 2px 스트로크 아이콘 (Lucide 스타일). */
type P = { size?: number };
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export function IconGospel({ size = 24 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M12 21s-6.5-4.3-9-8.5C1.4 9.6 2.8 6 6 6c1.9 0 3.2 1.2 4 2.3C10.8 7.2 12.1 6 14 6c3.2 0 4.6 3.6 3 6.5-2.5 4.2-9 8.5-9 8.5" />
    </svg>
  );
}
export function IconEducation({ size = 24 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M12 4 2 9l10 5 10-5-10-5Z" />
      <path d="M6 11v5c0 1 2.7 2.5 6 2.5S18 17 18 16v-5" />
    </svg>
  );
}
export function IconService({ size = 24 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M11 13.5 8 11c-1-.9-2.6-.8-3.5.2-.9 1-.8 2.6.2 3.5l5.4 4.9c.7.6 1.8.6 2.5 0l5.4-4.9c1-.9 1.1-2.5.2-3.5-.9-1-2.5-1.1-3.5-.2l-3 2.5" />
      <path d="M12 15V4" />
    </svg>
  );
}
export function IconCommunity({ size = 24 }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.5M21 20c0-2.5-1.5-4.3-4-4.8" />
    </svg>
  );
}
export function IconFaith({ size = 24 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M12 3v18M12 7h4M8 7h4M9 21h6" />
    </svg>
  );
}
