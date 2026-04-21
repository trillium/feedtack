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

  it('renders the Feedback button', async () => {
    await act(async () => {
      render(
        <FeedtackProvider adapter={mockAdapter} currentUser={mockUser}>
          <div />
        </FeedtackProvider>,
      )
    })
    expect(screen.getByText('Feedback')).toBeInTheDocument()
  })

  it('opens modal on button click', async () => {
    await act(async () => {
      render(
        <FeedtackProvider adapter={mockAdapter} currentUser={mockUser}>
          <div />
        </FeedtackProvider>,
      )
    })
    const btn = screen.getByText('Feedback')
    await act(async () => {
      fireEvent.click(btn)
    })
    expect(btn.className).toContain('active')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('modal has Site and Page tabs', async () => {
    await act(async () => {
      render(
        <FeedtackProvider adapter={mockAdapter} currentUser={mockUser}>
          <div />
        </FeedtackProvider>,
      )
    })
    await act(async () => {
      fireEvent.click(screen.getByText('Feedback'))
    })
    expect(screen.getByText('Site')).toBeInTheDocument()
    expect(screen.getByText('Page')).toBeInTheDocument()
  })

  it('modal has Place a pin button that activates pin mode', async () => {
    await act(async () => {
      render(
        <FeedtackProvider adapter={mockAdapter} currentUser={mockUser}>
          <div />
        </FeedtackProvider>,
      )
    })
    await act(async () => {
      fireEvent.click(screen.getByText('Feedback'))
    })
    await act(async () => {
      fireEvent.click(screen.getByText('Place a pin'))
    })
    // Modal should close, crosshair should be active
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(
      document.documentElement.classList.contains('feedtack-crosshair'),
    ).toBe(true)
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
    expect(screen.queryByText('Feedback')).not.toBeInTheDocument()
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
    expect(screen.queryByText('Feedback')).not.toBeInTheDocument()
    expect(document.getElementById('feedtack-root')).not.toBeInTheDocument()
  })

  it('useFeedtack exposes modal controls', async () => {
    const { useFeedtack } = await import('./useFeedtack.js')
    function Consumer() {
      const ctx = useFeedtack()
      return (
        <div>
          <div data-testid="active">{String(ctx.isPinModeActive)}</div>
          <div data-testid="modal">{String(ctx.isModalOpen)}</div>
          <button type="button" data-testid="open" onClick={ctx.openModal}>
            open
          </button>
        </div>
      )
    }
    await act(async () => {
      render(
        <FeedtackProvider adapter={mockAdapter} currentUser={mockUser}>
          <Consumer />
        </FeedtackProvider>,
      )
    })
    expect(screen.getByTestId('active')).toHaveTextContent('false')
    expect(screen.getByTestId('modal')).toHaveTextContent('false')
    await act(async () => {
      fireEvent.click(screen.getByTestId('open'))
    })
    expect(screen.getByTestId('modal')).toHaveTextContent('true')
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

  it('does not crash when feedback items have empty pins', async () => {
    const adapterWithBadItems: FeedtackAdapter = {
      ...mockAdapter,
      loadFeedback: vi.fn().mockResolvedValue([
        {
          payload: {
            id: 'ft_bad',
            schemaVersion: '2.0.0',
            scope: 'page',
            timestamp: '2026-04-14T00:00:00.000Z',
            submittedBy: mockUser,
            comment: 'missing pins',
            sentiment: null,
            pins: [],
            page: { url: 'http://localhost/', pathname: '/', title: '' },
            viewport: {
              width: 1280,
              height: 800,
              scrollX: 0,
              scrollY: 0,
              devicePixelRatio: 1,
            },
            device: {
              userAgent: 'test',
              platform: 'test',
              touchEnabled: false,
            },
          },
          replies: [],
          resolutions: [],
          archives: [],
        },
      ]),
    }
    await act(async () => {
      render(
        <FeedtackProvider adapter={adapterWithBadItems} currentUser={mockUser}>
          <div data-testid="child">hello</div>
        </FeedtackProvider>,
      )
    })
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
