/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Optional if you're using the new app directory in Next.js 13+
  },
  distDir: '.output', // Set the output directory to `.output`
};

module.exports = nextConfig;
