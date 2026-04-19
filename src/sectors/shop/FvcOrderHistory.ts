import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSupplierOrderList } from './FSupplierOrderList.js';
import { URLSearchParams } from 'url';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FvcOrderHistory extends FScrollViewContent {
  private _fList: FSupplierOrderList;

  constructor() {
    super();
    this._fList = new FSupplierOrderList();
    this._fList.setDelegate(this);
    this.setChild("list", this._fList);
  }

  initFromUrl(urlParam: URLSearchParams): void {
    super.initFromUrl(urlParam);
    this._fList.initFromUrl(urlParam);
  }

  getUrlParamString(): string { return this._fList.getUrlParamString(); }

  scrollToTop(): void { this._fList.scrollToItemIndex(0); }
  onScrollFinished(): void { this._fList.onScrollFinished(); }

  _renderContentOnRender(render: PanelWrapper): void {
    this._fList.attachRender(render);
    this._fList.render();
  }
}

export default FvcOrderHistory;
