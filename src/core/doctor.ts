'use client'

/**
 * Setup doctor — a configuration quality check the integrating author runs to
 * verify Feedtack is wired correctly. Everything here is read-only: no tacks
 * are submitted, no adapter writes happen.
 *
 * Run it once in the browser after the app mounts, e.g. temporarily in a
 * useEffect or from the devtools console. In development it tells you, before
 * any stakeholder ever drops a pin, whether the pieces actually line up.
 */

import type { FeedtackAdapter } from '../types/adapter.js'
import type { FeedtackUser } from '../types/payload.js'
import type { DoctorCheck, DoctorStatus } from './doctorChecks.js'
import {
  checkAdapter,
  checkContentFields,
  checkEnvironment,
  checkFiber,
  checkProviderMounted,
  checkSecureContext,
  checkUser,
} from './doctorChecks.js'

export type { DoctorCheck, DoctorStatus } from './doctorChecks.js'

export interface FeedtackDoctorReport {
  /** True when no check failed. Warnings do not flip this. */
  ok: boolean
  checks: DoctorCheck[]
}

export interface FeedtackDoctorOptions {
  adapter?: FeedtackAdapter
  currentUser?: FeedtackUser
  /** Print a formatted report to the console (default true). */
  print?: boolean
}

const STATUS_ICON: Record<DoctorStatus, string> = {
  pass: '✓',
  warn: '⚠',
  fail: '✗',
  info: 'ℹ',
}

function printReport(report: FeedtackDoctorReport): void {
  console.group(
    `[feedtack] setup doctor — ${report.ok ? 'OK' : 'PROBLEMS FOUND'}`,
  )
  for (const c of report.checks) {
    const line = `${STATUS_ICON[c.status]} ${c.label}: ${c.detail}`
    if (c.status === 'fail') console.error(line)
    else if (c.status === 'warn') console.warn(line)
    else console.log(line)
  }
  console.groupEnd()
}

/**
 * Run the Feedtack setup doctor. Read-only; safe to call anywhere. Returns a
 * structured report and (by default) prints a formatted version to the console.
 */
export function runFeedtackDoctor(
  options: FeedtackDoctorOptions = {},
): FeedtackDoctorReport {
  const env = checkEnvironment()
  const checks: DoctorCheck[] =
    env.status === 'fail'
      ? [env]
      : [
          env,
          checkSecureContext(),
          checkFiber(),
          ...checkAdapter(options.adapter),
          checkUser(options.currentUser),
          checkContentFields(),
          checkProviderMounted(),
        ]

  const report: FeedtackDoctorReport = {
    ok: checks.every((c) => c.status !== 'fail'),
    checks,
  }
  if (options.print !== false) printReport(report)
  return report
}
