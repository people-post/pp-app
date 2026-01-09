import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { Shop } from '../../common/dba/Shop.js';
import { FProduct } from './FProduct.js';
import type Render from '../../lib/ui/renders/Render.js';

interface ProductInfoLayoutPreviewDelegate {
  onProductInfoPreviewFragmentRequestApplySize(f: FProductInfoLayoutPreview, sizeType: symbol): void;
}

export class FProductInfoLayoutPreview extends Fragment {
  protected _desciption: string = "";
  protected _fInfo: FProduct | null = null;
  protected _fApply: Button;
  protected _delegate!: ProductInfoLayoutPreviewDelegate;

  constructor() {
    super();
    this._fApply = new Button();
    this._fApply.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this._fApply.setDelegate(this);
    this.setChild("btn", this._fApply);
  }

  isProductSelectedInProductInfoFragment(_fProductInfo: FProduct, _productId: string): boolean {
    return false;
  }
  onClickInProductInfoFragment(_fProductInfo: FProduct, _productId: string): void {}
  onSimpleButtonClicked(_fButton: Button): void {
    if (this._fInfo) {
      this._delegate.onProductInfoPreviewFragmentRequestApplySize(
          this, this._fInfo.getSizeType()!);
    }
  }

  setDescription(text: string): void { this._desciption = text; }
  setInfoFragment(f: FProduct): void {
    f.setDataSource(this);
    f.setDelegate(this);
    // Hack
    f.setProductId("630c0f81939ca171b6a702df");
    this._fInfo = f;
    this.setChild("info", f);
  }

  _renderOnRender(render: Render): void {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new Panel();
    pp.setClassName("small-info-text");
    p.pushPanel(pp);
    pp.replaceContent(this._desciption);
    if (!this._fInfo) {
      return;
    }

    if (this._fInfo.getSizeType() == Shop.getItemLayoutType()) {
      this._fApply.setName("Applied");
      this._fApply.disable();
    } else {
      this._fApply.setName("Apply");
      this._fApply.enable();
    }
    pp = new Panel();
    p.pushPanel(pp);
    this._fApply.attachRender(pp);
    this._fApply.render();

    pp = new SectionPanel("Exmaple layout");
    p.pushPanel(pp);
    let contentPanel = pp.getContentPanel();
    if (contentPanel) {
      contentPanel.setClassName("quote-element");
      this._fInfo.attachRender(contentPanel);
      this._fInfo.render();
    }
  }
}
