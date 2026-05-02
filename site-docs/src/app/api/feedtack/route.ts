import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { type NextRequest, NextResponse } from 'next/server'
import { formatIssueBody, isRateLimited, PayloadSchema } from './helpers'

const GITHUB_REPO = 'trillium/feedtack'
const GITHUB_API = `https://api.github.com/repos/${GITHUB_REPO}/issues`
const LABEL = 'docs-feedback'

const isLocalDev = process.env.NODE_ENV === 'development'
const FEEDBACK_DIR = '.feedback'

// ---------------------------------------------------------------------------
// POST — create a GitHub issue from a Feedtack payload
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  const { limited, retryAfter } = isRateLimited(ip)
  if (limited) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = PayloadSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: result.error.issues },
      { status: 400 },
    )
  }

  const payload = result.data

  // In development, write to disk instead of creating GitHub issues
  if (isLocalDev) {
    await mkdir(FEEDBACK_DIR, { recursive: true })
    const item = { payload, replies: [], resolutions: [], archives: [] }
    await writeFile(
      join(FEEDBACK_DIR, `${payload.id}.json`),
      JSON.stringify(item, null, 2),
    )
    console.log(
      `[feedtack] Written to disk: ${FEEDBACK_DIR}/${payload.id}.json`,
    )
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const titleComment =
    payload.comment.length > 80
      ? `${payload.comment.slice(0, 77)}...`
      : payload.comment

  const ghRes = await fetch(GITHUB_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      title: `[Docs Feedback] ${titleComment}`,
      body: formatIssueBody(payload),
      labels: [LABEL],
    }),
  })

  if (!ghRes.ok) {
    const text = await ghRes.text()
    console.error('[feedtack] GitHub API error:', ghRes.status, text)
    return NextResponse.json(
      { error: 'Failed to create issue' },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}

// ---------------------------------------------------------------------------
// GET — fetch open docs-feedback issues, return as FeedbackItem[]
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')

  // In development, read from disk
  if (isLocalDev) {
    try {
      await mkdir(FEEDBACK_DIR, { recursive: true })
      const files = (await readdir(FEEDBACK_DIR)).filter((f) =>
        f.endsWith('.json'),
      )
      const items = await Promise.all(
        files.map(async (f) =>
          JSON.parse(await readFile(join(FEEDBACK_DIR, f), 'utf-8')),
        ),
      )
      const filtered = pathname
        ? items.filter((item) => item.payload?.page?.pathname === pathname)
        : items
      return NextResponse.json(filtered)
    } catch {
      return NextResponse.json([])
    }
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const ghRes = await fetch(
    `${GITHUB_API}?labels=${LABEL}&state=open&per_page=50`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      next: { revalidate: 30 },
    },
  )

  if (!ghRes.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 502 },
    )
  }

  const issues = (await ghRes.json()) as Array<{
    body: string
    number: number
  }>

  const items = issues
    .map((issue) => {
      try {
        const match = issue.body?.match(/```json\n([\s\S]*?)\n```/)
        if (!match?.[1]) return null
        const payload = JSON.parse(match[1])
        return {
          payload,
          replies: [],
          resolutions: [],
          archives: [],
        }
      } catch {
        return null
      }
    })
    .filter(
      (item): item is NonNullable<typeof item> =>
        item !== null &&
        (!pathname || item.payload?.page?.pathname === pathname),
    )

  return NextResponse.json(items)
}
