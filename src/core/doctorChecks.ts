'use client'

/**
 * Individual setup-doctor checks. All read-only. Split from doctor.ts to
 * respect the repo's 250-line source cap; doctor.ts owns the runner/report.
 */

import { scanFields } from '../capture/content.js'
import { getFiberMode, hasFiberInDom } from '../capture/fiber.js'
import type { FeedtackAdapter } from '../types/adapter.js'
import { isContentAdapter, isContentEditAdapter } from '../types/adapter.js'
import type { FeedtackUser } from '../types/payload.js'

export type DoctorStatus = 'pass' | 'warn' | 'fail' | 'info'

export interface DoctorCheck {
  id: string
  label: string
  status: DoctorStatus
  detail: string
}

function check(
  id: string,
  label: string,
  status: DoctorStatus,
  detail: string,
): DoctorCheck {
  return { id, label, status, detail }
}

export function checkEnvironment(): DoctorCheck {
  if (typeof document === 'undefined') {
    return check(
      'environment',
      'Browser environment',
      'fail',
      'No DOM available — the doctor must run in the browser after mount, not during SSR/build.',
    )
  }
  return check('environment', 'Browser environment', 'pass', 'DOM available.')
}

export function checkSecureContext(): DoctorCheck {
  const hasSubtle = typeof crypto !== 'undefined' && !!crypto.subtle
  return hasSubtle
    ? check(
        'secure-context',
        'Web Crypto (content hashing)',
        'pass',
        'crypto.subtle available.',
      )
    : check(
        'secure-context',
        'Web Crypto (content hashing)',
        'warn',
        'crypto.subtle unavailable — content approval hashing will not work. Serve over HTTPS or localhost.',
      )
}

export function checkFiber(): DoctorCheck {
  const mode = getFiberMode()
  if (mode === 'disabled') {
    return check(
      'react-fiber',
      'React Fiber',
      'info',
      'FEEDTACK_FIBER_DISABLED=true — fiber introspection intentionally off; componentName will be null.',
    )
  }
  if (hasFiberInDom()) {
    return check(
      'react-fiber',
      'React Fiber',
      'pass',
      'Fiber keys found in the mounted DOM — component names will resolve.',
    )
  }
  return check(
    'react-fiber',
    'React Fiber',
    mode === 'optional' ? 'warn' : 'fail',
    mode === 'optional'
      ? 'No fiber found (FEEDTACK_FIBER_OPTIONAL=true) — payloads will carry fiberAvailable:false.'
      : 'No fiber found in the mounted DOM. Is this a React app, and did the doctor run after mount?',
  )
}

export function checkAdapter(adapter?: FeedtackAdapter): DoctorCheck[] {
  if (!adapter) {
    return [
      check(
        'adapter',
        'Adapter',
        'warn',
        'No adapter passed to the doctor — pass your adapter to verify its capabilities.',
      ),
    ]
  }
  const coreOk =
    typeof adapter.submit === 'function' &&
    typeof adapter.loadFeedback === 'function'
  const checks = [
    coreOk
      ? check(
          'adapter',
          'Adapter core',
          'pass',
          'submit() and loadFeedback() present.',
        )
      : check(
          'adapter',
          'Adapter core',
          'fail',
          'Adapter is missing submit() and/or loadFeedback() — feedback cannot round-trip.',
        ),
  ]
  const content = isContentAdapter(adapter)
  const edit = isContentEditAdapter(adapter)
  checks.push(
    check(
      'adapter-content',
      'Content approval support',
      'info',
      content
        ? `ContentAdapter implemented${edit ? ' + ContentEditAdapter (inline editing)' : ' (approval only — no inline editing)'}.`
        : 'Not implemented — useContentApproval/useContentEdit will no-op with this adapter.',
    ),
  )
  return checks
}

export function checkUser(currentUser?: FeedtackUser): DoctorCheck {
  if (!currentUser) {
    return check(
      'current-user',
      'Current user',
      'warn',
      'No currentUser passed to the doctor — pass it to verify attribution fields.',
    )
  }
  const missing = (['id', 'name', 'role'] as const).filter(
    (k) => !currentUser[k]?.trim?.(),
  )
  return missing.length === 0
    ? check(
        'current-user',
        'Current user',
        'pass',
        `id/name/role present ("${currentUser.name}", role ${currentUser.role}).`,
      )
    : check(
        'current-user',
        'Current user',
        'fail',
        `Missing or empty: ${missing.join(', ')} — attribution across pins, replies, and approvals needs all three.`,
      )
}

export function checkContentFields(): DoctorCheck {
  const fields = scanFields()
  if (fields.length === 0) {
    return check(
      'content-fields',
      'Content fields',
      'info',
      'No data-feedtack-field annotations on this page (only needed for content approval/editing).',
    )
  }
  const counts = new Map<string, number>()
  for (const f of fields) {
    counts.set(f.fieldPath, (counts.get(f.fieldPath) ?? 0) + 1)
  }
  const dupes = [...counts.entries()].filter(([, n]) => n > 1)
  return dupes.length > 0
    ? check(
        'content-fields',
        'Content fields',
        'warn',
        `${fields.length} annotated, but duplicate paths (last-write-wins hashing): ${dupes.map(([p]) => p).join(', ')}.`,
      )
    : check(
        'content-fields',
        'Content fields',
        'pass',
        `${fields.length} annotated field(s), all paths unique.`,
      )
}

export function checkProviderMounted(): DoctorCheck {
  const mounted = !!document.getElementById('feedtack-root')
  return mounted
    ? check(
        'provider',
        'FeedtackProvider',
        'pass',
        '#feedtack-root found — the provider is mounted.',
      )
    : check(
        'provider',
        'FeedtackProvider',
        'warn',
        '#feedtack-root not found — provider not mounted (or disabled). Run the doctor after mount.',
      )
}
