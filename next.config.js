/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'devtimeimggen.onrender.com'
      }
    ]
  }
};

module.exports = nextConfig;
