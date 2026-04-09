import { createContext, useContext } from 'react'

export interface FeedtackContextValue {
  activatePinMode: () => void
  deactivatePinMode: () => void
  isPinModeActive: boolean
}

export const FeedtackContext = createContext<FeedtackContextValue | null>(null)

export function useFeedtackContext(): FeedtackContextValue {
  const ctx = useContext(FeedtackContext)
  if (!ctx) throw new Error('useFeedtack must be used inside <FeedtackProvider>')
  return ctx
}
