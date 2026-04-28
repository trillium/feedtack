export function GhibliFooter() {
  return (
    <footer className="relative z-10 px-6 pb-16 pt-12 text-center">
      {/* Hand-drawn style divider */}
      <div
        className="mx-auto mb-6"
        style={{
          width: '40px',
          height: '2px',
          background:
            'linear-gradient(90deg, transparent, #c4a86c, transparent)',
          borderRadius: '1px',
        }}
      />

      <p
        style={{
          fontFamily: "'Georgia', 'Palatino', serif",
          fontSize: '0.85rem',
          color: '#8b7750',
          lineHeight: 1.7,
          maxWidth: '44ch',
          margin: '0 auto',
        }}
      >
        Open source. MIT licensed. Free forever.
        <br />
        <span style={{ fontStyle: 'italic', opacity: 0.6 }}>
          Some things in this world are still free, like the wind.
        </span>
      </p>

      <p
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: '0.7rem',
          color: '#8b7750',
          opacity: 0.35,
          marginTop: '1.5rem',
          letterSpacing: '0.1em',
        }}
      >
        — drawn with care, somewhere between deadlines —
      </p>
    </footer>
  )
}
