export function PricingFooter() {
  return (
    <footer className="border-t border-fd-border/40 px-6 py-12 text-center">
      <p className="text-sm text-fd-muted-foreground">
        All tiers are identical because Feedtack is{' '}
        <a
          href="https://github.com/trillium/feedtack"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-fd-foreground underline decoration-fd-border underline-offset-4 transition-colors hover:decoration-blue-500"
        >
          open source
        </a>
        . The pricing page exists because every SaaS needs one.
      </p>
    </footer>
  )
}
