import { HiCheck, HiLockClosed, HiLockOpen } from 'react-icons/hi2'
import { LuCrown, LuPartyPopper, LuRocket } from 'react-icons/lu'
import type { TierT } from './tier-data'

const TIER_ICONS = {
  party: LuPartyPopper,
  rocket: LuRocket,
  crown: LuCrown,
} as const

function tierClass(name: string): string {
  if (name === 'Free') return 'tier-free'
  if (name === 'Pro') return 'tier-pro'
  return 'tier-enterprise'
}

function CodeSnippet({ tierName }: { tierName: string }) {
  if (tierName === 'Free') {
    return (
      <div className="tolinski-code-snippet">
        <span className="kw">import</span> {'{ '}
        <span className="fn">feedtack</span>
        {' }'} <span className="kw">from</span>{' '}
        <span className="str">&apos;feedtack&apos;</span>
        <br />
        <span className="cm">
          {"// FREE?! LET'S GO! "}
          <LuPartyPopper
            style={{
              display: 'inline',
              verticalAlign: 'middle',
              fontSize: '1em',
            }}
          />
        </span>
      </div>
    )
  }
  if (tierName === 'Pro') {
    return (
      <div className="tolinski-code-snippet">
        <span className="kw">const</span> <span className="fn">vibes</span> ={' '}
        <span className="str">&apos;immaculate&apos;</span>
        <br />
        <span className="cm">
          {'// you leveled up '}
          <LuRocket
            style={{
              display: 'inline',
              verticalAlign: 'middle',
              fontSize: '1em',
            }}
          />
        </span>
      </div>
    )
  }
  return (
    <div className="tolinski-code-snippet">
      <span className="kw">await</span> <span className="fn">enterprise</span>(
      <span className="str">&apos;deploy&apos;</span>)
      <br />
      <span className="cm">
        {"// it's just npm install "}
        <LuCrown
          style={{
            display: 'inline',
            verticalAlign: 'middle',
            fontSize: '1em',
          }}
        />
      </span>
    </div>
  )
}

export function PricingCard({ tier }: { tier: TierT }) {
  const cls = tierClass(tier.name)
  const isLocked = tier.locked === true
  const TierIcon = TIER_ICONS[tier.icon]

  return (
    <div
      className={`tolinski-card ${cls}${isLocked ? ' locked' : ''} tolinski-animate-in`}
    >
      {tier.featured && (
        <div className="tolinski-recommended">
          MOST POPULAR (THEY&apos;RE ALL THE SAME)
        </div>
      )}
      {isLocked && (
        <div className="tolinski-lock-overlay">
          <HiLockClosed style={{ fontSize: '1em' }} />
        </div>
      )}
      <div className="tolinski-card-inner">
        {/* Level badge */}
        <div className="tolinski-level">
          <span className="tolinski-level-dot" />
          {tier.levelLabel}
        </div>

        {/* Name + subtitle */}
        <h3 className="tolinski-card-name">
          <TierIcon
            style={{
              display: 'inline',
              verticalAlign: 'middle',
              fontSize: '1em',
            }}
          />{' '}
          {tier.name}
        </h3>
        <p className="tolinski-card-subtitle">{tier.subtitle}</p>

        {/* Price */}
        <div className="tolinski-price-row">
          <span className="tolinski-price">{tier.price}</span>
          <span className="tolinski-price-period">/forever</span>
        </div>
        <p className="tolinski-price-joke">
          {tier.name === 'Free' && 'Yes, actually free. No gotcha.'}
          {tier.name === 'Pro' && 'Still free. Just fancier vibes.'}
          {tier.name === 'Enterprise' && 'Free but you have to earn it.'}
        </p>

        {/* Features */}
        <ul className="tolinski-features">
          {tier.features.map((f) => (
            <li key={f} className="tolinski-feature">
              <span className="tolinski-check" aria-hidden="true">
                <HiCheck style={{ fontSize: '1em' }} />
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* Code decoration */}
        <CodeSnippet tierName={tier.name} />

        {/* CTA */}
        {tier.ctaHref ? (
          <a
            href={tier.ctaHref}
            className="tolinski-cta"
            style={{ marginTop: '1.25rem' }}
          >
            {isLocked ? (
              <>
                <HiLockOpen
                  style={{
                    display: 'inline',
                    verticalAlign: 'middle',
                    fontSize: '1em',
                  }}
                />{' '}
              </>
            ) : (
              ''
            )}
            {tier.cta}
          </a>
        ) : (
          <div className="tolinski-cta" style={{ marginTop: '1.25rem' }}>
            $ {tier.cta}
          </div>
        )}
      </div>
    </div>
  )
}
