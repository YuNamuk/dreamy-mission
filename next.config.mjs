/** @type {import('next').NextConfig} */
const nextConfig = {
  // 드리미 프로필 사진(공개 스토리지)을 next/image 로 쓸 때를 대비해 허용.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }],
  },
  // 옛 기본 도메인 접속은 대표 도메인으로 영구 이전
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'dreamy-3.vercel.app' }],
        destination: 'https://mission.dreamyedu.net/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
