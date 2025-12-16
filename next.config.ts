import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@susie/editor',
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
    // Force all imports of 'yjs' to resolve to the ESM module
    config.resolve.alias['yjs$'] = path.resolve(__dirname, 'node_modules/yjs/dist/yjs.mjs')
    return config
  },
  // Note: turbo config removed as it's not supported in Next.js 16
  // We're using webpack with alias instead (see webpack config above)
}

export default nextConfig
