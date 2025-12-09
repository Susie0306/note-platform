import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@udecode/plate-common',
    '@udecode/plate-basic-marks',
    '@udecode/plate-heading',
    '@udecode/plate-block-quote',
    '@udecode/plate-list',
    '@udecode/plate-paragraph',
    '@udecode/plate-serializer-md',
  ],
}

export default nextConfig
