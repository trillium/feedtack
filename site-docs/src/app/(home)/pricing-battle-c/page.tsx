import { AsciiHeader } from '@/components/pricing-battle-c/ascii-header'
import { BootSequence } from '@/components/pricing-battle-c/boot-sequence'
import { TerminalTier } from '@/components/pricing-battle-c/terminal-tier'
import { TerminalWindow } from '@/components/pricing-battle-c/terminal-window'
import { TIERS } from '@/data/pricing-tiers'
import '@/components/pricing-battle-c/crt-effects.css'

export default function PricingBattleCPage() {
  return (
    <div className="crt-screen min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* ASCII Art Logo */}
        <div className="boot-line mb-6" style={{ animationDelay: '0ms' }}>
          <AsciiHeader />
        </div>

        {/* Tagline */}
        <p
          className="crt-text-dim boot-line mb-10 text-center text-xs tracking-[0.3em] uppercase"
          style={{ animationDelay: '100ms' }}
        >
          {'// open source feedback widget -- all tiers $0 forever'}
        </p>

        {/* Main Terminal */}
        <TerminalWindow title="feedtack@pricing:~ $ feedtack pricing --list">
          {/* Boot sequence with typewriter */}
          <BootSequence />

          {/* Separator */}
          <div className="crt-text-dim my-6 overflow-hidden text-xs">
            {'─'.repeat(72)}
          </div>

          {/* Tiers as CLI output */}
          <div className="tier-grid">
            {TIERS.map((tier, i) => (
              <TerminalTier key={tier.name} tier={tier} index={i} />
            ))}
          </div>

          {/* Footer */}
          <div className="crt-text-dim mt-8 space-y-1 text-xs">
            <div>{'─'.repeat(72)}</div>
            <div>
              {'Total charges: '}
              <span className="crt-text-bright">$0.00</span>
              {'  |  Status: '}
              <span className="crt-text-bright">OPERATIONAL</span>
            </div>
            <div className="crt-text-dim">
              {
                'Run `npm install feedtack` to get started. No credit card. No trials. No gotchas.'
              }
            </div>
            <div className="mt-4">
              <span className="crt-text-amber">{'>'}</span>
              <span className="crt-text ml-1">{'_'}</span>
              <span className="blink-cursor" />
            </div>
          </div>
        </TerminalWindow>

        {/* System info footer */}
        <div
          className="boot-line mt-8 text-center text-[10px]"
          style={{ animationDelay: '2000ms' }}
        >
          <span className="crt-text-dim">
            {'FEEDTACK PRICING TERMINAL // MIT LICENSE // '}
            <a
              href="https://github.com/trillium/feedtack"
              className="crt-text underline transition-all hover:text-[#66ff66]"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/trillium/feedtack
            </a>
          </span>
        </div>
      </div>
    </div>
  )
}
