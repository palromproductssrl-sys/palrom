/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdfkit'],
  experimental: {
    inlineCss: true,
  },
};

export default nextConfig;
