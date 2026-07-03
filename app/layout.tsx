import type { Metadata, Viewport } from 'next';
import { Montserrat, Noto_Sans_KR } from 'next/font/google';
import './globals.css';

const display = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

const notoKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-kr',
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
    <html lang="ko" className={`${display.variable} ${notoKr.variable}`}>
      <body>{children}</body>
    </html>
  );
}
