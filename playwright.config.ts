import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  testMatch: ['svg-animation-audit.spec.ts'],
  use: {
    headless: true,
  },
})
