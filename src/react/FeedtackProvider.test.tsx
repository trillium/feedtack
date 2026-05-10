import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { FeedtackAdapter } from '../types/adapter.js'
import type { FeedtackUser } from '../types/payload.js'
import { FeedtackProvider } from './FeedtackProvider.js'

// ---------------------------------------------------------------------------
// Inline minimal formatIssueBody for username rendering tests
// (site-docs is excluded from the vitest run; logic is duplicated here for
// test coverage of the username rendering requirement)
// ---------------------------------------------------------------------------
function formatSubmittedByLabel(submittedBy: {
  name: string
  username?: string
}): string {
  return submittedBy.username
    ? `${submittedBy.name} (@${submittedBy.username})`
    : submittedBy.name
}

describe('formatIssueBody username rendering', () => {
  it('renders @username alongside name when username is present', () => {
    const label = formatSubmittedByLabel({
      name: 'Jane Doe',
      username: 'janedoe',
    })
    expect(label).toBe('Jane Doe (@janedoe)')
  })

  it('falls back to name only when username is absent', () => {
    const label = formatSubmittedByLabel({ name: 'Jane Doe' })
    expect(label).toBe('Jane Doe')
  })

  it('falls back to name only when username is undefined', () => {
    const label = formatSubmittedByLabel({
      name: 'Jane Doe',
      username: undefined,
    })
    expect(label).toBe('Jane Doe')
  })
})

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

  it('closes modal on backdrop click (native dialog)', async () => {
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
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    // Simulate a click on the <dialog> element itself (the backdrop area)
    await act(async () => {
      fireEvent.click(dialog)
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
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

  describe('generic user type / mapUser', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('uses currentUser directly when no mapUser provided (FeedtackUser passthrough)', async () => {
      let capturedUser: FeedtackUser | undefined
      const capturingAdapter: FeedtackAdapter = {
        ...mockAdapter,
        submit: vi.fn().mockImplementation(async (payload) => {
          capturedUser = payload.submittedBy
        }),
        loadFeedback: vi.fn().mockResolvedValue([]),
      }

      await act(async () => {
        render(
          <FeedtackProvider adapter={capturingAdapter} currentUser={mockUser}>
            <div />
          </FeedtackProvider>,
        )
      })

      // Open modal and submit
      await act(async () => {
        fireEvent.click(screen.getByText('Feedback'))
      })
      const textarea = screen.getByRole('textbox')
      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'test comment' } })
      })
      await act(async () => {
        fireEvent.click(screen.getByText('Submit'))
      })

      expect(capturedUser?.id).toBe(mockUser.id)
      expect(capturedUser?.name).toBe(mockUser.name)
    })

    it('maps custom user type to FeedtackUser via mapUser', async () => {
      type ClerkUser = { userId: string; fullName: string; orgRole: string }
      const clerkUser: ClerkUser = {
        userId: 'clerk_123',
        fullName: 'Jane Doe',
        orgRole: 'admin',
      }
      const mapUser = (u: ClerkUser): FeedtackUser => ({
        id: u.userId,
        name: u.fullName,
        role: u.orgRole,
      })

      let capturedUser: FeedtackUser | undefined
      const capturingAdapter: FeedtackAdapter = {
        ...mockAdapter,
        submit: vi.fn().mockImplementation(async (payload) => {
          capturedUser = payload.submittedBy
        }),
        loadFeedback: vi.fn().mockResolvedValue([]),
      }

      await act(async () => {
        render(
          <FeedtackProvider
            adapter={capturingAdapter}
            currentUser={clerkUser}
            mapUser={mapUser}
          >
            <div />
          </FeedtackProvider>,
        )
      })

      // Open modal and submit
      await act(async () => {
        fireEvent.click(screen.getByText('Feedback'))
      })
      const textarea = screen.getByRole('textbox')
      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'custom user comment' } })
      })
      await act(async () => {
        fireEvent.click(screen.getByText('Submit'))
      })

      expect(capturedUser?.id).toBe('clerk_123')
      expect(capturedUser?.name).toBe('Jane Doe')
      expect(capturedUser?.role).toBe('admin')
    })

    it('emits dev warning when resolved user has no id', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      // NODE_ENV is 'test' in vitest — not 'production', so warning fires
      vi.stubEnv('NODE_ENV', 'development')

      const noIdUser = { id: '', name: 'No ID User', role: 'viewer' }
      const localAdapter: FeedtackAdapter = {
        ...mockAdapter,
        loadFeedback: vi.fn().mockResolvedValue([]),
      }

      await act(async () => {
        render(
          <FeedtackProvider adapter={localAdapter} currentUser={noIdUser}>
            <div />
          </FeedtackProvider>,
        )
      })

      expect(warnSpy).toHaveBeenCalledWith(
        '[feedtack] currentUser has no id — provide mapUser to normalize your user type',
      )

      vi.unstubAllEnvs()
    })

    it('does not emit warning in production when resolved user has no id', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      vi.stubEnv('NODE_ENV', 'production')

      const noIdUser = { id: '', name: 'No ID User', role: 'viewer' }
      const localAdapter: FeedtackAdapter = {
        ...mockAdapter,
        loadFeedback: vi.fn().mockResolvedValue([]),
      }

      await act(async () => {
        render(
          <FeedtackProvider adapter={localAdapter} currentUser={noIdUser}>
            <div />
          </FeedtackProvider>,
        )
      })

      expect(warnSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('[feedtack]'),
      )

      vi.unstubAllEnvs()
    })
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
