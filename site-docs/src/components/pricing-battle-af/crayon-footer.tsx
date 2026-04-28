import { CrayonStar, SquigglyLine, StickFigure } from './decorations'

export function CrayonFooter() {
  return (
    <footer className="crayon-footer" style={{ position: 'relative' }}>
      {/* Squiggly top border */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <SquigglyLine width={300} color="#16a34a" />
      </div>

      {/* Stick figure drawing at bottom */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          alignItems: 'end',
          marginBottom: '0.5rem',
        }}
      >
        <CrayonStar color="#fbbf24" size={20} />
        <StickFigure size={35} />
        <CrayonStar color="#e8262a" size={18} />
        <StickFigure size={30} />
        <CrayonStar color="#9333ea" size={22} />
      </div>

      <p style={{ fontSize: '0.9rem', color: '#92400e', fontWeight: 700 }}>
        made with crayons by a very smart 5 year old
      </p>
      <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.25rem' }}>
        feedtack is open sorse and FREE forever and ever and ever
      </p>
      <p
        style={{
          fontSize: '1.5rem',
          marginTop: '0.5rem',
          letterSpacing: '0.3rem',
          userSelect: 'none',
        }}
      >
        ⭐🖍️🌈✨🖍️⭐
      </p>
    </footer>
  )
}
