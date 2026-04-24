import type { Fragment } from './Fragment.js';

interface ScrollToTopCapable {
  scrollToTop(): void;
}

interface ScrollFinishedNotifiable {
  onScrollFinished(): void;
}

// Canonical name used by scroll hooks to decide if pull-to-refresh can engage.
// Returning true means there is still buffered content "above" the current top,
// so the hook should NOT engage pull-to-refresh yet.
interface HiddenTopBufferAware {
  hasHiddenTopBuffer(): boolean;
}

export type ScrollHookContent =
  Fragment &
  ScrollToTopCapable &
  ScrollFinishedNotifiable &
  HiddenTopBufferAware;

