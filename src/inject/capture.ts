/**
 * Capture re-exports for injectable snippet.
 * Imports target module without fiber walker — no React dependency.
 */
export {
  getDeviceMeta,
  getPageMeta,
  getPinCoords,
  getViewportMeta,
} from '../capture/meta.js'

export { getTargetMeta } from '../capture/target.js'
