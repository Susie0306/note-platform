import type { NextConfig } from 'next'
import path from 'path'

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
    '@platejs/yjs',
  ],
  webpack: (config) => {
    // Solve Yjs dual package hazard
    config.resolve.alias['yjs'] = path.resolve(__dirname, 'node_modules/yjs')
    return config
  },
  experimental: {
    // Force usage of webpack to support our alias fix, bypassing Turbopack for now
    // Or we can try to configure Turbopack aliases if we knew how, but Webpack is safer for Yjs compat.
    turbo: {
        resolveAlias: {
            'yjs': './node_modules/yjs/dist/yjs.mjs',
        }
    }
  }
}

export default nextConfig
