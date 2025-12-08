import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@udecode/plate-common',
    '@udecode/plate-serializer-md',
    '@udecode/plate-paragraph',
    '@udecode/plate-list',
    '@udecode/plate-basic-marks',
  ],
}

export default nextConfig
