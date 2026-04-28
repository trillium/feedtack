/** Decorative leaf accent — a perfectly normal design choice for a pricing page */
export function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2C6.5 2 2 6.5 2 12c5-1 8-3 10-10z" />
      <path d="M12 2c0 5.5 2.5 9 10 10C22 6.5 17.5 2 12 2z" />
      <path d="M12 2v10" />
    </svg>
  )
}
