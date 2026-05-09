/**
 * Capture re-exports for injectable snippet.
 * Uses target-shim (no React fiber) instead of the main target module.
 */
export {
  getDeviceMeta,
  getPageMeta,
  getPinCoords,
  getViewportMeta,
} from '../capture/meta.js'

export { getTargetMeta } from './target-shim.js'
