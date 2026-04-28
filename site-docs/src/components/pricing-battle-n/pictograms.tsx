/**
 * Geometric pictograms inspired by Otl Aicher's Munich 1972 system.
 * Simple, bold, constructed from circles, rectangles, and lines.
 */

/** Free tier: figure with arms open — welcoming, accessible */
export function PictogramFree({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Free tier pictogram</title>
      {/* Head */}
      <circle cx="40" cy="16" r="8" fill={color} />
      {/* Body */}
      <rect x="36" y="26" width="8" height="24" rx="2" fill={color} />
      {/* Arms open */}
      <rect
        x="12"
        y="30"
        width="22"
        height="6"
        rx="3"
        fill={color}
        transform="rotate(-10 12 30)"
      />
      <rect
        x="46"
        y="28"
        width="22"
        height="6"
        rx="3"
        fill={color}
        transform="rotate(10 46 28)"
      />
      {/* Legs */}
      <rect
        x="34"
        y="48"
        width="6"
        height="22"
        rx="3"
        fill={color}
        transform="rotate(8 34 48)"
      />
      <rect
        x="40"
        y="48"
        width="6"
        height="22"
        rx="3"
        fill={color}
        transform="rotate(-8 40 48)"
      />
    </svg>
  )
}

/** Pro tier: figure running — dynamic, moving forward */
export function PictogramPro({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Pro tier pictogram</title>
      {/* Head */}
      <circle cx="42" cy="14" r="8" fill={color} />
      {/* Body — angled forward */}
      <rect
        x="38"
        y="24"
        width="8"
        height="22"
        rx="2"
        fill={color}
        transform="rotate(15 42 24)"
      />
      {/* Lead arm */}
      <rect
        x="36"
        y="28"
        width="20"
        height="6"
        rx="3"
        fill={color}
        transform="rotate(-30 36 28)"
      />
      {/* Trail arm */}
      <rect
        x="30"
        y="32"
        width="18"
        height="6"
        rx="3"
        fill={color}
        transform="rotate(150 30 32)"
      />
      {/* Lead leg */}
      <rect
        x="44"
        y="44"
        width="6"
        height="24"
        rx="3"
        fill={color}
        transform="rotate(-20 44 44)"
      />
      {/* Trail leg */}
      <rect
        x="34"
        y="44"
        width="6"
        height="24"
        rx="3"
        fill={color}
        transform="rotate(25 34 44)"
      />
    </svg>
  )
}

/** Enterprise tier: figure with raised torch — victory, achievement */
export function PictogramEnterprise({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Enterprise tier pictogram</title>
      {/* Head */}
      <circle cx="40" cy="20" r="8" fill={color} />
      {/* Body */}
      <rect x="36" y="30" width="8" height="22" rx="2" fill={color} />
      {/* Raised arm with trophy */}
      <rect
        x="44"
        y="14"
        width="6"
        height="22"
        rx="3"
        fill={color}
        transform="rotate(20 44 14)"
      />
      {/* Trophy/torch */}
      <rect x="54" y="4" width="12" height="8" rx="1" fill={color} />
      <rect x="58" y="8" width="4" height="8" rx="1" fill={color} />
      {/* Other arm */}
      <rect
        x="20"
        y="34"
        width="18"
        height="6"
        rx="3"
        fill={color}
        transform="rotate(-5 20 34)"
      />
      {/* Legs */}
      <rect
        x="35"
        y="50"
        width="6"
        height="22"
        rx="3"
        fill={color}
        transform="rotate(6 35 50)"
      />
      <rect
        x="41"
        y="50"
        width="6"
        height="22"
        rx="3"
        fill={color}
        transform="rotate(-6 41 50)"
      />
    </svg>
  )
}

export {
  PictogramCode,
  PictogramPin,
  PictogramShield,
  PictogramTarget,
} from './pictograms-small'
