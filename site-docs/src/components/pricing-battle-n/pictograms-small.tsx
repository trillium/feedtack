/** Small feature pictograms for the decorative grid */
export function PictogramPin({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Pin</title>
      <circle
        cx="18"
        cy="13"
        r="8"
        stroke={color}
        strokeWidth="3"
        fill="none"
      />
      <line x1="18" y1="21" x2="18" y2="34" stroke={color} strokeWidth="3" />
    </svg>
  )
}

export function PictogramTarget({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Target</title>
      <circle
        cx="18"
        cy="18"
        r="14"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
      />
      <circle
        cx="18"
        cy="18"
        r="8"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
      />
      <circle cx="18" cy="18" r="3" fill={color} />
    </svg>
  )
}

export function PictogramCode({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Code</title>
      <polyline
        points="10,12 4,18 10,24"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="26,12 32,18 26,24"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="20" y1="8" x2="16" y2="28" stroke={color} strokeWidth="2.5" />
    </svg>
  )
}

export function PictogramShield({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Shield</title>
      <path
        d="M18 3 L30 9 L30 18 C30 26 18 33 18 33 C18 33 6 26 6 18 L6 9 Z"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
      />
      <polyline
        points="13,18 17,22 24,14"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
