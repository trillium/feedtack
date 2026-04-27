/**
 * LightSlit — Ando's cross of light reduced to its essence.
 * A single thin horizontal line of warm amber light
 * cutting through the concrete void.
 */
export function LightSlit({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      {/* Wide glow behind the slit */}
      <div
        className="absolute left-0 right-0 h-12 -top-5 ando-slit"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(200,150,90,0.08), transparent)',
        }}
      />
      {/* The slit itself -- a fine incision of amber */}
      <div
        className="h-px w-full ando-slit"
        style={{
          background:
            'linear-gradient(to right, transparent 5%, rgba(200,150,90,0.6) 25%, rgba(200,150,90,1) 50%, rgba(200,150,90,0.6) 75%, transparent 95%)',
        }}
      />
    </div>
  )
}

/**
 * VerticalLightSlit — a narrow vertical beam.
 * Used as a tier separator, like light entering through
 * a gap between two concrete walls.
 */
export function VerticalLightSlit() {
  return (
    <div
      className="hidden lg:flex items-center justify-center self-stretch"
      aria-hidden="true"
    >
      <div className="relative h-full w-px">
        {/* Glow */}
        <div
          className="absolute inset-y-0 -left-4 -right-4"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(200,150,90,0.04), transparent)',
          }}
        />
        {/* The beam */}
        <div
          className="h-full w-px"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(200,150,90,0.3) 20%, rgba(200,150,90,0.5) 50%, rgba(200,150,90,0.3) 80%, transparent 100%)',
          }}
        />
      </div>
    </div>
  )
}
