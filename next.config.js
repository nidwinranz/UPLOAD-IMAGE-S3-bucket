/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      adjustFontFallbacks: false,
    },

    target: 'serverless', 
  };
  
  module.exports = nextConfig;
  