import { Fragment } from './Fragment.js';

export class FScrollable extends Fragment {
  onScrollFinished(): void {}

  isReloadable(): boolean { return false; }
  hasBufferOnTop(): boolean { return false; }
  hasHiddenTopBuffer(): boolean { return this.hasBufferOnTop(); }

  scrollToTop(): void {}
  reload(): void {}
}

