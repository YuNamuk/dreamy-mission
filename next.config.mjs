/** @type {import('next').NextConfig} */
const nextConfig = {
  // 홈페이지(dreamyedu.net)로 이전 — 멀티존: 이 앱은 /mission 하위에서 서빙되고,
  // 홈페이지가 /mission/* 을 이 앱으로 프록시한다. (2026-07-31)
  basePath: '/mission',
  // 드리미 프로필 사진(공개 스토리지)을 next/image 로 쓸 때를 대비해 허용.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }],
  },
  // 옛 기본 도메인 접속은 대표 도메인으로 영구 이전
  async redirects() {
    return [
      {
        source: '/:path*',
        basePath: false,
        has: [{ type: 'host', value: 'dreamy-3.vercel.app' }],
        destination: 'https://mission.dreamyedu.net/mission/:path*',
        permanent: true,
      },
      // 옛 서브도메인 직접 접속(비-/mission 경로)은 홈페이지의 /mission 으로 이전
      {
        source: '/:path((?!mission|_next|favicon).*)',
        basePath: false,
        has: [{ type: 'host', value: 'mission.dreamyedu.net' }],
        destination: 'https://dreamyedu.vercel.app/mission/:path',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
