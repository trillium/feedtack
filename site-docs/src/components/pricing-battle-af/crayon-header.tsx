import {
  CrayonFeedtackLogo,
  CrayonStar,
  CrayonSun,
  StickFigure,
} from './decorations'

export function CrayonHeader() {
  return (
    <header
      style={{
        textAlign: 'center',
        padding: '3rem 1rem 1rem',
        position: 'relative',
      }}
    >
      {/* Sun in corner */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '20px',
          transform: 'rotate(12deg)',
        }}
      >
        <CrayonSun size={70} />
      </div>

      {/* Stick figure waving */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '30px',
          transform: 'rotate(-8deg)',
        }}
      >
        <StickFigure size={50} />
      </div>

      {/* Stars scattered */}
      <div style={{ position: 'absolute', top: '60px', left: '140px' }}>
        <CrayonStar color="#9333ea" size={24} />
      </div>
      <div style={{ position: 'absolute', top: '15px', left: '50%' }}>
        <CrayonStar color="#16a34a" size={20} />
      </div>

      {/* Kid's drawing of the Feedtack logo */}
      <div style={{ display: 'inline-block', transform: 'rotate(-4deg)' }}>
        <CrayonFeedtackLogo size={80} />
      </div>

      {/* Title */}
      <h1 className="crayon-title" style={{ marginTop: '0.5rem' }}>
        <span className="crayon-title-word-1">fEeDtAcK</span>{' '}
        <span className="crayon-title-word-2">pRiCiNg!!!</span>
      </h1>

      <p
        style={{
          fontSize: '1.2rem',
          color: '#1d4ed8',
          fontWeight: 700,
          marginTop: '0.5rem',
          transform: 'rotate(1deg)',
        }}
      >
        evrything is FREE becuz i said so 😊
      </p>

      <p
        style={{
          fontSize: '0.75rem',
          color: '#92400e',
          marginTop: '0.25rem',
          fontStyle: 'italic',
        }}
      >
        (i made this website all by myself!!)
      </p>
    </header>
  )
}
