import type React from 'react'
import { useCallback, useRef, useState } from 'react'
import type { FeedtackAdapter } from '../types/adapter.js'
import { isContentEditAdapter } from '../types/adapter.js'
import type { FieldChange } from '../types/payload.js'
import { getFieldValue, setFieldValue } from './fieldDom.js'

export interface FieldChangesResult {
  changes: FieldChange[]
  changesRef: React.MutableRefObject<FieldChange[]>
  recordChange: (fieldPath: string, original: string, value: string) => void
  removeChange: (fieldPath: string) => void
  handleBlurSave: (
    el: HTMLElement,
    adapter: FeedtackAdapter,
    updateStoredValue: (fieldPath: string, value: string) => void,
    onSaved: () => void,
  ) => Promise<void>
  saving: string | null
  setSaving: (v: string | null) => void
}

export function useFieldChanges(): FieldChangesResult {
  const [changes, setChanges] = useState<FieldChange[]>([])
  const [saving, setSaving] = useState<string | null>(null)
  const changesRef = useRef<FieldChange[]>([]) as React.MutableRefObject<
    FieldChange[]
  >

  const recordChange = useCallback(
    (fieldPath: string, original: string, value: string) => {
      const existing = changesRef.current.find((c) => c.fieldPath === fieldPath)
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
    },
    [],
  )

  const removeChange = useCallback((fieldPath: string) => {
    changesRef.current = changesRef.current.filter(
      (c) => c.fieldPath !== fieldPath,
    )
    setChanges([...changesRef.current])
  }, [])

  const handleBlurSave = useCallback(
    async (
      el: HTMLElement,
      adapter: FeedtackAdapter,
      updateStoredValue: (fieldPath: string, value: string) => void,
      onSaved: () => void,
    ) => {
      const fieldPath = el.dataset.feedtackField
      if (!fieldPath) return

      const value = getFieldValue(el)
      const original = el.dataset.feedtackOriginal ?? ''
      if (value === original) return
      if (!isContentEditAdapter(adapter)) return

      setSaving(fieldPath)
      try {
        await adapter.saveField(fieldPath, value)
        updateStoredValue(fieldPath, value)
        recordChange(fieldPath, original, value)
        onSaved()
      } catch {
        setFieldValue(el, original)
      }
      setTimeout(() => setSaving(null), 1500)
    },
    [recordChange],
  )

  return {
    changes,
    changesRef,
    recordChange,
    removeChange,
    handleBlurSave,
    saving,
    setSaving,
  }
}
