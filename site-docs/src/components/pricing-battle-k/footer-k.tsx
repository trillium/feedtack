/**
 * Anderson-style footer section — vintage closing card.
 */
import { OrnamentalDivider, StarOrnament } from './ornament'

export function FooterK() {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '2rem 1.5rem 4rem',
        maxWidth: '32rem',
        margin: '0 auto',
      }}
    >
      <OrnamentalDivider />
      <StarOrnament />

      <p
        style={{
          fontFamily: 'var(--wa-font-body)',
          fontSize: '1.1rem',
          fontStyle: 'italic',
          color: 'var(--wa-ink)',
          opacity: 0.7,
          margin: '0 0 1.5rem',
          lineHeight: 1.6,
        }}
      >
        Feedtack is and will always be free, open-source software.
        <br />
        We believe feedback belongs to everyone.
      </p>

      <a
        href="https://github.com/trillium/feedtack"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: 'var(--wa-font-display)',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--wa-ink)',
          textDecoration: 'none',
          borderBottom: '1px solid var(--wa-border)',
          paddingBottom: '0.15rem',
          transition: 'border-color 0.2s',
        }}
      >
        View on GitHub
      </a>

      <div
        style={{
          marginTop: '3rem',
          fontFamily: 'var(--wa-font-display)',
          fontSize: '0.5rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--wa-ink)',
          opacity: 0.3,
        }}
      >
        A Feedtack Production
      </div>
    </footer>
  )
}
