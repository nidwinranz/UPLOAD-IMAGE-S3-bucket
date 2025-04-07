/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: '.output', // Output directory for Cloudflare Pages
  trailingSlash: true, // Optional but useful for static sites
};

module.exports = nextConfig;
