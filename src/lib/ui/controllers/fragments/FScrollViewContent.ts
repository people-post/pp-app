import { FViewContentBase } from './FViewContentBase.js';

export class FScrollViewContent extends FViewContentBase {
  onScrollFinished(): void {}

  isReloadable(): boolean { return false; }
  hasHiddenTopBuffer(): boolean { return false; }

  scrollToTop(): void {}
  reload(): void {}

  _renderOnRender(render: any): void { this._renderContentOnRender(render); }
  _renderContentOnRender(_render: any): void {}
}

