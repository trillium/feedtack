import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    exclude: [
      '**/node_modules/**',
      '**/site-docs/**',
      '**/.claude/**',
      '**/*.playwright.*',
      'svg-animation-audit.spec.ts',
    ],
  },
})
