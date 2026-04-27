import { RootProvider } from 'fumadocs-ui/provider/next'
import 'fumadocs-ui/style.css'
import type { ReactNode } from 'react'
import { DocsFeedtackProvider } from '@/providers/FeedtackProvider'

export const metadata = {
  title: {
    template: '%s | Feedtack',
    default: 'Feedtack docs',
  },
  description: 'Documentation for Feedtack — drop-in React feedback overlay',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider
          theme={{
            enabled: true,
            defaultTheme: 'system',
            attribute: 'class',
            enableSystem: true,
          }}
        >
          <DocsFeedtackProvider>{children}</DocsFeedtackProvider>
        </RootProvider>
      </body>
    </html>
  )
}
