/** Shadow DOM styles for the injectable snippet */
export const INJECT_STYLES = `
  :host {
    all: initial;
    direction: ltr;
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.5;
    color: #111827;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .ft-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483640;
    background: #111827;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.15s;
  }

  .ft-fab:hover { opacity: 0.85; }
  .ft-fab.active { background: #2563eb; }

  .ft-panel {
    position: fixed;
    bottom: 80px;
    right: 24px;
    z-index: 2147483641;
    width: 320px;
    max-height: 80vh;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    display: none;
    flex-direction: column;
    overflow: hidden;
  }

  .ft-panel.open { display: flex; }

  .ft-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid #e5e7eb;
  }

  .ft-panel-title {
    font-size: 15px;
    font-weight: 600;
  }

  .ft-panel-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #6b7280;
    padding: 0 4px;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ft-panel-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
  }

  .ft-textarea {
    width: 100%;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    padding: 8px;
    font-size: 13px;
    font-family: inherit;
    resize: vertical;
    min-height: 80px;
    outline: none;
    background: #f9fafb;
    color: #111827;
  }

  .ft-textarea:focus { border-color: #2563eb; }
  .ft-textarea.error { border-color: #ef4444; }

  .ft-sentiment {
    display: flex;
    gap: 8px;
  }

  .ft-sentiment button {
    flex: 1;
    padding: 6px 10px;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    background: #fff;
    color: #111827;
    font-size: 12px;
    cursor: pointer;
    min-height: 44px;
    transition: all 0.1s;
  }

  .ft-sentiment button.selected {
    border-color: #2563eb;
    background: #f9fafb;
    color: #2563eb;
  }

  .ft-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  .ft-btn-cancel {
    padding: 8px 14px;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    background: #fff;
    color: #111827;
    font-size: 13px;
    cursor: pointer;
    min-height: 44px;
  }

  .ft-btn-submit {
    padding: 8px 14px;
    border: none;
    border-radius: 8px;
    background: #2563eb;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    min-height: 44px;
  }

  .ft-btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ft-pin-count {
    font-size: 12px;
    color: #6b7280;
    padding: 4px 0;
  }

  .ft-status {
    font-size: 12px;
    color: #22c55e;
    padding: 4px 0;
    text-align: center;
  }

  .ft-error-msg {
    font-size: 12px;
    color: #ef4444;
  }

  @media (max-width: 480px) {
    .ft-panel {
      right: 0;
      bottom: 72px;
      width: 100vw;
      max-height: 80vh;
      border-radius: 12px 12px 0 0;
      border-left: none;
      border-right: none;
      border-bottom: none;
    }
  }
`
