/**
 * iframeResize — posts content height to Wix parent window so the iframe
 * can be automatically resized to avoid double scrollbars.
 *
 * Usage: call postHeightToParent() on every wizard step change and on resize.
 * The Wix Velo parent widget listens for { type: 'resize', height: number }.
 */

let resizeObserver: ResizeObserver | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function sendHeight(): void {
  const height = document.documentElement.scrollHeight;
  window.parent.postMessage({ type: 'resize', height }, '*');
}

function debouncedSend(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(sendHeight, 50);
}

/** Call once at app startup to auto-report height changes. */
export function initIframeResize(): void {
  if (window.self === window.top) return; // not embedded — no-op

  // Initial height
  sendHeight();

  // Observe body size changes (step transitions change content height)
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(debouncedSend);
    resizeObserver.observe(document.body);
  } else {
    window.addEventListener('resize', debouncedSend);
  }
}

/** Call explicitly after wizard step transitions for immediate update. */
export function postHeightToParent(): void {
  if (window.self === window.top) return;
  sendHeight();
}

/** Clean up observers (call on app unmount). */
export function destroyIframeResize(): void {
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (debounceTimer) clearTimeout(debounceTimer);
  window.removeEventListener('resize', debouncedSend);
}
