'use client'

import { useState } from 'react'
import type {
  FieldApprovalState,
  FieldChange,
  FocusedFieldInfo,
} from '../types/payload.js'
import { styles } from './toolbarStyles.js'
import type { DeployCheckResult } from './useContentApproval.js'

export interface ContentEditToolbarProps {
  focusedField: FocusedFieldInfo | null
  approvalState: FieldApprovalState | null
  changes: FieldChange[]
  saving: string | null
  onApprove: (fieldPath: string) => Promise<void>
  onRevoke: (fieldPath: string) => Promise<void>
  onRevert: (fieldPath: string) => Promise<void>
  onCheckDeploy: () => Promise<DeployCheckResult>
}

export function ContentEditToolbar({
  focusedField,
  approvalState,
  changes,
  saving,
  onApprove,
  onRevoke,
  onRevert,
  onCheckDeploy,
}: ContentEditToolbarProps) {
  const [showChanges, setShowChanges] = useState(false)
  const [deployResult, setDeployResult] = useState<DeployCheckResult | null>(
    null,
  )
  const [checkingDeploy, setCheckingDeploy] = useState(false)

  const handleCheckDeploy = async () => {
    setCheckingDeploy(true)
    try {
      const result = await onCheckDeploy()
      setDeployResult(result)
    } finally {
      setCheckingDeploy(false)
    }
  }

  return (
    <div data-feedtack-edit-ui style={styles.toolbar}>
      {/* Field-level actions */}
      {focusedField && (
        <div style={styles.fieldSection}>
          <span style={styles.fieldPath}>{focusedField.fieldPath}</span>
          {saving === focusedField.fieldPath && (
            <span style={styles.savingBadge}>saving…</span>
          )}
          {approvalState?.stale === false ? (
            <button
              type="button"
              style={styles.btnSecondary}
              onClick={() => onRevoke(focusedField.fieldPath)}
            >
              Unaccept
            </button>
          ) : (
            <button
              type="button"
              style={styles.btnPrimary}
              onClick={() => onApprove(focusedField.fieldPath)}
              disabled={saving === focusedField.fieldPath}
            >
              Approve
            </button>
          )}
        </div>
      )}

      {/* Changes panel toggle */}
      <button
        type="button"
        style={styles.btnGhost}
        onClick={() => {
          setShowChanges((v) => !v)
          setDeployResult(null)
        }}
      >
        Changes ({changes.length})
      </button>

      {/* Deploy gate */}
      <button
        type="button"
        style={deployResult?.approved ? styles.btnSuccess : styles.btnGhost}
        onClick={handleCheckDeploy}
        disabled={checkingDeploy}
      >
        {checkingDeploy ? 'Checking…' : 'Check deploy'}
      </button>

      {/* Changes panel */}
      {showChanges && changes.length > 0 && (
        <div style={styles.panel}>
          <div style={styles.panelTitle}>Session changes</div>
          {changes.map((c) => (
            <div key={c.fieldPath} style={styles.changeRow}>
              <div style={styles.changePath}>{c.fieldPath}</div>
              <div style={styles.changeValue} title={c.to}>
                {c.to.slice(0, 60)}
                {c.to.length > 60 ? '…' : ''}
              </div>
              <button
                type="button"
                style={styles.btnDanger}
                onClick={() => onRevert(c.fieldPath)}
                disabled={saving === c.fieldPath}
              >
                Revert
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Deploy result */}
      {deployResult && (
        <div style={styles.panel}>
          {deployResult.approved ? (
            <div style={styles.deployOk}>
              All fields approved — ready to deploy
            </div>
          ) : (
            <>
              <div style={styles.deployPendingTitle}>
                {deployResult.pending.length} field
                {deployResult.pending.length !== 1 ? 's' : ''} need approval:
              </div>
              {deployResult.pending.map((p) => (
                <div key={p} style={styles.deployPendingItem}>
                  {p}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
