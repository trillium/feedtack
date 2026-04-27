import { BrowserFrame } from './browser-frame'
import { fd } from './constants'

/** Step 1 — Mock browser window with content blocks */
export function StepBrowser() {
  return (
    <g className="wfa-browser">
      <BrowserFrame />
      {/* Bottom lines (unique to browse step) */}
      <g transform="translate(40, 20)">
        <rect
          x="14"
          y="128"
          width="140"
          height="6"
          rx="2"
          style={fd.mutedFg}
          opacity="0.15"
        />
        <rect
          x="14"
          y="140"
          width="110"
          height="6"
          rx="2"
          style={fd.mutedFg}
          opacity="0.15"
        />
      </g>
    </g>
  )
}
