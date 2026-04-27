import s from './editorial-features.module.css'

export function EditorialPullQuote() {
  return (
    <blockquote className={s.pullQuote}>
      &ldquo;The best feedback tool is the one your team{' '}
      <span className={s.pullQuoteAccent}>actually uses</span> &mdash; and price
      should never be the barrier.&rdquo;
    </blockquote>
  )
}
