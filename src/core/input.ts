import { getComponentName } from '../capture/fiber.js'
import { getPinCoords } from '../capture/index.js'
import { getTargetMeta } from '../capture/target.js'
import type { FeedtackPin } from '../types/payload.js'
import { PIN_PALETTE } from '../ui/colors.js'
import { FEEDTACK_UI_SELECTOR } from './dom.js'
import type { FeedtackEngineState } from './types.js'

type SetState = (partial: Partial<FeedtackEngineState>) => void
type GetState = () => FeedtackEngineState

/** Build a keydown handler for hotkey, escape, and color cycling */
function createKeydownHandler(
  hotkey: string,
  getState: GetState,
  setState: SetState,
  onHotkey: () => void,
  deactivatePinMode: () => void,
): (e: KeyboardEvent) => void {
  const key = hotkey.toUpperCase()
  return (e: KeyboardEvent) => {
    if (e.key === key && e.shiftKey) {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      )
        return
      onHotkey()
    }
    if (e.key === 'Escape') deactivatePinMode()
    const s = getState()
    if (
      s.isPinModeActive &&
      !s.openThreadId &&
      !s.isModalOpen &&
      !s.showForm &&
      (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
    ) {
      e.preventDefault()
      const idx = PIN_PALETTE.indexOf(
        s.selectedColor as (typeof PIN_PALETTE)[number],
      )
      const dir = e.key === 'ArrowRight' ? 1 : -1
      setState({
        selectedColor:
          PIN_PALETTE[(idx + dir + PIN_PALETTE.length) % PIN_PALETTE.length],
      })
    }
  }
}

/** Place a pin from click/touch coordinates */
function placePin(
  coords: { clientX: number; clientY: number },
  target: Element,
  getState: GetState,
  setState: SetState,
): void {
  if (target.closest(FEEDTACK_UI_SELECTOR)) return
  const pin: Omit<FeedtackPin, 'index'> = {
    color: getState().selectedColor,
    ...getPinCoords(coords),
    target: getTargetMeta(target, getComponentName),
  }
  setState({ pendingPins: [...getState().pendingPins, pin], showForm: true })
}

export interface InputListenerHandles {
  detachKeyboard: () => void
  detachClick: () => void
}

/** Attach keyboard, click, and touch listeners for pin placement */
export function attachInputListeners(
  getState: GetState,
  setState: SetState,
  hotkey: string,
  onHotkey: () => void,
  deactivatePinMode: () => void,
): InputListenerHandles {
  const keydown = createKeydownHandler(
    hotkey,
    getState,
    setState,
    onHotkey,
    deactivatePinMode,
  )
  window.addEventListener('keydown', keydown)

  const click = (e: MouseEvent) => {
    if (!getState().isPinModeActive) return
    e.preventDefault()
    e.stopPropagation()
    placePin(e, e.target as Element, getState, setState)
  }
  const touchEnd = (e: TouchEvent) => {
    if (!getState().isPinModeActive) return
    const t = e.changedTouches[0]
    if (!t) return
    const el = document.elementFromPoint(t.clientX, t.clientY)
    if (!el) return
    e.preventDefault()
    placePin(t, el, getState, setState)
  }
  document.addEventListener('click', click, true)
  document.addEventListener('touchend', touchEnd, true)

  return {
    detachKeyboard() {
      window.removeEventListener('keydown', keydown)
    },
    detachClick() {
      document.removeEventListener('click', click, true)
      document.removeEventListener('touchend', touchEnd, true)
    },
  }
}
