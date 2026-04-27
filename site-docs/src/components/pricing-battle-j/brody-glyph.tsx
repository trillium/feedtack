/**
 * Deconstructed letterform glyphs in the style of Neville Brody's
 * custom typefaces for The Face magazine. Each glyph is a geometric
 * abstraction of its letter, built from pure SVG shapes.
 */

interface BrodyGlyphProps {
  letter: string
  size?: number
  accent?: string
  className?: string
}

function FreeLetter({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
      {/* Deconstructed F — three bars, angular displacement */}
      <rect x="15" y="10" width="12" height="100" fill={accent} />
      <rect x="15" y="10" width="80" height="12" fill={accent} />
      <rect
        x="15"
        y="50"
        width="55"
        height="10"
        fill={accent}
        opacity={0.6}
      />
      {/* Geometric accent — displaced triangle */}
      <polygon points="100,25 100,55 80,55" fill={accent} opacity={0.3} />
    </svg>
  )
}

function ProLetter({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
      {/* Deconstructed P — vertical + circular bowl */}
      <rect x="15" y="10" width="12" height="100" fill={accent} />
      <path
        d="M27 10 H65 Q95 10 95 40 Q95 70 65 70 H27"
        stroke={accent}
        strokeWidth="12"
        fill="none"
      />
      {/* Geometric accent — circle fragment */}
      <circle cx="90" cy="95" r="18" fill={accent} opacity={0.2} />
    </svg>
  )
}

function EnterpriseLetter({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
      {/* Deconstructed E — three horizontal bars + vertical */}
      <rect x="15" y="10" width="12" height="100" fill={accent} />
      <rect x="15" y="10" width="85" height="12" fill={accent} />
      <rect
        x="15"
        y="55"
        width="65"
        height="10"
        fill={accent}
        opacity={0.7}
      />
      <rect x="15" y="98" width="85" height="12" fill={accent} />
      {/* Geometric accent — rotated square */}
      <rect
        x="80"
        y="45"
        width="22"
        height="22"
        fill={accent}
        opacity={0.2}
        transform="rotate(45 91 56)"
      />
    </svg>
  )
}

const LETTER_MAP: Record<string, React.FC<{ accent: string }>> = {
  F: FreeLetter,
  P: ProLetter,
  E: EnterpriseLetter,
}

export function BrodyGlyph({
  letter,
  size = 120,
  accent = 'currentColor',
  className = '',
}: BrodyGlyphProps) {
  const LetterComponent = LETTER_MAP[letter]

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {LetterComponent ? (
        <LetterComponent accent={accent} />
      ) : (
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
          <rect x="10" y="10" width="100" height="100" fill={accent} />
        </svg>
      )}
    </div>
  )
}
