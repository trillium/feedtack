'use client'

import { useCallback, useRef, useState } from 'react'
import type { FeedtackAdapter } from '../types/adapter.js'
import {
  isContentEditAdapter,
  warnIfNotContentEditAdapter,
} from '../types/adapter.js'
import type { FieldChange, FocusedFieldInfo } from '../types/payload.js'
import type { ContentEditToolbarProps } from './ContentEditToolbar.js'
import {
  buildToolbarProps,
  findFieldElement,
  getFieldValue,
  isFormField,
  setFieldValue,
} from './fieldDom.js'
import type {
  DeployCheckResult,
  UseContentApprovalResult,
} from './useContentApproval.js'
import { useContentApproval } from './useContentApproval.js'

export interface UseContentEditResult extends UseContentApprovalResult {
  active: boolean
  activate: () => Promise<void>
  deactivate: () => void
  changes: FieldChange[]
  revert: (fieldPath: string) => Promise<void>
  saving: string | null
  focusedField: FocusedFieldInfo | null
  toolbarProps: ContentEditToolbarProps
}

export function useContentEdit(
  adapter: FeedtackAdapter,
  userId: string,
): UseContentEditResult {
  const [active, setActive] = useState(false)
  const [changes, setChanges] = useState<FieldChange[]>([])
  const [saving, setSaving] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<FocusedFieldInfo | null>(
    null,
  )

  const storedValuesRef = useRef<Map<string, string>>(new Map())
  const [storedValuesVersion, setStoredValuesVersion] = useState(0)
  const storedValuesMap = storedValuesRef.current

  const approval = useContentApproval(adapter, userId, {
    storedValues: storedValuesMap,
  })

  const observerRef = useRef<MutationObserver | null>(null)
  const boundFieldsRef = useRef<Set<HTMLElement>>(new Set())
  const changesRef = useRef<FieldChange[]>([])

  const updateStoredValue = useCallback((fieldPath: string, value: string) => {
    storedValuesRef.current.set(fieldPath, value)
    setStoredValuesVersion((v) => v + 1)
  }, [])

  const handleFocus = useCallback((e: Event) => {
    const el = e.target as HTMLElement
    const fieldPath = el.dataset.feedtackField
    if (!fieldPath) return
    const storedValue =
      storedValuesRef.current.get(fieldPath) ?? getFieldValue(el)
    el.dataset.feedtackOriginal = storedValue
    setFocusedField({ element: el, fieldPath })
  }, [])

  const handleBlur = useCallback(
    async (e: Event) => {
      const el = e.target as HTMLElement
      const fieldPath = el.dataset.feedtackField
      if (!fieldPath) return

      setTimeout(() => {
        const f = document.activeElement
        if (
          !f ||
          f === document.body ||
          (f as HTMLElement).closest?.('[data-feedtack-edit-ui]')
        )
          return
        setFocusedField(null)
      }, 150)

      const value = getFieldValue(el)
      const original = el.dataset.feedtackOriginal ?? ''
      if (value === original) return
      if (!isContentEditAdapter(adapter)) return

      setSaving(fieldPath)
      try {
        await adapter.saveField(fieldPath, value)
        updateStoredValue(fieldPath, value)

        const existing = changesRef.current.find(
          (c) => c.fieldPath === fieldPath,
        )
        if (existing) {
          changesRef.current = changesRef.current.map((c) =>
            c.fieldPath === fieldPath
              ? { ...c, to: value, savedAt: Date.now() }
              : c,
          )
        } else {
          changesRef.current = [
            ...changesRef.current,
            { fieldPath, from: original, to: value, savedAt: Date.now() },
          ]
        }
        setChanges([...changesRef.current])
        void approval.rescan()
      } catch {
        setFieldValue(el, original)
      }
      setTimeout(() => setSaving(null), 1500)
    },
    [adapter, approval, updateStoredValue],
  )

  const bindField = useCallback(
    (el: HTMLElement) => {
      if (boundFieldsRef.current.has(el)) return
      if (el.querySelector('[data-feedtack-field]')) return
      boundFieldsRef.current.add(el)

      if (isFormField(el)) {
        el.style.cursor = 'pointer'
      } else {
        el.setAttribute('contenteditable', 'true')
        el.setAttribute('spellcheck', 'true')
      }
      el.addEventListener('focus', handleFocus)
      el.addEventListener('blur', handleBlur)
    },
    [handleFocus, handleBlur],
  )

  const unbindField = useCallback(
    (el: HTMLElement) => {
      boundFieldsRef.current.delete(el)
      el.removeAttribute('contenteditable')
      el.removeAttribute('spellcheck')
      el.style.cursor = ''
      delete el.dataset.feedtackOriginal
      el.removeEventListener('focus', handleFocus)
      el.removeEventListener('blur', handleBlur)
    },
    [handleFocus, handleBlur],
  )

  const setupFields = useCallback(() => {
    document
      .querySelectorAll<HTMLElement>('[data-feedtack-field]')
      .forEach(bindField)
  }, [bindField])

  const activate = useCallback(async () => {
    warnIfNotContentEditAdapter(adapter, 'activate')
    if (!isContentEditAdapter(adapter)) return

    document.body.setAttribute('data-feedtack-hydrating', 'true')
    try {
      const fields = await adapter.loadFields()
      for (const [fp, value] of Object.entries(fields)) {
        storedValuesRef.current.set(fp, value)
        const el = findFieldElement(fp)
        if (el) setFieldValue(el, value)
      }
      setStoredValuesVersion((v) => v + 1)
    } finally {
      document.body.removeAttribute('data-feedtack-hydrating')
    }

    setupFields()

    const observer = new MutationObserver(() => setupFields())
    observer.observe(document.body, { childList: true, subtree: true })
    observerRef.current = observer

    setActive(true)
    void approval.rescan()
  }, [adapter, setupFields, approval])

  const deactivate = useCallback(() => {
    observerRef.current?.disconnect()
    observerRef.current = null
    boundFieldsRef.current.forEach(unbindField)
    boundFieldsRef.current.clear()
    setActive(false)
    setFocusedField(null)
  }, [unbindField])

  const revert = useCallback(
    async (fieldPath: string) => {
      warnIfNotContentEditAdapter(adapter, 'revert')
      if (!isContentEditAdapter(adapter)) return

      const change = changesRef.current.find((c) => c.fieldPath === fieldPath)
      if (!change) return

      setSaving(fieldPath)
      try {
        await adapter.saveField(fieldPath, change.from)
        updateStoredValue(fieldPath, change.from)

        const el = findFieldElement(fieldPath)
        if (el) setFieldValue(el, change.from)

        changesRef.current = changesRef.current.filter(
          (c) => c.fieldPath !== fieldPath,
        )
        setChanges([...changesRef.current])
        void approval.rescan()
      } finally {
        setTimeout(() => setSaving(null), 1500)
      }
    },
    [adapter, approval, updateStoredValue],
  )

  const toolbarProps = buildToolbarProps(
    focusedField,
    approval.fields,
    changes,
    saving,
    approval,
    revert,
  )

  return {
    active,
    activate,
    deactivate,
    changes,
    revert,
    saving,
    focusedField,
    toolbarProps,
    fields: approval.fields,
    approve: approval.approve,
    revoke: approval.revoke,
    rescan: approval.rescan,
    checkDeploy: approval.checkDeploy,
  }
}
