import s from './editorial-features.module.css'

export function EditorialColophon() {
  return (
    <footer className={s.colophon}>
      <p className={s.colophonText}>
        Open source &middot; MIT License &middot;{' '}
        <a
          href="https://github.com/trillium/feedtack"
          className={s.colophonLink}
        >
          View on GitHub
        </a>
      </p>
    </footer>
  )
}
