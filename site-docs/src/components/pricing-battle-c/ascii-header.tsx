export function AsciiHeader() {
  const art = `
  ███████╗███████╗███████╗██████╗ ████████╗ █████╗  ██████╗██╗  ██╗
  ██╔════╝██╔════╝██╔════╝██╔══██╗╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
  █████╗  █████╗  █████╗  ██║  ██║   ██║   ███████║██║     █████╔╝
  ██╔══╝  ██╔══╝  ██╔══╝  ██║  ██║   ██║   ██╔══██║██║     ██╔═██╗
  ██║     ███████╗███████╗██████╔╝   ██║   ██║  ██║╚██████╗██║  ██╗
  ╚═╝     ╚══════╝╚══════╝╚═════╝    ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`

  return (
    <pre
      className="crt-text-bright glow-pulse overflow-x-auto text-center leading-tight"
      style={{ fontSize: 'clamp(4px, 1.2vw, 10px)' }}
      aria-label="FEEDTACK"
    >
      {art}
    </pre>
  )
}
