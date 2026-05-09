/** Read the user-visible value from an annotated field element. */
export function getFieldValue(el: HTMLElement): string {
  if (isFormField(el)) {
    return (el as HTMLInputElement).placeholder || ''
  }
  return el.innerText
}

/** Write a value into an annotated field element. */
export function setFieldValue(el: HTMLElement, value: string): void {
  if (isFormField(el)) {
    ;(el as HTMLInputElement).placeholder = value
  } else {
    el.innerText = value
  }
}

/** Check if element is an input or textarea (form field). */
export function isFormField(el: HTMLElement): boolean {
  const tag = el.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea'
}

/** Find a field element by its field path. */
export function findFieldElement(fieldPath: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `[data-feedtack-field="${fieldPath}"]`,
  )
}

/** Build the toolbar props object from hook state. */
export function buildToolbarProps(
  focusedField: import('../types/payload.js').FocusedFieldInfo | null,
  approvalFields: import('../types/payload.js').FieldApprovalState[],
  changes: import('../types/payload.js').FieldChange[],
  saving: string | null,
  approval: {
    approve: (fieldPath: string) => Promise<void>
    revoke: (fieldPath: string) => Promise<void>
    checkDeploy: () => Promise<
      import('./useContentApproval.js').DeployCheckResult
    >
  },
  revert: (fieldPath: string) => Promise<void>,
): import('./ContentEditToolbar.js').ContentEditToolbarProps {
  const approvalState = focusedField
    ? (approvalFields.find((f) => f.fieldPath === focusedField.fieldPath) ??
      null)
    : null

  return {
    focusedField,
    approvalState,
    changes,
    saving,
    onApprove: approval.approve,
    onRevoke: approval.revoke,
    onRevert: revert,
    onCheckDeploy: approval.checkDeploy,
  }
}
