/** Open-source callout with parametric flowing aesthetic */
export function HadidOpenSource() {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      {/* Curved top border */}
      <div className="absolute inset-x-0 top-0 h-px" aria-hidden="true">
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 4"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M0,2 C360,0 720,4 1080,1 C1260,0 1380,3 1440,2"
            stroke="var(--color-fd-border)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <h2
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 300,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: 'var(--color-fd-foreground)',
          }}
        >
          Entirely open source
        </h2>
        <p
          className="mx-auto mt-4 max-w-md text-fd-muted-foreground"
          style={{ fontSize: '0.95rem', lineHeight: 1.7, fontWeight: 300 }}
        >
          Feedtack is MIT-licensed. No telemetry. No vendor lock-in. Just{' '}
          <code
            className="text-fd-foreground"
            style={{
              background: 'var(--color-fd-muted)',
              padding: '0.15rem 0.5rem',
              borderRadius: '20px 8px 20px 8px',
              fontSize: '0.85rem',
            }}
          >
            npm install feedtack
          </code>{' '}
          and you own everything.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/sponsors/trillium"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              padding: '0.7rem 1.75rem',
              borderRadius: '50px 16px 50px 16px',
              background:
                'linear-gradient(135deg, rgba(232,99,74,0.08), transparent)',
              border: '1px solid rgba(232,99,74,0.2)',
              color: 'var(--color-fd-foreground)',
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: '0.03em',
            }}
          >
            <svg
              viewBox="0 0 16 16"
              width={16}
              height={16}
              fill="currentColor"
              aria-label="Heart"
            >
              <path d="M8 14s-5.5-3.5-5.5-7A3.5 3.5 0 0 1 8 4.5 3.5 3.5 0 0 1 13.5 7C13.5 10.5 8 14 8 14z" />
            </svg>
            Sponsor
          </a>
          <a
            href="https://github.com/trillium/feedtack"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              padding: '0.7rem 1.75rem',
              borderRadius: '16px 50px 16px 50px',
              background:
                'linear-gradient(135deg, rgba(58,168,159,0.08), transparent)',
              border: '1px solid rgba(58,168,159,0.2)',
              color: 'var(--color-fd-foreground)',
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: '0.03em',
            }}
          >
            <svg
              viewBox="0 0 16 16"
              width={16}
              height={16}
              fill="currentColor"
              aria-label="Star"
            >
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
            </svg>
            Star on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
