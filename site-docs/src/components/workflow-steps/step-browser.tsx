import { BrowserFrame } from './browser-frame'
import { BottomContentLines } from './browser-icons'

/** Step 1 — Mock browser window with content blocks */
export function StepBrowser() {
  return (
    <g className="wfa-browser">
      <BrowserFrame />
      {/* Bottom lines (unique to browse step) */}
      <g transform="translate(40, 20)">
        <BottomContentLines />
      </g>
    </g>
  )
}
