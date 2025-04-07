/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Optional if you're using the new app directory in Next.js 13+
  },
  distDir: '.output', // Use '.output' for Cloudflare Pages
  trailingSlash: true, // Optional, but useful for static sites
};

module.exports = nextConfig;
