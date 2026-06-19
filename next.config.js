/** @type {import('next').NextConfig} */
const nextConfig = {
  // @react-pdf/renderer must run server-side only
  serverExternalPackages: ['@react-pdf/renderer'],

  // Turbopack config (Next.js 16+ default)
  turbopack: {
    resolveAlias: {
      // Prevent canvas from being bundled client-side (react-pdf dependency)
      canvas: './empty-module.js',
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig
