import { defineConfig } from 'tsup'
import path from 'path'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'kits/index': 'src/kits/index.ts',
    'collaborative/index': 'src/collaborative/index.ts',
    'components/index': 'src/components/index.ts',
  },
  format: ['esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    'react',
    'react-dom',
    '@liveblocks/client',
    '@liveblocks/react',
    '@liveblocks/yjs',
  ],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    }
    // Resolve path aliases
    options.alias = {
      '@': path.resolve(__dirname, 'src'),
    }
  },
})
