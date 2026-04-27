/** Parametric flowing grid lines — Hadid structural aesthetic */
export function HadidGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ opacity: 0.04 }}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 800"
        fill="none"
        stroke="var(--color-fd-foreground)"
        strokeWidth="0.5"
      >
        {/* Horizontal flowing curves */}
        <path d="M0,100 C300,80 600,130 900,90 C1050,70 1150,110 1200,95" />
        <path d="M0,200 C200,220 500,170 800,210 C1000,240 1100,190 1200,200" />
        <path d="M0,300 C250,280 550,330 850,290 C1050,270 1150,310 1200,300" />
        <path d="M0,400 C300,420 600,370 900,410 C1050,430 1150,390 1200,405" />
        <path d="M0,500 C200,480 500,530 800,490 C1000,470 1100,510 1200,500" />
        <path d="M0,600 C250,620 550,570 850,610 C1050,630 1150,590 1200,600" />
        <path d="M0,700 C300,680 600,730 900,690 C1050,670 1150,710 1200,700" />
        {/* Vertical flowing curves */}
        <path d="M150,0 C140,200 170,400 145,600 C130,700 155,750 150,800" />
        <path d="M350,0 C360,200 330,400 355,600 C370,700 345,750 350,800" />
        <path d="M550,0 C540,200 570,400 545,600 C530,700 555,750 550,800" />
        <path d="M750,0 C760,200 730,400 755,600 C770,700 745,750 750,800" />
        <path d="M950,0 C940,200 970,400 945,600 C930,700 955,750 950,800" />
      </svg>
    </div>
  )
}
