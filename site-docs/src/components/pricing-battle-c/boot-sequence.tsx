'use client'

import { Typewriter } from './typewriter'

const BOOT_LINES = [
  { text: 'FEEDTACK PRICING SYSTEM v2.0.0', speed: 20, bright: true },
  { text: 'Copyright (c) 2026 Trillium Smith. MIT License.', speed: 15 },
  { text: '', speed: 0 },
  { text: 'Initializing pricing engine...', speed: 25 },
  { text: 'Loading adapters: console, localStorage, supabase, webhooks', speed: 20 },
  { text: 'All systems nominal. 0 charges detected.', speed: 25 },
  { text: '', speed: 0 },
  { text: '$ feedtack pricing --list --format=ascii', speed: 40, cmd: true },
]

export function BootSequence() {
  let cumulativeDelay = 200

  return (
    <div className="mb-8 space-y-1 text-xs">
      {BOOT_LINES.map((line) => {
        const delay = cumulativeDelay
        cumulativeDelay += line.text.length * (line.speed || 10) + 150

        if (line.text === '') {
          return <div key={delay} className="h-3" />
        }

        const cls = line.cmd
          ? 'crt-text-bright font-bold'
          : line.bright
            ? 'crt-text-bright'
            : 'crt-text-dim'

        return (
          <div key={delay}>
            {line.cmd && (
              <span className="crt-text-amber mr-1">{'>'}</span>
            )}
            <Typewriter
              text={line.text}
              delay={delay}
              charSpeed={line.speed}
              className={cls}
            />
          </div>
        )
      })}
    </div>
  )
}
