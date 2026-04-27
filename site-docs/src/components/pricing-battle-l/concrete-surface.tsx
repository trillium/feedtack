/**
 * ConcreteSurface -- the raw material.
 * Board-formed concrete: grain, formwork lines, muted warmth.
 */
export function ConcreteSurface() {
  return (
    <>
      {/* Warm ambient light — skylight wash */}
      <div
        className="pointer-events-none fixed inset-0 -z-20"
        aria-hidden="true"
        style={{
          background: [
            'radial-gradient(ellipse 100% 50% at 50% 0%, rgba(200,150,90,0.05) 0%, transparent 60%)',
            'radial-gradient(ellipse 60% 40% at 20% 70%, rgba(200,150,90,0.02) 0%, transparent 50%)',
            'radial-gradient(ellipse 60% 40% at 80% 60%, rgba(180,160,130,0.02) 0%, transparent 50%)',
          ].join(', '),
        }}
      />

      {/* Animated grain overlay */}
      <div
        className="ando-grain pointer-events-none fixed inset-[-50%] -z-10 h-[200%] w-[200%] opacity-[0.055]"
        aria-hidden="true"
      />

      {/* Horizontal formwork lines */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 90px)',
        }}
      />

      {/* Tie-hole pattern */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.02]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle 3px at center, currentColor 0%, transparent 100%)',
          backgroundSize: '180px 90px',
          backgroundPosition: '90px 45px',
        }}
      />
    </>
  )
}
