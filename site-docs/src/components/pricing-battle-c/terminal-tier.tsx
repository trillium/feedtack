'use client'

import type { Tier } from '@/data/pricing-tiers'

interface TerminalTierProps {
  tier: Tier
  index: number
}

function AsciiBox({
  children,
  label,
  bright,
}: {
  children: React.ReactNode
  label: string
  bright?: boolean
}) {
  const cls = bright ? 'crt-text-bright' : 'crt-text'
  return (
    <div className={`${cls} text-sm leading-relaxed`}>
      <div>
        {'┌─── '}
        <span className={bright ? 'glow-pulse' : ''}>{label}</span>
        {' ───┐'}
      </div>
      <div className="pl-1">{children}</div>
      <div>{'└────────────────┘'}</div>
    </div>
  )
}

function scramble(text: string): string {
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789'
  return text
    .split('')
    .map((c) =>
      c === ' '
        ? ' '
        : Math.random() > 0.4
          ? chars[Math.floor(Math.random() * chars.length)]
          : c,
    )
    .join('')
}

function LockedTier({ tier }: { tier: Tier }) {
  return (
    <AsciiBox label="[ACCESS DENIED]">
      <div className="crt-text-red glitch-text my-2 text-lg font-bold">
        {'>>> '}{tier.name.toUpperCase()}{' <<<'}
      </div>
      <div className="crt-text-dim text-xs">
        {'  price: '}{tier.price}{'/mo'}
      </div>
      <div className="crt-text-dim mb-2 text-xs italic">
        {'  // '}{tier.subtitle}
      </div>
      <div className="crt-text-red my-1 text-xs">
        {'  STATUS: LOCKED -- contribute to unlock'}
      </div>
      <div className="my-2 space-y-0.5">
        {tier.features.map((f) => (
          <div key={f} className="crt-text-dim text-xs">
            {'  [x] '}{scramble(f)}
          </div>
        ))}
      </div>
      <div className="mt-3">
        <a
          href={tier.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="crt-text-red inline-block border border-[#ff3333]/40 px-3 py-1 text-xs
            transition-all hover:bg-[#ff3333]/10 hover:shadow-[0_0_12px_rgba(255,51,51,0.3)]"
        >
          {'$ '}{tier.cta.toLowerCase()}
        </a>
      </div>
    </AsciiBox>
  )
}

function FeaturedTier({ tier }: { tier: Tier }) {
  return (
    <AsciiBox label="[SELECTED] *" bright>
      <div className="crt-text-bright glow-pulse my-2 text-lg font-bold">
        {'>>> '}{tier.name.toUpperCase()}{' <<<'}
      </div>
      <div className="crt-text text-xs">
        {'  price: '}{tier.price}{'/mo  (yes, really)'}
      </div>
      <div className="crt-text-amber mb-2 text-xs italic">
        {'  // '}{tier.subtitle}
      </div>
      <div className="my-2 space-y-0.5">
        {tier.features.map((f) => (
          <div key={f} className="crt-text text-xs">
            {'  [*] '}{f}
          </div>
        ))}
      </div>
      <div className="mt-3">
        <span
          className="crt-text-bright inline-block border border-[#33ff33]/60 px-3 py-1
            text-xs transition-all hover:bg-[#33ff33]/10
            hover:shadow-[0_0_16px_rgba(51,255,51,0.3)]"
        >
          {'$ '}{tier.cta}
          <span className="blink-cursor" />
        </span>
      </div>
    </AsciiBox>
  )
}

function FreeTier({ tier }: { tier: Tier }) {
  return (
    <AsciiBox label={tier.name.toUpperCase()}>
      <div className="crt-text my-2 text-lg font-bold">
        {'>>> '}{tier.name.toUpperCase()}{' <<<'}
      </div>
      <div className="crt-text-dim text-xs">
        {'  price: '}{tier.price}{'/mo'}
      </div>
      <div className="crt-text-dim mb-2 text-xs italic">
        {'  // '}{tier.subtitle}
      </div>
      <div className="my-2 space-y-0.5">
        {tier.features.map((f) => (
          <div key={f} className="crt-text text-xs">
            {'  [+] '}{f}
          </div>
        ))}
      </div>
      <div className="mt-3">
        <span
          className="crt-text inline-block border border-[#33ff33]/40 px-3 py-1 text-xs
            transition-all hover:bg-[#33ff33]/10
            hover:shadow-[0_0_12px_rgba(51,255,51,0.2)]"
        >
          {'$ '}{tier.cta}
        </span>
      </div>
    </AsciiBox>
  )
}

export function TerminalTier({ tier, index }: TerminalTierProps) {
  const delayMs = index * 600

  return (
    <div
      className="boot-line"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {tier.locked ? (
        <LockedTier tier={tier} />
      ) : tier.featured ? (
        <FeaturedTier tier={tier} />
      ) : (
        <FreeTier tier={tier} />
      )}
    </div>
  )
}
