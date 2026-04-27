/** Parametric flowing background — organic blobs + wave divider */
export function HadidBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="hadid-blob hadid-blob--1" />
      <div className="hadid-blob hadid-blob--2" />
      <div className="hadid-blob hadid-blob--3" />
    </div>
  )
}

export function HadidWaveDivider() {
  return (
    <div className="hadid-wave" aria-hidden="true">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0,60 C240,20 480,100 720,50 C960,0 1200,80 1440,40 L1440,120 L0,120 Z"
          fill="var(--color-fd-background)"
          opacity="0.5"
        />
        <path
          d="M0,80 C320,40 640,110 960,60 C1120,35 1280,70 1440,55 L1440,120 L0,120 Z"
          fill="var(--color-fd-background)"
          opacity="0.8"
        />
      </svg>
    </div>
  )
}
