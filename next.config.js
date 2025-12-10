const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fix workspace root detection
  outputFileTracingRoot: path.join(__dirname),
  // Handle image domains if needed
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Skip type checking during build (we'll run it separately)
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig

