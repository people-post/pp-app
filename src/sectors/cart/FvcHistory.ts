import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FOrderList } from './FOrderList.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export class FvcHistory extends FScrollViewContent {
  protected _fList: FOrderList;

  constructor() {
    super();
    this._fList = new FOrderList();
    this._fList.setDelegate(this);
    this.setChild("list", this._fList);
  }

  scrollToTop(): void { this._fList.scrollToItemIndex(0); }
  onScrollFinished(): void { this._fList.onScrollFinished(); }

  _renderContentOnRender(render: Render): void {
    this._fList.attachRender(render);
    this._fList.render();
  }
};
