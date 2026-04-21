/** Modal and auxiliary styles — appended to FEEDTACK_STYLES */
export const FEEDTACK_MODAL_STYLES = `
  .feedtack-loading {
    position: fixed;
    bottom: 70px;
    right: 24px;
    font-size: 12px;
    color: var(--ft-text-muted);
    z-index: 2147483640;
  }

  .feedtack-modal {
    position: fixed;
    bottom: 72px;
    right: 24px;
    width: 360px;
    max-height: 70vh;
    background: var(--ft-bg);
    border: 1px solid var(--ft-border);
    border-radius: calc(var(--ft-radius) + 4px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    z-index: 2147483643;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .feedtack-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 0;
  }

  .feedtack-modal-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--ft-text);
  }

  .feedtack-modal-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--ft-text-muted);
    line-height: 1;
    padding: 0 4px;
  }

  .feedtack-modal-tabs {
    display: flex;
    gap: 0;
    padding: 12px 16px 0;
    border-bottom: 1px solid var(--ft-border);
  }

  .feedtack-modal-tab {
    flex: 1;
    padding: 8px 12px;
    border: none;
    background: none;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    color: var(--ft-text-muted);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .feedtack-modal-tab.active {
    color: var(--ft-primary);
    border-bottom-color: var(--ft-primary);
  }

  .feedtack-tab-count {
    font-size: 11px;
    background: var(--ft-surface);
    color: var(--ft-text-muted);
    padding: 1px 6px;
    border-radius: 10px;
  }

  .feedtack-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .feedtack-modal-threads {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .feedtack-modal-thread-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-align: left;
    padding: 10px 12px;
    background: var(--ft-surface);
    border: 1px solid var(--ft-border);
    border-radius: var(--ft-radius);
    cursor: pointer;
  }

  .feedtack-modal-thread-item:hover {
    border-color: var(--ft-primary);
  }

  .feedtack-thread-author {
    font-size: 12px;
    font-weight: 600;
    color: var(--ft-text);
  }

  .feedtack-thread-comment {
    font-size: 13px;
    color: var(--ft-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .feedtack-thread-meta {
    font-size: 11px;
    color: var(--ft-text-muted);
  }

  .feedtack-modal-compose {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .feedtack-modal-textarea {
    width: 100%;
    border: 1.5px solid var(--ft-border);
    border-radius: var(--ft-radius);
    padding: 8px;
    font-size: 13px;
    resize: vertical;
    min-height: 72px;
    outline: none;
    background: var(--ft-surface);
    color: var(--ft-text);
  }

  .feedtack-modal-textarea:focus {
    border-color: var(--ft-primary);
  }

  .feedtack-modal-textarea.error {
    border-color: var(--ft-error);
  }

  .feedtack-modal-footer {
    padding: 10px 16px 14px;
    border-top: 1px solid var(--ft-border);
  }

  .feedtack-modal-pin-btn {
    width: 100%;
    padding: 8px 14px;
    border: 1.5px solid var(--ft-border);
    border-radius: var(--ft-radius);
    background: var(--ft-bg);
    color: var(--ft-text);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .feedtack-modal-pin-btn:hover {
    border-color: var(--ft-primary);
    color: var(--ft-primary);
  }

  .feedtack-modal-thread-view {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .feedtack-modal-back {
    background: none;
    border: none;
    font-size: 13px;
    color: var(--ft-primary);
    cursor: pointer;
    padding: 0;
    text-align: left;
  }

  .feedtack-modal-thread-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
  }

  .feedtack-modal-reply {
    border-top: 1px solid var(--ft-border);
    padding-top: 8px;
    font-size: 12px;
  }

  .feedtack-reply-author {
    font-weight: 600;
  }

  .feedtack-modal-actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  @media (max-width: 480px) {
    .feedtack-modal {
      right: 0;
      bottom: 64px;
      width: 100vw;
      max-height: 85vh;
      border-radius: var(--ft-radius) var(--ft-radius) 0 0;
      border-left: none;
      border-right: none;
      border-bottom: none;
    }
  }
`
