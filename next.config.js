/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['pages', 'components', 'lib', 'hooks', 'context', 'app']
  }
};

module.exports = nextConfig;