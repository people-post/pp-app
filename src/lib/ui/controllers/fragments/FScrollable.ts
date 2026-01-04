import { Fragment } from './Fragment.js';

export class FScrollable extends Fragment {
  onScrollFinished(): void {}

  isReloadable(): boolean { return false; }
  hasBufferOnTop(): boolean { return false; }

  scrollToTop(): void {}
  reload(): void {}
}

