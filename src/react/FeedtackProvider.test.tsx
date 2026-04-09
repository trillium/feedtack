import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { FeedtackProvider } from './FeedtackProvider.js'
import type { FeedtackAdapter } from '../types/adapter.js'

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
        </FeedtackProvider>
      )
    })
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('renders the activation button with hotkey label', async () => {
    await act(async () => {
      render(
        <FeedtackProvider adapter={mockAdapter} currentUser={mockUser}>
          <div />
        </FeedtackProvider>
      )
    })
    expect(screen.getByText(/Drop Pin \[Shift\+P\]/i)).toBeInTheDocument()
  })

  it('activates pin mode on button click', async () => {
    await act(async () => {
      render(
        <FeedtackProvider adapter={mockAdapter} currentUser={mockUser}>
          <div />
        </FeedtackProvider>
      )
    })
    const btn = screen.getByText(/Drop Pin/i)
    await act(async () => { fireEvent.click(btn) })
    expect(btn.className).toContain('active')
  })

  it('hides button when adminOnly and user role is not admin', async () => {
    await act(async () => {
      render(
        <FeedtackProvider adapter={mockAdapter} currentUser={{ ...mockUser, role: 'viewer' }} adminOnly>
          <div />
        </FeedtackProvider>
      )
    })
    expect(screen.queryByText(/Drop Pin/i)).not.toBeInTheDocument()
  })

  it('loads feedback on mount', async () => {
    await act(async () => {
      render(
        <FeedtackProvider adapter={mockAdapter} currentUser={mockUser}>
          <div />
        </FeedtackProvider>
      )
    })
    expect(mockAdapter.loadFeedback).toHaveBeenCalled()
  })
})
