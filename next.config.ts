import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 0,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '{{SUPABASE_HOSTNAME}}', // ex: xxxx.supabase.co
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
