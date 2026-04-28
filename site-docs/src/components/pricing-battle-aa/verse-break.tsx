interface VerseBreakProps {
  label: string
}

export function VerseBreak({ label }: VerseBreakProps) {
  return (
    <div className="verse-break">
      <span className="verse-label">{label}</span>
    </div>
  )
}
