export function TierLockOverlay() {
  return (
    <div className="lock-shimmer pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[1.25rem] overflow-hidden">
      {/* Scanline texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, currentColor 0, currentColor 1px, transparent 0, transparent 4px)',
        }}
      />
      {/* Frosted glass */}
      <div className="absolute inset-0 bg-fd-background/60 backdrop-blur-[10px]" />

      <div className="relative text-center px-6">
        {/* Lock icon container with glow */}
        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent shadow-[0_0_40px_-8px] shadow-amber-500/20">
          <svg
            viewBox="0 0 24 24"
            className="size-9 text-amber-500/80"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Locked"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <p className="text-base font-bold text-fd-foreground tracking-tight">
          Submit a PR to unlock
        </p>
        <p className="mt-1.5 text-sm text-fd-muted-foreground max-w-[200px] mx-auto leading-relaxed">
          Open source contribution required. Yes, really.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
          <span className="inline-block size-1.5 rounded-full bg-amber-500 animate-pulse" />
          Awaiting your PR
        </div>
      </div>
    </div>
  )
}
