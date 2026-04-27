import s from './carson.module.css'

export function CarsonColophon() {
  return (
    <footer className={s.colophon}>
      <p className={s.colophonText} aria-hidden="true">
        Don&apos;t confuse legibility with communication
      </p>
      <p className={s.colophonSub}>— David Carson, probably about this page</p>
    </footer>
  )
}
