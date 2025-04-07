/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Optional if you're using the new app directory in Next.js 13+
  },
  trailingSlash: true, // Optional, but necessary if you're using static hosting
};

module.exports = nextConfig;
