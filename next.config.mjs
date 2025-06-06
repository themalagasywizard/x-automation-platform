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
  output: 'export',
  trailingSlash: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://dapxfjkdfrcwxfqrdvga.supabase.co",
              "connect-src 'self' https://dapxfjkdfrcwxfqrdvga.supabase.co https://api.twitter.com https://upload.twitter.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://dapxfjkdfrcwxfqrdvga.supabase.co",
              "frame-ancestors 'none'"
            ].join('; ')
          }
        ]
      }
    ]
  }
}

export default nextConfig
