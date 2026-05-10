import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { ReactNode } from 'react'
import { DocsSubnavHeader } from '@/components/docs-subnav-header'
import { FeedtackLogo } from '@/components/logo'
import { source } from '@/lib/source'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: <FeedtackLogo />,
      }}
      slots={{ header: DocsSubnavHeader }}
    >
      {children}
    </DocsLayout>
  )
}
