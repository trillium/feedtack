import { PIN_PALETTE } from '@/components/pin-svg'

export interface Tier {
  name: string
  price: string
  subtitle: string
  pinColor: string
  features: string[]
  cta: string
  ctaHref?: string
  featured?: boolean
  locked?: boolean
}

export type { Tier as PricingTier }
/** Aliases — some variants use alternate names */
export { TIERS as PRICING_TIERS }

export const TIERS: Tier[] = [
  {
    name: 'Free',
    price: '$0',
    subtitle: 'Forever. Seriously.',
    pinColor: PIN_PALETTE[1],
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
    name: 'Pro',
    price: '$0',
    subtitle: 'Same price. More prestige.',
    pinColor: PIN_PALETTE[2],
    featured: true,
    features: [
      'Everything in Free',
      'Priority GitHub Issues (you star the repo first)',
      'Custom adapter support (you write them)',
      'Advanced DOM targeting',
      'Unlimited unlimited pins',
      'A warm feeling inside',
    ],
    cta: 'npm install feedtack',
  },
  {
    name: 'Enterprise',
    price: '$0',
    subtitle: 'For teams who like saying "enterprise."',
    pinColor: PIN_PALETTE[3],
    locked: true,
    features: [
      'Everything in Pro',
      'Unlimited Unlimited',
      '24/7 Self-Service Support (read the docs)',
      'White-glove npm install',
      'Dedicated Slack channel (make your own)',
      'SOC 2 Type II (you handle that)',
      "On-prem deployment (it's an npm package)",
    ],
    cta: 'Contribute to Unlock',
    ctaHref: 'https://github.com/trillium/feedtack',
  },
]
