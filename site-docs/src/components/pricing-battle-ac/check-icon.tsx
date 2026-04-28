import s from './pricing.module.css'

export function CheckIcon({ muted }: { muted?: boolean }) {
  return (
    <svg
      className={`${s.featureIcon} ${muted ? s.featureIconMuted : ''}`}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
