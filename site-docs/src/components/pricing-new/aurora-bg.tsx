import type { ReactNode } from 'react'

export function AuroraBg({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated aurora gradient mesh */}
      <div className="pricing-aurora" aria-hidden="true" />

      {/* Subtle grid overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(var(--fd-foreground) 1px, transparent 1px),
            linear-gradient(90deg, var(--fd-foreground) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Top edge fade to page background */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 z-10"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to bottom, var(--fd-background), transparent)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
