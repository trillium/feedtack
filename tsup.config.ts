import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      'node/index': 'src/node/index.ts',
      'react/index': 'src/react/index.ts',
    },
    format: ['esm'],
    dts: true,
    clean: true,
    external: ['react', 'react-dom'],
  },
  {
    entry: { 'feedtack.inject': 'src/inject/main.ts' },
    format: ['iife'],
    outExtension: () => ({ js: '.js' }),
    dts: false,
    clean: false,
    minify: true,
    external: [],
    noExternal: [/.*/],
    platform: 'browser',
  },
])
