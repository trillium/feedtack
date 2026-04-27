'use client'

import type { ReactNode } from 'react'

interface TerminalWindowProps {
  title?: string
  children: ReactNode
}

export function TerminalWindow({
  title = 'feedtack@pricing:~',
  children,
}: TerminalWindowProps) {
  return (
    <div className="crt-barrel overflow-hidden border border-[#33ff33]/30">
      {/* Title bar */}
      <div
        className="flex items-center gap-2 border-b border-[#33ff33]/20 px-4 py-2"
        style={{ background: 'rgba(51,255,51,0.05)' }}
      >
        <span
          className="terminal-dot"
          style={{ background: '#ff5f57' }}
        />
        <span
          className="terminal-dot"
          style={{ background: '#febc2e' }}
        />
        <span
          className="terminal-dot"
          style={{ background: '#28c840' }}
        />
        <span className="crt-text-dim ml-3 text-xs tracking-wider">
          {title}
        </span>
      </div>
      {/* Terminal body */}
      <div className="p-6 md:p-8">{children}</div>
    </div>
  )
}
