/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Use the Node.js runtime for server components
  serverExternalPackages: ['@supabase/auth-helpers-nextjs', '@supabase/supabase-js'],
  // Required for Netlify deployment with server components
  output: 'standalone',
  trailingSlash: true,
}

export default nextConfig
