import type { Metadata } from 'next'
import { LuRocket, LuSparkles } from 'react-icons/lu'
import { Confetti } from '@/components/pricing-battle-t/confetti'
import { TolinskiFooter } from '@/components/pricing-battle-t/footer'
import { TolinskiHeader } from '@/components/pricing-battle-t/header'
import { PricingCard } from '@/components/pricing-battle-t/pricing-card'
import { TIERS } from '@/components/pricing-battle-t/tier-data'
import '@/components/pricing-battle-t/tolinski.css'

export const metadata: Metadata = {
  title: 'Pricing – Feedtack',
  description:
    'Level up your feedback game. Every tier is free — because open source is awesome.',
}

export default function PricingPage() {
  const [free, pro, enterprise] = TIERS

  return (
    <div className="tolinski-page">
      <Confetti />

      {/* Decorative code background */}
      <div className="tolinski-code-bg left" aria-hidden="true">
        {`import { feedtack } from 'feedtack'\n\nconst pin = feedtack.pin({\n  target: '.hero',\n  scope: 'page',\n})\n\n// Ship it! `}
        <LuRocket
          style={{
            display: 'inline',
            verticalAlign: 'middle',
            fontSize: '1em',
          }}
        />
      </div>
      <div className="tolinski-code-bg right" aria-hidden="true">
        {`feedtack.init({\n  adapter: 'supabase',\n  theme: 'dark',\n})\n\n// Level complete `}
        <LuSparkles
          style={{
            display: 'inline',
            verticalAlign: 'middle',
            fontSize: '1em',
          }}
        />
      </div>

      <TolinskiHeader />

      <div className="tolinski-grid">
        <PricingCard tier={free} />
        <PricingCard tier={pro} />
        <PricingCard tier={enterprise} />
      </div>

      <TolinskiFooter />
    </div>
  )
}
