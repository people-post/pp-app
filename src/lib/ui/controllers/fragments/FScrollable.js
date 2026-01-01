import { Fragment } from './Fragment.js';

export class FScrollable extends Fragment {
  onScrollFinished() {}

  isReloadable() { return false; }
  hasBufferOnTop() { return false; }

  scrollToTop() {}
  reload() {}
};
