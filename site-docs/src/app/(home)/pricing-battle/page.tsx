import Link from 'next/link'

export const metadata = {
  title: 'Pricing Battle — All Variants',
  description: 'Browse all pricing page design variants side by side.',
}

const VARIANTS = [
  // Designers
  { id: 'a', label: 'Brutalist', designer: 'Brutalist Architecture' },
  { id: 'b', label: 'Editorial', designer: 'Magazine Typography' },
  { id: 'c', label: 'Terminal', designer: 'CRT / Retro Computing' },
  { id: 'd', label: 'Dieter Rams', designer: 'Braun / Swiss Minimalism' },
  { id: 'e', label: 'Saul Bass', designer: 'Movie Poster Geometry' },
  { id: 'f', label: 'Vignelli', designer: 'Helvetica Grid System' },
  { id: 'g', label: 'Zaha Hadid', designer: 'Parametric Curves' },
  { id: 'h', label: 'David Carson', designer: 'Deconstructed Type' },
  { id: 'i', label: 'Yayoi Kusama', designer: 'Polka Dots / Infinity' },
  { id: 'j', label: 'Neville Brody', designer: 'Post-Punk Editorial' },
  { id: 'k', label: 'Wes Anderson', designer: 'Symmetrical Pastel' },
  { id: 'l', label: 'Tadao Ando', designer: 'Concrete Minimalism' },
  { id: 'm', label: 'Rei Kawakubo', designer: 'Deconstructed Fashion' },
  { id: 'n', label: 'Otl Aicher', designer: 'Munich 72 Pictograms' },
  { id: 'o', label: 'Herb Lubalin', designer: 'Type-as-Image' },
  { id: 'p', label: 'Neri Oxman', designer: 'Bio-Parametric' },
  { id: 'q', label: 'Storm Thorgerson', designer: 'Surreal Album Art' },
  { id: 'r', label: 'Muriel Cooper', designer: 'MIT Media Lab' },
  { id: 's', label: 'El Lissitzky', designer: 'Constructivist' },
  // Dev tropes
  { id: 't', label: 'Scott Tolinski', designer: 'Bouncy Tutorial Energy' },
  { id: 'u', label: 'Scrappy Startup', designer: 'Move Fast, Ship It' },
  { id: 'v', label: 'Grumpy Grizzled Dev', designer: 'Plain HTML, No Fun' },
  { id: 'w', label: 'Tailwind Maximalist', designer: '47 Classes Per Div' },
  {
    id: 'x',
    label: 'Enterprise Architect',
    designer: 'Breadcrumbs & Footnotes',
  },
  // Wildcards
  {
    id: 'y',
    label: 'Secretly a Giraffe',
    designer: 'Tall Cards, Savanna Tones',
  },
  { id: 'z', label: 'Ghibli Employee', designer: 'Watercolor & Wind' },
  { id: 'aa', label: 'Marshall Mathers', designer: 'Detroit Grit, Mic Drops' },
  { id: 'ab', label: 'Clean Tailwind', designer: 'Just Well-Crafted' },
  { id: 'ac', label: 'UI Library Mashup', designer: 'Best of All Worlds' },
  { id: 'ad', label: 'Stock Mogul', designer: 'Bloomberg Meets Hermès' },
  { id: 'ae', label: 'Crypto Bro', designer: 'Neon Gradients, WAGMI' },
  {
    id: 'af',
    label: '5-Year-Old + Crayons',
    designer: 'Comic Sans & Rainbows',
  },
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
