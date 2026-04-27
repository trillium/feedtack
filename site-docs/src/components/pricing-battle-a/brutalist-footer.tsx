export function BrutalistFooter() {
  return (
    <footer
      className="border-t-4 border-fd-foreground bg-fd-background"
      style={{ fontFamily: 'monospace' }}
    >
      <div className="px-6 py-6 sm:px-12">
        {/* Pull quote */}
        <blockquote className="mb-6 border-l-4 border-fd-foreground pl-4">
          <p
            className="text-fd-foreground"
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              lineHeight: 1.3,
              maxWidth: '40ch',
            }}
          >
            &ldquo;Open source means the price tag is $0. The catch? There is no
            catch.&rdquo;
          </p>
          <cite
            className="mt-2 block text-fd-muted-foreground not-italic"
            style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
          >
            — The Maintainers
          </cite>
        </blockquote>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-fd-foreground pt-4">
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/trillium/feedtack"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-fd-foreground px-3 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-fd-foreground transition-colors hover:bg-fd-foreground hover:text-fd-background"
              style={{ borderRadius: 0, textDecoration: 'none' }}
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/feedtack"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-fd-foreground px-3 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-fd-foreground transition-colors hover:bg-fd-foreground hover:text-fd-background"
              style={{ borderRadius: 0, textDecoration: 'none' }}
            >
              npm
            </a>
          </div>
          <span className="text-[10px] text-fd-muted-foreground">
            feedtack — MIT — {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  )
}
