/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, //../calendar/:id 페이지에서 테스트 시 false 로 설정 (개발 모드에서만 동작)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.BACKEND_SERVER + '/:path*',
      },
    ];
  },
};

export default nextConfig;
