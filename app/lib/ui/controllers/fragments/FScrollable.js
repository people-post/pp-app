import { Fragment } from './Fragment.js';

export class FScrollable extends Fragment {
  onScrollFinished() {}

  isReloadable() { return false; }
  hasBufferOnTop() { return false; }

  scrollToTop() {}
  reload() {}
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.FScrollable = FScrollable;
}
