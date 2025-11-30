/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  // Skip build-time rendering to avoid Firebase initialization errors
  output: 'standalone',
}

module.exports = nextConfig
