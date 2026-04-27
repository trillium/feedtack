export function LockOverlay() {
  return (
    <div className="lock-overlay-new pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-3xl overflow-hidden">
      {/* Horizontal scan lines */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, currentColor 0, currentColor 1px, transparent 0, transparent 3px)',
        }}
      />

      {/* Frosted glass */}
      <div className="absolute inset-0 bg-fd-background/65 backdrop-blur-[14px]" />

      <div className="relative text-center px-8">
        {/* Lock icon with amber glow */}
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent shadow-[0_0_60px_-12px] shadow-amber-500/25">
          <svg
            viewBox="0 0 24 24"
            className="size-9 text-amber-500/70"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Locked tier"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <circle cx="12" cy="16.5" r="1.5" fill="currentColor" />
          </svg>
        </div>

        <p className="text-base font-bold tracking-tight text-fd-foreground">
          Submit a PR to unlock
        </p>
        <p className="mt-2 text-sm text-fd-muted-foreground max-w-[220px] mx-auto leading-relaxed">
          Open source contribution required.
          <br />
          Yes, really.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/8 px-4 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 tracking-wide">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-500 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-amber-500" />
          </span>
          Awaiting your PR
        </div>
      </div>
    </div>
  )
}
