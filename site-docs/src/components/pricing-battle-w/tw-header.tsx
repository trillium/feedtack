export function TwHeader() {
  return (
    <header className="relative flex flex-col items-center justify-center gap-4 overflow-hidden px-4 pb-8 pt-16 text-center sm:gap-6 sm:px-6 sm:pb-12 sm:pt-24 md:gap-8 md:px-8 md:pb-16 md:pt-32 lg:px-12 lg:pb-20 lg:pt-40">
      {/* Ambient gradient blobs */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl sm:-left-48 sm:-top-48 sm:h-96 sm:w-96 md:h-[32rem] md:w-[32rem]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-gradient-to-tl from-cyan-500/20 via-blue-500/20 to-indigo-500/20 blur-3xl sm:-bottom-48 sm:-right-48 sm:h-96 sm:w-96 md:h-[32rem] md:w-[32rem]"
        aria-hidden="true"
      />

      {/* Badge */}
      <div className="tw-badge-bounce relative z-10 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-wide text-indigo-300 backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-1.5 sm:text-sm">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400 sm:h-2 sm:w-2" />
        <span>Every tier is $0. That&apos;s the joke.</span>
      </div>

      {/* Heading with gradient text */}
      <h1 className="tw-gradient-shift relative z-10 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
        Pricing
      </h1>

      <p className="relative z-10 max-w-xs text-sm font-medium leading-relaxed text-slate-400 sm:max-w-sm sm:text-base md:max-w-lg md:text-lg lg:max-w-xl lg:text-xl">
        Three tiers. One price.{' '}
        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text font-semibold text-transparent">
          All free forever.
        </span>
      </p>
    </header>
  )
}
