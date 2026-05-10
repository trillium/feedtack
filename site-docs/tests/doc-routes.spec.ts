import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { expect, test } from '@playwright/test'

const CONTENT_DIR = resolve(__dirname, '../content/docs')
const README_PATH = resolve(__dirname, '../../README.md')

/**
 * Discover all expected doc routes by walking meta.json files.
 * Each meta.json `pages` entry maps to a slug; entries prefixed
 * with `...` are folder references (handled by recursion).
 */
function discoverRoutes(dir: string, prefix: string): string[] {
  const metaPath = join(dir, 'meta.json')
  if (!existsSync(metaPath)) return []

  const meta = JSON.parse(readFileSync(metaPath, 'utf-8'))
  const routes: string[] = []

  for (const page of meta.pages ?? []) {
    if (page.startsWith('...')) {
      // folder reference — recurse into subdirectory
      const subdir = page.slice(3)
      routes.push(...discoverRoutes(join(dir, subdir), `${prefix}/${subdir}`))
    } else {
      // "index" maps to the folder route itself
      const route = page === 'index' ? prefix : `${prefix}/${page}`
      routes.push(route)
    }
  }

  return routes
}

/**
 * Extract doc links from the README that point to site-docs content.
 * Matches:
 *   (site-docs/content/docs/concepts/content-approval.mdx)  — legacy source paths
 *   (/docs/concepts/content-approval)                        — relative paths
 *   (https://feedtack.vercel.app/docs/concepts/...)          — absolute live URLs
 */
function extractReadmeDocLinks(): string[] {
  const readme = readFileSync(README_PATH, 'utf-8')
  const links: string[] = []

  // Match links to site-docs content files
  const sourcePattern = /\(site-docs\/content\/docs\/(.+?)\.mdx\)/g
  for (const match of readme.matchAll(sourcePattern)) {
    links.push(`/docs/${match[1]}`)
  }

  // Match relative /docs/ links
  const relativePattern = /\(\/docs\/([^)]+)\)/g
  for (const match of readme.matchAll(relativePattern)) {
    links.push(`/docs/${match[1]}`)
  }

  // Match absolute feedtack.vercel.app/docs/ links
  const absolutePattern = /\(https:\/\/feedtack\.vercel\.app\/docs\/([^)]+)\)/g
  for (const match of readme.matchAll(absolutePattern)) {
    links.push(`/docs/${match[1]}`)
  }

  return links
}

// Discover all routes from meta.json files
const allRoutes = discoverRoutes(CONTENT_DIR, '/docs')

test.describe('doc routes from meta.json', () => {
  for (const route of allRoutes) {
    test(`${route} resolves`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)
    })
  }
})

test.describe('README doc links', () => {
  const readmeLinks = extractReadmeDocLinks()

  for (const link of readmeLinks) {
    test(`README link ${link} resolves`, async ({ page }) => {
      const response = await page.goto(link)
      expect(response?.status()).toBe(200)
    })
  }

  test('README contains at least one doc link', () => {
    expect(readmeLinks.length).toBeGreaterThan(0)
  })
})
