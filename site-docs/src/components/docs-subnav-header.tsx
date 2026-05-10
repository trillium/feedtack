'use client'

import { useDocsLayout } from 'fumadocs-ui/layouts/docs'
import type { ComponentProps } from 'react'

/**
 * Custom subnav header for the docs layout that omits the duplicate
 * search and sidebar toggle buttons (those are already present inside
 * the sidebar itself — see GitHub issue #43).
 */
export function DocsSubnavHeader({
  className,
  ...props
}: ComponentProps<'header'>) {
  const {
    isNavTransparent,
    slots,
    props: { nav },
  } = useDocsLayout()

  if (nav?.component) return nav.component

  const baseClass =
    '[grid-area:header] sticky top-(--fd-docs-row-1) z-30 flex items-center ps-4 pe-2.5 border-b transition-colors backdrop-blur-sm h-(--fd-header-height) md:hidden max-md:layout:[--fd-header-height:--spacing(14)] data-[transparent=false]:bg-fd-background/80'

  return (
    <header
      id="nd-subnav"
      data-transparent={isNavTransparent}
      {...props}
      className={className ? `${baseClass} ${className}` : baseClass}
    >
      {slots.navTitle && (
        <slots.navTitle className="inline-flex items-center gap-2.5 font-semibold" />
      )}
      <div className="flex-1">{nav?.children}</div>
    </header>
  )
}
