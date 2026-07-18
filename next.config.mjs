/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdfkit'],
  experimental: {
    inlineCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/portal/admin',
        permanent: true,
      },
      {
        source: '/admin/news',
        destination: '/portal/admin',
        permanent: true,
      },
      {
        source: '/admin/vacancies',
        destination: '/portal/admin',
        permanent: true,
      },
      {
        source: '/career',
        destination: '/careers',
        permanent: true,
      },
      // Language subpath redirects (maps e.g. /ro/about to /about?lang=ro)
      {
        source: '/nl',
        destination: '/?lang=nl',
        permanent: true,
      },
      {
        source: '/de',
        destination: '/?lang=de',
        permanent: true,
      },
      {
        source: '/ro',
        destination: '/?lang=ro',
        permanent: true,
      },
      {
        source: '/nl/:path*',
        destination: '/:path*?lang=nl',
        permanent: true,
      },
      {
        source: '/de/:path*',
        destination: '/:path*?lang=de',
        permanent: true,
      },
      {
        source: '/ro/:path*',
        destination: '/:path*?lang=ro',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
