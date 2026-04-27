import { fd, WFA_COLORS } from './constants'

/** Step 3 — Mini feedback form appears */
export function StepForm() {
  return (
    <g className="wfa-form" style={{ transformOrigin: '150px 110px' }}>
      {/* Center a 140x100 form card in the viewport */}
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
        {/* Typing lines — four rows appearing sequentially */}
        <rect
          className="wfa-typing-1"
          x="16"
          y="35"
          width="72"
          height="3"
          rx="1.5"
          fill={WFA_COLORS.blue}
          opacity="0.45"
        />
        <rect
          className="wfa-typing-2"
          x="16"
          y="41"
          width="68"
          height="3"
          rx="1.5"
          fill={WFA_COLORS.blue}
          opacity="0.45"
        />
        <rect
          className="wfa-typing-3"
          x="16"
          y="47"
          width="58"
          height="3"
          rx="1.5"
          fill={WFA_COLORS.blue}
          opacity="0.45"
        />
        <rect
          className="wfa-typing-4"
          x="16"
          y="53"
          width="40"
          height="3"
          rx="1.5"
          fill={WFA_COLORS.blue}
          opacity="0.45"
        />
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
