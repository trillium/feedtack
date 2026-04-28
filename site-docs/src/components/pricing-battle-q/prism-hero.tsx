/**
 * Dark Side of the Moon-inspired prism with rainbow dispersion.
 * Pure SVG — no images.
 */
export function PrismHero() {
  return (
    <div className="thorgerson-prism" aria-hidden="true">
      <svg
        className="prism-svg"
        width="280"
        height="240"
        viewBox="0 0 280 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Prism dispersing light into a rainbow"
      >
        <title>Prism with rainbow dispersion</title>
        <defs>
          {/* Prism fill gradient */}
          <linearGradient id="prism-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(20,20,35,0.95)" />
            <stop offset="100%" stopColor="rgba(10,10,20,0.98)" />
          </linearGradient>

          {/* Prism edge glow */}
          <linearGradient id="prism-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
          </linearGradient>

          {/* Incoming white beam */}
          <linearGradient id="beam-in" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.9)" />
          </linearGradient>

          {/* Rainbow output beams */}
          <linearGradient id="beam-red" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff0000" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam-orange" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff8800" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ff8800" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam-yellow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffdd00" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffdd00" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam-green" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00cc44" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00cc44" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam-blue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0077ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0077ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam-violet" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8800ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8800ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Incoming white beam */}
        <line
          x1="0"
          y1="120"
          x2="95"
          y2="120"
          stroke="url(#beam-in)"
          strokeWidth="2.5"
        />

        {/* The prism triangle */}
        <polygon
          points="140,30 220,200 60,200"
          fill="url(#prism-fill)"
          stroke="url(#prism-edge)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Internal refraction hint */}
        <line
          x1="98"
          y1="120"
          x2="188"
          y2="108"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />

        {/* Dispersed rainbow beams exiting right face */}
        <line
          x1="188"
          y1="102"
          x2="280"
          y2="68"
          stroke="url(#beam-red)"
          strokeWidth="2"
        />
        <line
          x1="188"
          y1="106"
          x2="280"
          y2="82"
          stroke="url(#beam-orange)"
          strokeWidth="2"
        />
        <line
          x1="188"
          y1="110"
          x2="280"
          y2="96"
          stroke="url(#beam-yellow)"
          strokeWidth="2"
        />
        <line
          x1="188"
          y1="114"
          x2="280"
          y2="110"
          stroke="url(#beam-green)"
          strokeWidth="2"
        />
        <line
          x1="188"
          y1="118"
          x2="280"
          y2="124"
          stroke="url(#beam-blue)"
          strokeWidth="2"
        />
        <line
          x1="188"
          y1="122"
          x2="280"
          y2="138"
          stroke="url(#beam-violet)"
          strokeWidth="2"
        />

        {/* Subtle glow at refraction point */}
        <circle cx="188" cy="112" r="6" fill="rgba(255,255,255,0.04)" />
      </svg>
    </div>
  )
}
