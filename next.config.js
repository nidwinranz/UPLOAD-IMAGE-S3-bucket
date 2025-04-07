/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: '.vercel/output', // Important: match what next-on-pages expects
  trailingSlash: true,       // Optional but good for static hosting
  experimental: {
    // Ensures better compatibility with edge environments
    instrumentationHook: true,
  },
};

module.exports = nextConfig;
