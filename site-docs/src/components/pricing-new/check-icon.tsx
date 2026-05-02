export function CheckIcon({ color }: { color: string }) {
  return (
    <svg
      className="mt-0.5 size-4 shrink-0"
      viewBox="0 0 16 16"
      fill="none"
      role="img"
      aria-label="Included"
    >
      <circle cx="8" cy="8" r="8" fill={color} opacity={0.1} />
      <path
        d="M5 8.5l2 2 4-4.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
