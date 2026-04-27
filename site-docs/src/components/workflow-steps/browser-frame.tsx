import {
  AddressBar,
  BrowserChrome,
  ContentLines,
  HighlightedElement,
  TrafficLights,
} from './browser-icons'
import { fd } from './constants'

/** Shared browser chrome SVG group used by Step 1 (Browse) and Step 2 (Click) */
export function BrowserFrame() {
  return (
    <g transform="translate(40, 20)">
      <rect
        width="220"
        height="160"
        rx="8"
        style={fd.cardBorder}
        strokeWidth="1.5"
      />
      <BrowserChrome />
      <TrafficLights />
      <AddressBar />
      <ContentLines />
      <HighlightedElement />
    </g>
  )
}
