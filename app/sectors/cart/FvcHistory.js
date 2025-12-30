import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FOrderList } from './FOrderList.js';

export class FvcHistory extends FScrollViewContent {
  constructor() {
    super();
    this._fList = new FOrderList();
    this._fList.setDelegate(this);
    this.setChild("list", this._fList);
  }

  scrollToTop() { this._fList.scrollToItemIndex(0); }
  onScrollFinished() { this._fList.onScrollFinished(); }

  _renderContentOnRender(render) {
    this._fList.attachRender(render);
    this._fList.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cart = window.cart || {};
  window.cart.FvcHistory = FvcHistory;
}
