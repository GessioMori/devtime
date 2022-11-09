/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dotos.tech'
      }
    ],
    minimumCacheTTL: 0
  }
};

module.exports = nextConfig;
