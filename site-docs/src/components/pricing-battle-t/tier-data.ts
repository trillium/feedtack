export interface TierT {
  name: string
  price: string
  subtitle: string
  features: string[]
  cta: string
  ctaHref?: string
  featured?: boolean
  locked?: boolean
  icon: 'party' | 'rocket' | 'crown'
  levelLabel: string
}

export const TIERS: TierT[] = [
  {
    name: 'Free',
    price: '$0',
    subtitle: 'Forever. Seriously.',
    icon: 'party',
    levelLabel: 'LEVEL 1',
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
    icon: 'rocket',
    levelLabel: 'LEVEL 2',
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
    icon: 'crown',
    levelLabel: 'BOSS LEVEL',
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
