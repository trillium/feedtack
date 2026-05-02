import Link from 'next/link'

export const metadata = {
  title: 'Pricing Battle — All Variants',
  description: 'Browse all pricing page design variants side by side.',
}

const VARIANTS = [
  { id: 'p', label: 'Neri Oxman', designer: 'Bio-Parametric' },
  { id: 'r', label: 'Muriel Cooper', designer: 'MIT Media Lab' },
  { id: 't', label: 'Scott Tolinski', designer: 'Bouncy Tutorial Energy' },
  { id: 'u', label: 'Scrappy Startup', designer: 'Move Fast, Ship It' },
  {
    id: 'y',
    label: 'Secretly a Giraffe',
    designer: 'Tall Cards, Savanna Tones',
  },
  { id: 'ac', label: 'UI Library Mashup', designer: 'Best of All Worlds' },
  { id: 'ae', label: 'Crypto Bro', designer: 'Neon Gradients, WAGMI' },
]

export default function PricingBattlePage() {
  return (
    <div className="min-h-screen bg-fd-background px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-fd-foreground">
          Pricing Battle
        </h1>
        <p className="mb-12 text-lg text-fd-muted-foreground">
          {VARIANTS.length} pricing page variants. Same data. Wildly different
          vibes. Pick your fighter.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VARIANTS.map((v) => (
            <Link
              key={v.id}
              href={`/pricing-battle-${v.id}`}
              className="group rounded-lg border border-fd-border bg-fd-card p-4 transition-colors hover:border-fd-primary hover:bg-fd-accent"
            >
              <div className="mb-1 flex items-baseline gap-2">
                <span className="font-mono text-xs text-fd-muted-foreground">
                  {v.id.toUpperCase()}
                </span>
                <span className="font-semibold text-fd-foreground group-hover:text-fd-primary">
                  {v.label}
                </span>
              </div>
              <p className="text-sm text-fd-muted-foreground">{v.designer}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
