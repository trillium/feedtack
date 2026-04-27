'use client'

import type { FeedbackItem } from 'feedtack'
import { WebhookAdapter } from 'feedtack'
import { FeedtackProvider as Provider } from 'feedtack/react'
import { useEffect, useState } from 'react'

function getVisitorId(): string {
  const key = 'feedtack_visitor_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = `visitor_${crypto.randomUUID()}`
    localStorage.setItem(key, id)
  }
  return id
}

const adapter = new WebhookAdapter({
  submitUrl: '/api/feedtack',
  async loadFeedback(filter) {
    const params = new URLSearchParams()
    if (filter?.pathname) params.set('pathname', filter.pathname)
    const res = await fetch(`/api/feedtack?${params.toString()}`)
    if (!res.ok) return []
    return (await res.json()) as FeedbackItem[]
  },
})

export function DocsFeedtackProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [visitorId, setVisitorId] = useState<string | null>(null)

  useEffect(() => {
    setVisitorId(getVisitorId())
  }, [])

  if (!visitorId) return <>{children}</>

  return (
    <Provider
      adapter={adapter}
      currentUser={{ id: visitorId, name: 'Visitor', role: 'visitor' }}
      onError={console.error}
    >
      {children}
    </Provider>
  )
}
