import { fd, PIN_PATH, WFA_COLORS } from './constants'

/** Step 5 — Feedback catalogue showing stored items */
export function StepCatalogue() {
  const borderStyle = { stroke: 'var(--color-fd-border, #e5e7eb)' }
  return (
    <g className="wfa-catalogue">
      <rect
        x="330"
        y="50"
        width="160"
        height="170"
        rx="8"
        style={fd.cardBorder}
        strokeWidth="1.5"
        filter="url(#wfaShadow)"
      />
      <text x="350" y="73" fontSize="9" fontWeight="700" style={fd.fg}>
        Feedback Catalogue
      </text>
      <line
        x1="340"
        y1="80"
        x2="480"
        y2="80"
        style={borderStyle}
        strokeWidth="1"
      />
      <CatalogueRow
        cls="wfa-cat-row-1"
        ty={88}
        color={WFA_COLORS.red}
        titleW={80}
        descW={110}
        tag="bug"
      />
      <CatalogueRow
        cls="wfa-cat-row-2"
        ty={118}
        color={WFA_COLORS.blue}
        titleW={90}
        descW={100}
        tag="idea"
        divider={112}
      />
      <CatalogueRow
        cls="wfa-cat-row-3"
        ty={148}
        color={WFA_COLORS.amber}
        titleW={70}
        descW={95}
        tag="note"
        divider={142}
      />
    </g>
  )
}

function CatalogueRow({
  cls,
  ty,
  color,
  titleW,
  descW,
  tag,
  divider,
}: {
  cls: string
  ty: number
  color: string
  titleW: number
  descW: number
  tag: string
  divider?: number
}) {
  const borderStyle = { stroke: 'var(--color-fd-border, #e5e7eb)' }
  return (
    <g className={`wfa-cat-row ${cls}`}>
      {divider != null && (
        <line
          x1="340"
          y1={divider}
          x2="480"
          y2={divider}
          style={borderStyle}
          strokeWidth="0.5"
          opacity="0.6"
        />
      )}
      <g transform={`translate(345, ${ty})`}>
        <path d={PIN_PATH} fill={color} transform="scale(0.4)" />
      </g>
      <rect
        x="360"
        y={ty + 2}
        width={titleW}
        height="5"
        rx="1.5"
        style={{ fill: 'var(--color-fd-muted-foreground, #9ca3af)' }}
        opacity="0.4"
      />
      <rect
        x="360"
        y={ty + 11}
        width={descW}
        height="4"
        rx="1.5"
        style={{ fill: 'var(--color-fd-muted-foreground, #9ca3af)' }}
        opacity="0.25"
      />
      <rect
        x="448"
        y={ty + 1}
        width="30"
        height="10"
        rx="3"
        fill={color}
        opacity="0.15"
      />
      <text
        x="463"
        y={ty + 9}
        fontSize="6"
        fill={color}
        textAnchor="middle"
        fontWeight="600"
      >
        {tag}
      </text>
    </g>
  )
}
