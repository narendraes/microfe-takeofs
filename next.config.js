/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ajax.googleapis.com https://*.atlassian.net;
              style-src 'self' 'unsafe-inline' https://*.atlassian.net;
              img-src 'self' data: https://*.atlassian.net;
              connect-src 'self' https://*.atlassian.net;
              frame-src 'self' https://*.atlassian.net;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig 