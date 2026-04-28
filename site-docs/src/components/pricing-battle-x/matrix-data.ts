export interface MatrixRow {
  feature: string
  free: string | boolean
  pro: string | boolean
  enterprise: string | boolean
  note?: string
  isCategory?: boolean
}

export const MATRIX: MatrixRow[] = [
  {
    feature: 'Core Platform',
    free: true,
    pro: true,
    enterprise: true,
    isCategory: true,
  },
  {
    feature: 'All adapters (console, localStorage, Supabase, webhooks)',
    free: true,
    pro: true,
    enterprise: true,
  },
  {
    feature: 'Unlimited feedback pins',
    free: true,
    pro: true,
    enterprise: true,
  },
  { feature: 'Rich DOM targeting', free: true, pro: true, enterprise: true },
  {
    feature: 'Feedback scopes (element, page, site)',
    free: true,
    pro: true,
    enterprise: true,
  },
  { feature: 'Custom CSS theming', free: true, pro: true, enterprise: true },
  {
    feature: 'Full TypeScript support',
    free: true,
    pro: true,
    enterprise: true,
  },
  {
    feature: 'Support & SLA',
    free: true,
    pro: true,
    enterprise: true,
    isCategory: true,
  },
  {
    feature: 'Community GitHub Issues',
    free: true,
    pro: true,
    enterprise: true,
  },
  {
    feature: 'Priority GitHub Issues*',
    free: true,
    pro: true,
    enterprise: true,
    note: '*Star the repo first',
  },
  {
    feature: 'Dedicated Slack channel**',
    free: false,
    pro: false,
    enterprise: true,
    note: '**You create it yourself',
  },
  {
    feature: 'Response time SLA',
    free: 'Best-effort',
    pro: '24h',
    enterprise: '<1h',
  },
  {
    feature: 'Uptime guarantee',
    free: '99.9%',
    pro: '99.9%',
    enterprise: '99.99%',
  },
  {
    feature: 'Security & Compliance',
    free: true,
    pro: true,
    enterprise: true,
    isCategory: true,
  },
  {
    feature: 'SSO / SAML integration',
    free: true,
    pro: true,
    enterprise: true,
    note: 'N/A (npm package)',
  },
  {
    feature: 'SOC 2 Type II***',
    free: false,
    pro: false,
    enterprise: true,
    note: '***You handle that',
  },
  {
    feature: 'On-prem deployment',
    free: true,
    pro: true,
    enterprise: true,
    note: "It's an npm package",
  },
  {
    feature: 'Data residency controls',
    free: true,
    pro: true,
    enterprise: true,
    note: 'Your server, your data',
  },
  {
    feature: 'Scale & Administration',
    free: true,
    pro: true,
    enterprise: true,
    isCategory: true,
  },
  { feature: 'Seats included', free: '5', pro: '50', enterprise: 'Unlimited' },
  {
    feature: 'Custom adapter support',
    free: false,
    pro: true,
    enterprise: true,
    note: 'You write them',
  },
  {
    feature: 'White-glove onboarding',
    free: false,
    pro: false,
    enterprise: true,
    note: 'npm install feedtack',
  },
  { feature: 'Warm feeling inside', free: false, pro: true, enterprise: true },
]
