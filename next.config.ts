import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    'platejs',
    '@platejs/core',
    '@platejs/utils',
    '@platejs/slate',
    '@platejs/basic-nodes',
    '@platejs/markdown',
    '@platejs/list',
    '@platejs/autoformat',
  ],
}

export default nextConfig
