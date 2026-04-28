export function GhibliHeader() {
  return (
    <header className="relative px-6 pb-2 pt-16 text-center sm:px-12 sm:pt-20">
      {/* Tiny floating leaf decoration */}
      <div
        className="ghibli-float pointer-events-none absolute left-[15%] top-8 select-none text-2xl opacity-40 sm:left-[20%]"
        aria-hidden="true"
      >
        🍃
      </div>
      <div
        className="ghibli-float pointer-events-none absolute right-[12%] top-12 select-none text-lg opacity-30"
        aria-hidden="true"
        style={{ animationDelay: '-2s' }}
      >
        🍃
      </div>

      {/* Title */}
      <div className="watercolor-wash relative inline-block">
        <h1
          style={{
            fontFamily: "'Georgia', 'Palatino', 'Times New Roman', serif",
            fontSize: 'clamp(2.2rem, 7vw, 4.5rem)',
            fontWeight: 400,
            color: '#4a3f2f',
            letterSpacing: '0.02em',
            lineHeight: 1.1,
          }}
        >
          Choose Your Path
        </h1>
      </div>

      {/* Subtitle — wistful, Ghibli-esque */}
      <p
        style={{
          fontFamily: "'Georgia', 'Palatino', serif",
          fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
          color: '#8b7750',
          maxWidth: '38ch',
          margin: '1rem auto 0',
          lineHeight: 1.6,
        }}
      >
        Every journey begins the same way.
        <br />
        <span style={{ opacity: 0.6, fontStyle: 'italic' }}>
          All paths cost nothing. The wind decides the rest.
        </span>
      </p>

      {/* Decorative divider — like a hand-drawn line */}
      <div
        className="mx-auto mt-8"
        style={{
          width: '60px',
          height: '2px',
          background:
            'linear-gradient(90deg, transparent, #c4a86c, transparent)',
          borderRadius: '1px',
        }}
      />
    </header>
  )
}
