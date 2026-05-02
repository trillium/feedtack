import { HomeLayout } from 'fumadocs-ui/layouts/home'
import type { ReactNode } from 'react'
import { FeedtackLogo } from '@/components/logo'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      githubUrl="https://github.com/trillium/feedtack"
      nav={{
        title: <FeedtackLogo />,
        url: '/',
      }}
      links={[
        { text: 'Docs', url: '/docs' },
        { text: 'Pricing', url: '/pricing' },
      ]}
    >
      {children}
    </HomeLayout>
  )
}
