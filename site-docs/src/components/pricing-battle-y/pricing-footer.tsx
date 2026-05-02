import s from './savanna.module.css'

export function PricingFooter() {
  return (
    <>
      <footer className={s.footer}>
        <p>
          All plans are free, open-source, and standing tall at{' '}
          <a
            href="https://github.com/trillium/feedtack"
            className={s.footerLink}
          >
            github.com/trillium/feedtack
          </a>
          .
        </p>
        <p>
          No hidden fees. No long-necked commitments. Just{' '}
          <code>npm&nbsp;install</code> and graze — er, go.
        </p>
      </footer>
      <div className={s.groundCover} aria-hidden="true" />
    </>
  )
}
