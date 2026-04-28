/**
 * AndoFooter — the quiet closing statement.
 * Open source. Nothing more needs to be said.
 */
export function AndoFooter() {
  return (
    <footer
      className="ando-emerge ando-emerge-6 py-24 lg:py-32 text-center"
      style={{ color: 'var(--ando-muted)' }}
    >
      <p className="text-[0.6875rem] tracking-[0.3em] uppercase font-medium mb-4">
        Open source
      </p>
      <p className="text-sm font-light italic opacity-60 max-w-xs mx-auto leading-relaxed">
        Feedtack is free because software that helps people communicate should
        belong to everyone.
      </p>
      <a
        href="https://github.com/trillium/feedtack"
        target="_blank"
        rel="noopener noreferrer"
        className="ando-cta mt-6 text-[0.75rem] tracking-[0.15em] uppercase inline-block"
      >
        View on GitHub
      </a>
    </footer>
  )
}
