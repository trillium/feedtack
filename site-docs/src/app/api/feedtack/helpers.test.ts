import { describe, expect, it } from 'vitest'
import { formatIssueBody, PayloadSchema } from './helpers.js'

function makeBasePayload(overrides?: Record<string, unknown>) {
  return PayloadSchema.parse({
    schemaVersion: '2.0.0',
    id: 'ft_test_001',
    timestamp: new Date().toISOString(),
    scope: 'element',
    submittedBy: { id: 'u1', name: 'Alice', username: 'alice', role: 'admin' },
    comment: 'Test comment',
    sentiment: null,
    pins: [],
    page: {
      url: 'https://example.com/docs',
      pathname: '/docs',
      title: 'Docs',
    },
    viewport: {
      width: 1440,
      height: 900,
      scrollX: 0,
      scrollY: 0,
      devicePixelRatio: 2,
      breakpoint: null,
      ...((overrides?.viewport as Record<string, unknown>) ?? {}),
    },
    device: {
      userAgent: 'Mozilla/5.0',
      platform: 'MacIntel',
      touchEnabled: false,
    },
    ...overrides,
  })
}

function makePinWithTarget(target: Record<string, unknown>) {
  return {
    index: 1,
    color: '#ff0000',
    x: 100,
    y: 200,
    xPct: 10,
    yPct: 20,
    target,
  }
}

describe('formatIssueBody — Element Context block', () => {
  it('renders classes, textContent, ariaLabel in Element Context block', () => {
    const payload = makeBasePayload({
      pins: [
        makePinWithTarget({
          tagName: 'BUTTON',
          selector: 'button',
          best_effort: false,
          dataTestId: null,
          elementPath: null,
          ancestors: [],
          boundingRect: { x: 0, y: 0, width: 100, height: 40 },
          classes: ['btn', 'active'],
          textContent: 'Submit',
          placeholder: null,
          ariaLabel: 'Submit feedback',
          role: null,
          type: null,
          name: null,
          dataFeedtackComponent: null,
          componentName: null,
        }),
      ],
    })
    const body = formatIssueBody(payload)
    expect(body).toContain('### Element Context')
    expect(body).toContain('**Classes:** btn active')
    expect(body).toContain('**Text:** "Submit"')
    expect(body).toContain('**ARIA:** Submit feedback')
  })

  it('omits null fields entirely — no "n/a" rendered', () => {
    const payload = makeBasePayload({
      pins: [
        makePinWithTarget({
          tagName: 'BUTTON',
          selector: 'button',
          best_effort: true,
          dataTestId: null,
          elementPath: null,
          ancestors: [],
          boundingRect: { x: 0, y: 0, width: 100, height: 40 },
          classes: [],
          textContent: null,
          placeholder: null,
          ariaLabel: null,
          role: null,
          type: null,
          name: null,
          dataFeedtackComponent: null,
          componentName: null,
        }),
      ],
    })
    const body = formatIssueBody(payload)
    expect(body).not.toContain('n/a')
    expect(body).not.toContain('**Text:**')
    expect(body).not.toContain('**Classes:**')
    expect(body).not.toContain('**ARIA:**')
  })

  it('renders input with placeholder and type, no text', () => {
    const payload = makeBasePayload({
      pins: [
        makePinWithTarget({
          tagName: 'INPUT',
          selector: 'input',
          best_effort: true,
          dataTestId: null,
          elementPath: null,
          ancestors: [],
          boundingRect: { x: 0, y: 0, width: 200, height: 36 },
          classes: [],
          textContent: null,
          placeholder: 'Search...',
          ariaLabel: null,
          role: null,
          type: 'search',
          name: null,
          dataFeedtackComponent: null,
          componentName: null,
        }),
      ],
    })
    const body = formatIssueBody(payload)
    expect(body).toContain('**Placeholder:** Search...')
    expect(body).toContain('**Type:** search')
    expect(body).not.toContain('**Text:**')
  })
})

describe('formatIssueBody — viewport line with breakpoint', () => {
  it('renders "1440x900 @ 2x DPR (xl)" when breakpoint is present', () => {
    const payload = makeBasePayload({
      viewport: {
        width: 1440,
        height: 900,
        scrollX: 0,
        scrollY: 0,
        devicePixelRatio: 2,
        breakpoint: 'xl',
      },
    })
    const body = formatIssueBody(payload)
    expect(body).toContain('1440x900 @ 2x DPR (xl)')
  })

  it('renders "1440x900 @ 2x DPR" with no suffix when breakpoint is null', () => {
    const payload = makeBasePayload({
      viewport: {
        width: 1440,
        height: 900,
        scrollX: 0,
        scrollY: 0,
        devicePixelRatio: 2,
        breakpoint: null,
      },
    })
    const body = formatIssueBody(payload)
    expect(body).toContain('1440x900 @ 2x DPR')
    expect(body).not.toMatch(/1440x900 @ 2x DPR \(/)
  })
})

describe('formatIssueBody — ancestor chain with classes and ariaLabel', () => {
  it('renders classes and ariaLabel for ancestor nodes', () => {
    const payload = makeBasePayload({
      pins: [
        makePinWithTarget({
          tagName: 'BUTTON',
          selector: 'button',
          best_effort: true,
          dataTestId: null,
          elementPath: null,
          boundingRect: { x: 0, y: 0, width: 100, height: 40 },
          classes: [],
          textContent: null,
          placeholder: null,
          ariaLabel: null,
          role: null,
          type: null,
          name: null,
          dataFeedtackComponent: null,
          componentName: null,
          ancestors: [
            {
              tag: 'nav',
              id: null,
              ariaLabel: 'Main navigation',
              role: null,
              type: null,
              name: null,
              title: null,
              alt: null,
              dataTestId: null,
              dataFeedtackComponent: null,
              nthChild: 1,
              nthOfType: 1,
              componentName: 'Sidebar',
              classes: ['nav', 'sidebar'],
              textContent: null,
              placeholder: null,
            },
          ],
        }),
      ],
    })
    const body = formatIssueBody(payload)
    expect(body).toContain('`nav (Sidebar)`')
    expect(body).toContain('Classes: nav sidebar')
    expect(body).toContain('ARIA: Main navigation')
  })
})
