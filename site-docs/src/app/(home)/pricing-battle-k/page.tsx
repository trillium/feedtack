import '@/components/pricing-battle-k/anderson-styles.css'
import { FooterK } from '@/components/pricing-battle-k/footer-k'
import { HeaderK } from '@/components/pricing-battle-k/header-k'
import { type TierK, TierCardK } from '@/components/pricing-battle-k/tier-card-k'

/* ── Tier Data ────────────────────────────────────── */
const TIERS: TierK[] = [
  {
    name: 'The Lobby',
    number: 1,
    price: '$0',
    subtitle: 'Forever. Seriously.',
    color: '#A8C8D8',
    features: [
      'All adapters (console, localStorage, Supabase, webhooks)',
      'Unlimited pins',
      'Rich DOM targeting',
      'Feedback scopes (element, page, site)',
      'Custom CSS theming',
      'Full TypeScript support',
      'Community GitHub Issues',
    ],
    cta: 'npm install feedtack',
  },
  {
    name: 'The Suite',
    number: 2,
    price: '$0',
    subtitle: 'Same price. More prestige.',
    color: '#D4A843',
    featured: true,
    features: [
      'Everything in The Lobby',
      'Priority GitHub Issues (you star the repo first)',
      'Custom adapter support (you write them)',
      'Advanced DOM targeting',
      'Unlimited unlimited pins',
      'A warm feeling inside',
    ],
    cta: 'npm install feedtack',
  },
  {
    name: 'The Penthouse',
    number: 3,
    price: '$0',
    subtitle: 'For teams who like saying "enterprise."',
    color: '#E8B4B8',
    locked: true,
    features: [
      'Everything in The Suite',
      'Unlimited Unlimited',
      '24/7 Self-Service Support (read the docs)',
      'White-glove npm install',
      'Dedicated Slack channel (make your own)',
      'SOC 2 Type II (you handle that)',
      'On-prem deployment (it\'s an npm package)',
    ],
    cta: 'Contribute to Unlock',
    ctaHref: 'https://github.com/trillium/feedtack',
  },
]

export default function PricingBattleKPage() {
  return (
    <div className="anderson-scene">
      <HeaderK />

      {/* Tier cards — perfectly symmetrical grid */}
      <section
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          gap: '1.5rem',
          flexWrap: 'wrap',
          maxWidth: '68rem',
          margin: '0 auto',
          padding: '2rem 1.5rem 3rem',
        }}
      >
        {TIERS.map((tier, i) => (
          <TierCardK key={tier.name} tier={tier} delay={i + 1} />
        ))}
      </section>

      <FooterK />
    </div>
  )
}
