'use client'

import { useCallback, useState } from 'react'

const PKG_VERSION = '1.2.0'
const CDN_BASE = `https://unpkg.com/feedtack@${PKG_VERSION}/dist/feedtack.inject.js`

function validateUrl(url: string): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return 'URL must use https: protocol'
    return null
  } catch {
    return 'Invalid URL'
  }
}

function buildSnippet(
  webhookUrl: string,
  userId: string,
  userName: string,
  userRole: string,
): string {
  const hasConfig = webhookUrl || userId || userName || userRole
  const configParts: string[] = []

  if (webhookUrl) {
    configParts.push(`webhookUrl:'${webhookUrl}'`)
  }

  const userParts: string[] = []
  if (userId) userParts.push(`id:'${userId}'`)
  if (userName) userParts.push(`name:'${userName}'`)
  if (userRole) userParts.push(`role:'${userRole}'`)
  if (userParts.length > 0) {
    configParts.push(`user:{${userParts.join(',')}}`)
  }

  const configStr = hasConfig
    ? `window.__feedtack={${configParts.join(',')}};`
    : ''

  return `(function(){${configStr}var s=document.createElement('script');s.src='${CDN_BASE}';document.head.appendChild(s)})()`
}

function buildBookmarklet(snippet: string): string {
  return `javascript:void(${snippet})`
}

export default function SnippetBuilderPage() {
  const [webhookUrl, setWebhookUrl] = useState('')
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')
  const [copied, setCopied] = useState<'snippet' | 'bookmarklet' | null>(null)

  const urlError = webhookUrl ? validateUrl(webhookUrl) : null
  const snippet = buildSnippet(webhookUrl, userId, userName, userRole)
  const bookmarklet = buildBookmarklet(snippet)

  const copy = useCallback(
    async (text: string, type: 'snippet' | 'bookmarklet') => {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    },
    [],
  )

  const inputClass =
    'w-full rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground placeholder:text-fd-muted-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary'

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-fd-foreground">
        Snippet Builder
      </h1>
      <p className="mt-2 text-fd-muted-foreground">
        Generate a console snippet or bookmarklet to inject Feedtack into any
        page. Version-pinned to{' '}
        <code className="text-xs bg-fd-muted px-1 py-0.5 rounded">
          v{PKG_VERSION}
        </code>
        .
      </p>

      <div className="mt-8 space-y-6">
        {/* Webhook URL */}
        <div>
          <label
            htmlFor="webhook-url"
            className="block text-sm font-medium text-fd-foreground mb-1"
          >
            Webhook URL{' '}
            <span className="text-fd-muted-foreground">(optional)</span>
          </label>
          <input
            id="webhook-url"
            type="url"
            className={inputClass}
            placeholder="https://your-api.example.com/feedtack"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
          {urlError && <p className="mt-1 text-sm text-red-500">{urlError}</p>}
          <p className="mt-1 text-xs text-fd-muted-foreground">
            Leave empty for clipboard mode (JSON copied on submit).
          </p>
        </div>

        {/* User identity */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-fd-foreground">
            User Identity{' '}
            <span className="text-fd-muted-foreground">(optional)</span>
          </legend>
          <div className="grid grid-cols-3 gap-3">
            <input
              className={inputClass}
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Role"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            />
          </div>
          <p className="text-xs text-fd-muted-foreground">
            Defaults to anonymous reviewer if omitted.
          </p>
        </fieldset>

        {/* Console snippet */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-fd-foreground">
              Console Snippet
            </span>
            <button
              type="button"
              onClick={() => copy(snippet, 'snippet')}
              disabled={!!urlError}
              className="text-xs font-medium text-fd-primary hover:underline disabled:opacity-50"
            >
              {copied === 'snippet' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-lg border border-fd-border bg-fd-muted p-3 text-xs leading-relaxed text-fd-foreground">
            {snippet}
          </pre>
        </div>

        {/* Bookmarklet */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-fd-foreground">
              Bookmarklet
            </span>
            <button
              type="button"
              onClick={() => copy(bookmarklet, 'bookmarklet')}
              disabled={!!urlError}
              className="text-xs font-medium text-fd-primary hover:underline disabled:opacity-50"
            >
              {copied === 'bookmarklet' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="mb-2 text-xs text-fd-muted-foreground">
            Drag this link to your bookmarks bar:
          </p>
          <a
            href={urlError ? undefined : bookmarklet}
            className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-4 py-2 text-sm font-medium text-fd-foreground shadow-sm hover:bg-fd-muted transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Feedtack
          </a>
        </div>
      </div>
    </div>
  )
}
