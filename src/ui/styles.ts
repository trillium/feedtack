/** CSS custom property defaults — overridden by the theme prop */
export const FEEDTACK_DEFAULT_TOKENS = `
  #feedtack-root {
    --ft-primary: #2563eb;
    --ft-primary-hover: #1d4ed8;
    --ft-bg: #ffffff;
    --ft-surface: #f9fafb;
    --ft-text: #111827;
    --ft-text-muted: #6b7280;
    --ft-border: #e5e7eb;
    --ft-radius: 8px;
    --ft-error: #ef4444;
    --ft-badge: #f59e0b;
  }
`

/** Injected once into <head> — all styles scoped to .feedtack-* using CSS tokens */
export const FEEDTACK_STYLES = `
  #feedtack-root * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.5;
  }

  .feedtack-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483640;
    background: var(--ft-text);
    color: var(--ft-bg);
    border: none;
    border-radius: var(--ft-radius);
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.15s;
  }

  .feedtack-btn:hover {
    opacity: 0.85;
  }

  .feedtack-btn.active {
    background: var(--ft-primary);
  }

  .feedtack-crosshair * {
    cursor: crosshair !important;
  }

  .feedtack-pin-marker {
    position: absolute;
    z-index: 2147483641;
    width: 24px;
    height: 24px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg) translate(-50%, -50%);
    border: 2px solid rgba(255,255,255,0.8);
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    cursor: pointer;
    pointer-events: all;
  }

  .feedtack-pin-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 10px;
    height: 10px;
    background: var(--ft-badge);
    border-radius: 50%;
    border: 1.5px solid var(--ft-bg);
  }

  .feedtack-color-picker {
    display: flex;
    gap: 6px;
    padding: 8px;
    background: var(--ft-bg) !important;
    border-radius: var(--ft-radius);
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    position: fixed;
    bottom: 72px;
    right: 24px;
    z-index: 2147483641;
  }

  .feedtack-color-swatch {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: transform 0.1s;
  }

  .feedtack-color-swatch.selected {
    border-color: var(--ft-text);
    transform: scale(1.15);
  }

  .feedtack-form {
    position: absolute;
    z-index: 2147483642;
    background: var(--ft-bg) !important;
    border-radius: calc(var(--ft-radius) + 2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.18);
    padding: 16px;
    width: 280px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .feedtack-form textarea {
    width: 100%;
    border: 1.5px solid var(--ft-border);
    border-radius: var(--ft-radius);
    padding: 8px;
    font-size: 13px;
    resize: vertical;
    min-height: 80px;
    outline: none;
    background: var(--ft-surface);
    color: var(--ft-text);
  }

  .feedtack-form textarea:focus {
    border-color: var(--ft-primary);
  }

  .feedtack-form textarea.error {
    border-color: var(--ft-error);
  }

  .feedtack-error-msg {
    font-size: 12px;
    color: var(--ft-error);
  }

  .feedtack-sentiment {
    display: flex;
    gap: 8px;
  }

  .feedtack-sentiment button {
    flex: 1;
    padding: 6px 10px;
    border: 1.5px solid var(--ft-border);
    border-radius: var(--ft-radius);
    background: var(--ft-bg);
    color: var(--ft-text);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.1s;
  }

  .feedtack-sentiment button.selected {
    border-color: var(--ft-primary);
    background: var(--ft-surface);
    color: var(--ft-primary);
  }

  .feedtack-form-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  .feedtack-btn-cancel {
    padding: 6px 12px;
    border: 1.5px solid var(--ft-border);
    border-radius: var(--ft-radius);
    background: var(--ft-bg);
    color: var(--ft-text);
    font-size: 13px;
    cursor: pointer;
  }

  .feedtack-btn-submit {
    padding: 6px 12px;
    border: none;
    border-radius: var(--ft-radius);
    background: var(--ft-primary);
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
  }

  .feedtack-btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .feedtack-thread {
    position: absolute;
    z-index: 2147483642;
    background: var(--ft-bg) !important;
    border-radius: calc(var(--ft-radius) + 2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.18);
    padding: 16px;
    width: 300px;
    max-height: 400px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .feedtack-loading {
    position: fixed;
    bottom: 70px;
    right: 24px;
    font-size: 12px;
    color: var(--ft-text-muted);
    z-index: 2147483640;
  }
`
