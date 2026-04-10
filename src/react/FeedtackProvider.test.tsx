import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { FeedtackAdapter } from '../types/adapter.js'
import { FeedtackProvider } from './FeedtackProvider.js'

const mockAdapter: FeedtackAdapter = {
  submit: vi.fn().mockResolvedValue(undefined),
  reply: vi.fn().mockResolvedValue(undefined),
  resolve: vi.fn().mockResolvedValue(undefined),
  archive: vi.fn().mockResolvedValue(undefined),
  loadFeedback: vi.fn().mockResolvedValue([]),
}

const mockUser = { id: 'u1', name: 'Test User', role: 'admin' }

beforeEach(() => {
  vi.clearAllMocks()
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

describe('FeedtackProvider', () => {
  it('renders children', async () => {
    await act(async () => {
      render(
        <FeedtackProvider adapter={mockAdapter} currentUser={mockUser}>
          <div data-testid="child">hello</div>
        </FeedtackProvider>,
      )
    })
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('renders the activation button with hotkey label', async () => {
    await act(async () => {
      render(
        <FeedtackProvider adapter={mockAdapter} currentUser={mockUser}>
          <div />
        </FeedtackProvider>,
      )
    })
    expect(screen.getByText(/Drop Pin \[Shift\+P\]/i)).toBeInTheDocument()
  })

  it('activates pin mode on button click', async () => {
    await act(async () => {
      render(
        <FeedtackProvider adapter={mockAdapter} currentUser={mockUser}>
          <div />
        </FeedtackProvider>,
      )
    })
    const btn = screen.getByText(/Drop Pin/i)
    await act(async () => {
      fireEvent.click(btn)
    })
    expect(btn.className).toContain('active')
  })

  it('hides button when adminOnly and user role is not admin', async () => {
    await act(async () => {
      render(
        <FeedtackProvider
          adapter={mockAdapter}
          currentUser={{ ...mockUser, role: 'viewer' }}
          adminOnly
        >
          <div />
        </FeedtackProvider>,
      )
    })
    expect(screen.queryByText(/Drop Pin/i)).not.toBeInTheDocument()
  })

  it('renders only children when disabled', async () => {
    await act(async () => {
      render(
        <FeedtackProvider adapter={mockAdapter} currentUser={mockUser} disabled>
          <div data-testid="child">hello</div>
        </FeedtackProvider>,
      )
    })
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.queryByText(/Drop Pin/i)).not.toBeInTheDocument()
    expect(document.getElementById('feedtack-root')).not.toBeInTheDocument()
  })

  it('useFeedtack does not throw when disabled', async () => {
    const { useFeedtack } = await import('./useFeedtack.js')
    function Consumer() {
      const ctx = useFeedtack()
      return <div data-testid="active">{String(ctx.isPinModeActive)}</div>
    }
    await act(async () => {
      render(
        <FeedtackProvider adapter={mockAdapter} currentUser={mockUser} disabled>
          <Consumer />
        </FeedtackProvider>,
      )
    })
    expect(screen.getByTestId('active')).toHaveTextContent('false')
  })

  it('loads feedback on mount', async () => {
    await act(async () => {
      render(
        <FeedtackProvider adapter={mockAdapter} currentUser={mockUser}>
          <div />
        </FeedtackProvider>,
      )
    })
    expect(mockAdapter.loadFeedback).toHaveBeenCalled()
  })
})
