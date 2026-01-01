import { FViewContentBase } from './FViewContentBase.js';

export class FScrollViewContent extends FViewContentBase {
  onScrollFinished() {}

  isReloadable() { return false; }
  hasHiddenTopBuffer() { return false; }

  scrollToTop() {}
  reload() {}

  _renderOnRender(render) { this._renderContentOnRender(render); }
  _renderContentOnRender(render) {}
};
