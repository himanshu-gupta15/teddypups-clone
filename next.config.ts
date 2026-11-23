import type { NextConfig } from 'next';

const config: NextConfig = {
  poweredByHeader: false,
  images: { qualities: [75, 85], minimumCacheTTL: 2678400 },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // This is an interview exercise, so keep it out of search results.
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ];
  },
};

export default config;
