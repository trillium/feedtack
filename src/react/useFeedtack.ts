import { useFeedtackContext } from './context.js'

/** Hook for host app to programmatically control feedtack */
export function useFeedtack() {
  return useFeedtackContext()
}
