/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // ../schedule/:id 페이지에서 테스트 시 false로 설정(해당 옵션은 개발모드에서만 동작함)
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
