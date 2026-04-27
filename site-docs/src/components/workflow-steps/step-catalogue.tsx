import { ShimmerBar } from './browser-icons'
import { fd, PIN_PATH, WFA_COLORS } from './constants'

/** Step 5 — Feedback catalogue showing stored items */
export function StepCatalogue() {
  return (
    <g className="wfa-catalogue">
      {/* Center a 200x160 catalogue card */}
      <g transform="translate(50, 15)">
        <rect
          width="200"
          height="170"
          rx="8"
          style={fd.cardBorder}
          strokeWidth="1.5"
          filter="url(#wfaShadow)"
        />
        <text x="20" y="24" fontSize="10" fontWeight="700" style={fd.fg}>
          Feedback Catalogue
        </text>
        <line
          x1="10"
          y1="32"
          x2="190"
          y2="32"
          style={{ stroke: 'var(--color-fd-border, #e5e7eb)' }}
          strokeWidth="1"
        />
        <CatalogueRow
          cls="wfa-cat-row-1"
          ty={40}
          color={WFA_COLORS.red}
          titleW={80}
          descW={110}
          tag="bug"
        />
        <CatalogueRow
          cls="wfa-cat-row-2"
          ty={76}
          color={WFA_COLORS.blue}
          titleW={90}
          descW={100}
          tag="idea"
          divider={70}
        />
        <CatalogueRow
          cls="wfa-cat-row-3"
          ty={112}
          color={WFA_COLORS.amber}
          titleW={70}
          descW={95}
          tag="note"
          divider={106}
        />
      </g>
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
          x1="10"
          y1={divider}
          x2="190"
          y2={divider}
          style={borderStyle}
          strokeWidth="0.5"
          opacity="0.6"
        />
      )}
      <g transform={`translate(15, ${ty})`}>
        <path d={PIN_PATH} fill={color} transform="scale(0.4)" />
      </g>
      <ShimmerBar
        x={30}
        y={ty + 2}
        width={titleW}
        height={5}
        rx={1.5}
        style={{ fill: 'var(--color-fd-muted-foreground, #9ca3af)' }}
        opacity={0.4}
      />
      <ShimmerBar
        x={30}
        y={ty + 11}
        width={descW}
        height={4}
        rx={1.5}
        style={{ fill: 'var(--color-fd-muted-foreground, #9ca3af)' }}
        opacity={0.25}
      />
      <rect
        x="148"
        y={ty + 1}
        width="36"
        height="12"
        rx="3"
        fill={color}
        opacity="0.15"
      />
      <text
        x="166"
        y={ty + 10}
        fontSize="7"
        fill={color}
        textAnchor="middle"
        fontWeight="600"
      >
        {tag}
      </text>
    </g>
  )
}
