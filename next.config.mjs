/** @type {import('next').NextConfig} */
const nextConfig = {
  // 드리미 프로필 사진(공개 스토리지)을 next/image 로 쓸 때를 대비해 허용.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }],
  },
};

export default nextConfig;
