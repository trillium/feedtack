import type { ReactNode } from 'react'

const AURORA_GRADIENTS = [
  'radial-gradient(ellipse 60% 50% at 30% 15%, #3b82f6 0%, transparent 70%)',
  'radial-gradient(ellipse 50% 40% at 70% 20%, #8b5cf6 0%, transparent 70%)',
  'radial-gradient(ellipse 40% 50% at 50% 55%, #06b6d4 0%, transparent 70%)',
  'radial-gradient(ellipse 30% 30% at 80% 45%, #f59e0b 0%, transparent 70%)',
].join(', ')

const NOISE_TEXTURE =
  "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjgiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbikiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')"

export function AuroraBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Aurora mesh gradient — spans full height of children */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ background: AURORA_GRADIENTS }}
        />
        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
          style={{ backgroundImage: NOISE_TEXTURE }}
        />
      </div>

      {/* Page content rendered above the gradient */}
      <div className="relative">{children}</div>
    </div>
  )
}
