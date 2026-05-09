'use client'

import { useCallback, useEffect, useState } from 'react'
import { hashField, scanFields } from '../capture/content.js'
import type { FeedtackAdapter } from '../types/adapter.js'
import { isContentAdapter, warnIfNotContentAdapter } from '../types/adapter.js'
import type { FieldApprovalState } from '../types/payload.js'

export interface DeployCheckResult {
  approved: boolean
  pending: string[]
}

export interface UseContentApprovalOptions {
  /**
   * When provided, hash computation uses stored values from this map instead of
   * reading element.textContent from the DOM. Use when static-build values may
   * differ from live stored values (e.g. when used alongside useContentEdit).
   */
  storedValues?: Map<string, string>
}

export interface UseContentApprovalResult {
  fields: FieldApprovalState[]
  approve: (fieldPath: string) => Promise<void>
  revoke: (fieldPath: string) => Promise<void>
  rescan: () => Promise<void>
  checkDeploy: () => Promise<DeployCheckResult>
}

/**
 * Hook for managing content field approvals.
 * Requires an adapter that implements ContentAdapter.
 */
export function useContentApproval(
  adapter: FeedtackAdapter,
  userId: string,
  options?: UseContentApprovalOptions,
): UseContentApprovalResult {
  const [fields, setFields] = useState<FieldApprovalState[]>([])

  const getContentForField = useCallback(
    (fieldPath: string, domContent: string): string => {
      return options?.storedValues?.get(fieldPath) ?? domContent
    },
    [options?.storedValues],
  )

  const rescan = useCallback(async () => {
    warnIfNotContentAdapter(adapter, 'useContentApproval')
    if (!isContentAdapter(adapter)) {
      setFields([])
      return
    }

    const scanned = scanFields()
    const storedApprovals = await adapter.loadApprovals()
    const approvalMap = new Map(
      storedApprovals.map((s) => [s.fieldPath, s.approval]),
    )

    const states = await Promise.all(
      scanned.map(async (f): Promise<FieldApprovalState> => {
        const content = getContentForField(f.fieldPath, f.content)
        const currentHash = await hashField(content)
        const approval = approvalMap.get(f.fieldPath) ?? null
        return {
          fieldPath: f.fieldPath,
          approval,
          stale: approval === null || approval.hash !== currentHash,
        }
      }),
    )

    setFields(states)
  }, [adapter, getContentForField])

  useEffect(() => {
    void rescan()
  }, [rescan])

  const approve = useCallback(
    async (fieldPath: string) => {
      warnIfNotContentAdapter(adapter, 'approve')
      if (!isContentAdapter(adapter)) return

      const scanned = scanFields()
      const field = scanned.find((f) => f.fieldPath === fieldPath)
      if (!field) return

      const content = getContentForField(fieldPath, field.content)
      const hash = await hashField(content)
      const existing = fields.find((f) => f.fieldPath === fieldPath)
      const existingBy = existing?.approval?.by ?? []
      const by = existingBy.includes(userId)
        ? existingBy
        : [...existingBy, userId]

      await adapter.approve(fieldPath, {
        hash,
        by,
        at: new Date().toISOString(),
      })

      setFields((prev) =>
        prev.map((f) =>
          f.fieldPath === fieldPath
            ? {
                ...f,
                approval: { hash, by, at: new Date().toISOString() },
                stale: false,
              }
            : f,
        ),
      )
    },
    [adapter, userId, fields, getContentForField],
  )

  const revoke = useCallback(
    async (fieldPath: string) => {
      warnIfNotContentAdapter(adapter, 'revokeApproval')
      if (!isContentAdapter(adapter)) return

      await adapter.revokeApproval(fieldPath, userId)

      setFields((prev) =>
        prev.map((f) => {
          if (f.fieldPath !== fieldPath || !f.approval) return f
          const by = f.approval.by.filter((id) => id !== userId)
          const approval = by.length > 0 ? { ...f.approval, by } : null
          return { ...f, approval, stale: true }
        }),
      )
    },
    [adapter, userId],
  )

  const checkDeploy = useCallback(async (): Promise<DeployCheckResult> => {
    warnIfNotContentAdapter(adapter, 'checkDeploy')
    if (!isContentAdapter(adapter)) {
      return { approved: false, pending: [] }
    }

    const scanned = scanFields()
    const storedApprovals = await adapter.loadApprovals()
    const approvalMap = new Map(
      storedApprovals.map((s) => [s.fieldPath, s.approval]),
    )

    const pending: string[] = []
    await Promise.all(
      scanned.map(async (f) => {
        const content = getContentForField(f.fieldPath, f.content)
        const currentHash = await hashField(content)
        const approval = approvalMap.get(f.fieldPath) ?? null
        if (approval === null || approval.hash !== currentHash) {
          pending.push(f.fieldPath)
        }
      }),
    )

    return { approved: pending.length === 0, pending }
  }, [adapter, getContentForField])

  return { fields, approve, revoke, rescan, checkDeploy }
}
