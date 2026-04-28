/** Top status bar with live indicator — Bloomberg terminal chrome */
export function StatusBar() {
  return (
    <div className="status-bar">
      <div className="status-bar-live">
        <span className="live-dot" />
        <span>Live — All Markets Open</span>
      </div>
      <span>Feedtack Terminal v1.0.0</span>
      <span>Session: Complimentary (Perpetual)</span>
    </div>
  )
}
