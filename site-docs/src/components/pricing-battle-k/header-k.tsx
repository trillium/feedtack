/**
 * Anderson-style page header — vintage hotel placard aesthetic.
 * Centered, symmetrical, with ornamental typography.
 */
import { StarOrnament } from './ornament'

export function HeaderK() {
  return (
    <header
      style={{
        textAlign: 'center',
        paddingTop: '5rem',
        paddingBottom: '1rem',
      }}
    >
      {/* Establishment year — vintage touch */}
      <p
        style={{
          fontFamily: 'var(--wa-font-display)',
          fontSize: '0.6rem',
          fontWeight: 600,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--wa-ink)',
          opacity: 0.4,
          margin: '0 0 1rem',
        }}
      >
        Est. 2025
      </p>

      {/* Main title */}
      <h1
        style={{
          fontFamily: 'var(--wa-font-display)',
          fontSize: 'clamp(1.75rem, 5vw, 3rem)',
          fontWeight: 300,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--wa-ink)',
          margin: '0 0 0.5rem',
          lineHeight: 1.1,
        }}
      >
        Rates &amp; Accommodations
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: 'var(--wa-font-body)',
          fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
          fontStyle: 'italic',
          color: 'var(--wa-ink)',
          opacity: 0.6,
          margin: '0 auto',
          maxWidth: '28rem',
          lineHeight: 1.5,
        }}
      >
        Choose the plan that&apos;s right for you.
        <br />
        Spoiler: they&apos;re all the same.
      </p>

      <StarOrnament />

      {/* Open source notice */}
      <p
        style={{
          fontFamily: 'var(--wa-font-display)',
          fontSize: '0.55rem',
          fontWeight: 600,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--wa-mustard)',
          margin: 0,
        }}
      >
        100% Open Source &mdash; Always Free
      </p>
    </header>
  )
}
