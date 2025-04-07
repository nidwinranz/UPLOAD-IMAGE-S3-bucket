/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: '.vercel/output',
  trailingSlash: true,
  output: 'export',
};

module.exports = nextConfig;
