import { CrayonCard } from '@/components/pricing-battle-af/crayon-card'
import { CrayonFooter } from '@/components/pricing-battle-af/crayon-footer'
import { CrayonHeader } from '@/components/pricing-battle-af/crayon-header'
import { Rainbow } from '@/components/pricing-battle-af/decorations'
import { TIERS } from '@/components/pricing-battle-af/tier-data'
import '@/components/pricing-battle-af/crayon.css'

export const metadata = {
  title: 'fEeDtAcK pRiCiNg!!! (i made this)',
  description:
    'evrything is FREE becuz i said so. made with crayons by a very smart 5 year old.',
}

export default function PricingBattleAF() {
  const [free, pro, enterprise] = TIERS

  return (
    <div className="crayon-page">
      <CrayonHeader />

      {/* Rainbow because obviously */}
      <Rainbow />

      {/* Squiggly scribble divider text */}
      <div className="crayon-squiggle-divider">
        ~*~*~*~ pick a plan (theyre all free lol) ~*~*~*~
      </div>

      {/* Pricing cards */}
      <main className="crayon-grid" style={{ padding: '1rem 2rem 2rem' }}>
        <CrayonCard tier={free} />
        <CrayonCard tier={pro} />
        <CrayonCard tier={enterprise} />
      </main>

      {/* Second rainbow because one wasn't enough */}
      <Rainbow />

      {/* Bottom message */}
      <div
        style={{
          textAlign: 'center',
          padding: '1rem',
          fontFamily: "'Comic Sans MS', cursive",
        }}
      >
        <p
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: '#9333ea',
            transform: 'rotate(-1deg)',
          }}
        >
          wAiT tHeY'rE aLl FrEe?!?!
        </p>
        <p
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#e8262a',
            transform: 'rotate(1deg)',
            marginTop: '0.25rem',
          }}
        >
          aLwAyS hAvE bEeN 🔫
        </p>
      </div>

      <CrayonFooter />
    </div>
  )
}
