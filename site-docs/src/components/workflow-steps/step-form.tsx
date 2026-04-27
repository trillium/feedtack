import { fd, WFA_COLORS } from './constants'

/** Word-dash data: [x, y, width] for each "word" rectangle */
const WORDS: [number, number, number][] = [
  // Row 1 (y=35)
  [16, 35, 14],
  [33.5, 35, 10],
  [47, 35, 18],
  [68.5, 35, 12],
  [84, 35, 16],
  [103.5, 35, 10],
  // Row 2 (y=41)
  [16, 41, 16],
  [35.5, 41, 12],
  [51, 41, 10],
  [64.5, 41, 18],
  [86, 41, 14],
  // Row 3 (y=47)
  [16, 47, 10],
  [29.5, 47, 16],
  [49, 47, 12],
  [64.5, 47, 14],
  [82, 47, 18],
  // Row 4 (y=53)
  [16, 53, 18],
  [37.5, 53, 12],
  [53, 53, 8],
]

/** Step 3 — Mini feedback form appears */
export function StepForm() {
  return (
    <g className="wfa-form" style={{ transformOrigin: '150px 110px' }}>
      <g transform="translate(80, 60)">
        <rect
          width="140"
          height="100"
          rx="6"
          style={fd.cardBorder}
          strokeWidth="1.2"
          filter="url(#wfaShadow)"
        />
        <text x="16" y="22" fontSize="9" fontWeight="600" style={fd.fg}>
          Feedback
        </text>
        {/* Text input area */}
        <rect x="12" y="30" width="116" height="34" rx="3" style={fd.muted} />
        {/* Word dashes — appear sequentially to simulate typing */}
        {WORDS.map(([x, y, w], i) => (
          <rect
            key={`w${x}-${y}`}
            className={`wfa-word-${i + 1}`}
            x={x}
            y={y}
            width={w}
            height={3}
            rx={1.5}
            fill={WFA_COLORS.blue}
            opacity={0}
          />
        ))}
        {/* Submit button */}
        <rect
          x="80"
          y="72"
          width="48"
          height="18"
          rx="4"
          fill={WFA_COLORS.blue}
        />
        <text
          x="104"
          y="84"
          fontSize="8"
          fill="white"
          textAnchor="middle"
          fontWeight="600"
        >
          Submit
        </text>
      </g>
      {/* Step label */}
      <text className="wfa-label" x="150" y="210">
        3. Describe
      </text>
    </g>
  )
}
