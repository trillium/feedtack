export function TwFooter() {
  return (
    <footer className="relative flex flex-col items-center gap-4 overflow-hidden px-4 pb-12 pt-8 text-center sm:gap-6 sm:px-6 sm:pb-16 sm:pt-12 md:px-8 md:pb-20 md:pt-16">
      {/* Gradient divider */}
      <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-slate-700 to-transparent sm:max-w-sm md:max-w-md" />

      <p className="max-w-md text-xs leading-relaxed text-slate-500 sm:max-w-lg sm:text-sm md:max-w-xl">
        All tiers include the same features because{' '}
        <span className="font-semibold text-slate-400">
          feedtack is 100% open source
        </span>
        . The tiers exist purely for{' '}
        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text font-semibold text-transparent">
          vibes
        </span>
        .
      </p>

      {/* "Built with Tailwind CSS" badge — the punchline */}
      <div className="tw-float inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-3 py-1.5 text-[10px] font-medium tracking-wide text-sky-400/80 shadow-lg shadow-sky-500/5 backdrop-blur-sm transition-all duration-300 hover:border-sky-400/40 hover:bg-sky-500/10 hover:text-sky-300 sm:gap-2.5 sm:px-4 sm:py-2 sm:text-xs">
        <svg
          className="h-3 w-3 sm:h-4 sm:w-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
        </svg>
        <span>Built with Tailwind CSS</span>
        <span className="hidden text-sky-500/40 sm:inline">|</span>
        <span className="hidden text-sky-400/50 sm:inline">
          47 utility classes per div
        </span>
      </div>
    </footer>
  )
}
