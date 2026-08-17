import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

/**
 * 디스플레이 서체(Montserrat) — 저장소에 내장한다.
 * next/font/google 로 두면 빌드할 때마다 Google 서버에서 받아 오는데,
 * 그 요청이 실패하면 빌드 자체가 깨진다(2026-08-17 배포 2회 연속 실패).
 * 한글은 원래 Atomy → 시스템 한글 서체 순으로 떨어지므로 별도 로딩을 두지 않는다.
 */
const display = localFont({
  src: [
    { path: '../public/fonts/montserrat-300.woff2', weight: '300', style: 'normal' },
    { path: '../public/fonts/montserrat-400.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/montserrat-500.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/montserrat-600.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/montserrat-700.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/montserrat-800.woff2', weight: '800', style: 'normal' },
    { path: '../public/fonts/montserrat-900.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '드리미학교 교육선교 아카이브 · 선교를 그리다',
  description:
    '2022년부터 동행한 여섯 나라의 교육선교 이야기 — 몽골·필리핀·캄보디아·인도네시아·인도·파키스탄. 드리미학교 배움관 1층 상설전 「선교를 그리다」.',
  openGraph: {
    title: '드리미학교 교육선교 아카이브 · 선교를 그리다',
    description: '2022년부터 동행한 여섯 나라의 교육선교 이야기.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={display.variable}>
      <body>
        {/* 새로고침 시 이전 스크롤 위치 복원 방지 → 항상 최상단(히어로)부터 표시 */}
        <script dangerouslySetInnerHTML={{ __html: "if('scrollRestoration' in history){history.scrollRestoration='manual';}" }} />
        {children}
      </body>
    </html>
  );
}
