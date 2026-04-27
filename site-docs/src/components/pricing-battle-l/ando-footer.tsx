/**
 * AndoFooter — the quiet closing statement.
 * Open source. Nothing more needs to be said.
 */
export function AndoFooter() {
  return (
    <footer className="ando-emerge ando-emerge-6 py-24 text-center text-fd-muted-foreground lg:py-32">
      <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.3em]">
        Open source
      </p>
      <p className="mx-auto max-w-xs text-sm font-light italic leading-relaxed opacity-60">
        Feedtack is free because software that helps people communicate should
        belong to everyone.
      </p>
      <a
        href="https://github.com/trillium/feedtack"
        target="_blank"
        rel="noopener noreferrer"
        className="ando-cta relative mt-6 inline-block cursor-pointer font-mono text-[0.75rem] uppercase tracking-[0.15em] text-fd-muted-foreground"
      >
        View on GitHub
      </a>
    </footer>
  )
}
