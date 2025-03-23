/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    adjustFontFallbacks: false,  // Keep your experimental option here if you need it
  },
  output: 'export',  // Enables static HTML export for App Router
};

module.exports = nextConfig;
