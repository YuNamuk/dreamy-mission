import { resolvePhoto } from '@/lib/photos';

/**
 * 이미지 슬롯 — 실제 사진이 있으면 표시, 없으면 브랜드 플레이스홀더.
 * 우선순위: 편집 URL > public/archive 로컬 파일 > Supabase Storage 업로드본 > 플레이스홀더.
 */
export default function Photo({
  slot,
  hint,
  url,
  height,
  radius = 14,
}: {
  slot: string;
  hint: string;
  url?: string;
  height: number;
  radius?: number;
}) {
  const src = url || resolvePhoto(slot);

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={hint}
        loading="lazy"
        style={{
          width: '100%',
          height,
          objectFit: 'cover',
          borderRadius: radius,
          display: 'block',
          background: 'var(--wash)',
        }}
      />
    );
  }

  return (
    <div
      aria-label={hint}
      style={{
        width: '100%',
        height,
        borderRadius: radius,
        border: '1px solid var(--line)',
        background:
          'linear-gradient(150deg, var(--sky-soft) 0%, #fff 55%), radial-gradient(120% 90% at 80% 10%, rgba(108,92,231,0.06), transparent 60%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 12,
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.5 }}>
        <rect x="3" y="4" width="18" height="16" rx="3" stroke="var(--sky)" strokeWidth="1.6" />
        <circle cx="8.5" cy="9.5" r="1.8" fill="var(--sky)" />
        <path d="M4 17l4.5-4.5 3.5 3 3-3L20 16.5" stroke="var(--sky)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontSize: 11.5, color: 'var(--ink3)', lineHeight: 1.5, fontWeight: 500 }}>{hint}</span>
    </div>
  );
}
