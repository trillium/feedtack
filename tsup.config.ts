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
  {
    entry: {
      content: 'src/extension/content.ts',
      popup: 'src/extension/popup.ts',
      panel: 'src/extension/panel.ts',
      background: 'src/extension/background.ts',
    },
    outDir: 'dist/extension',
    format: ['iife'],
    outExtension: () => ({ js: '.js' }),
    dts: false,
    clean: false,
    minify: false,
    external: [],
    noExternal: [/.*/],
    platform: 'browser',
    onSuccess: 'bun run scripts/ping-reload.ts',
  },
])
