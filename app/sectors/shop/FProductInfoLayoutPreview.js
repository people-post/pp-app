(function(shop) {
class FProductInfoLayoutPreview extends ui.Fragment {
  constructor() {
    super();
    this._desciption = "";
    this._fInfo = null;

    this._fApply = new ui.Button();
    this._fApply.setLayoutType(ui.Button.LAYOUT_TYPE.SMALL);
    this._fApply.setDelegate(this);
    this.setChild("btn", this._fApply);
  }

  isProductSelectedInProductInfoFragment(fProductInfo, productId) {
    return false;
  }
  onClickInProductInfoFragment(fProductInfo, productId) {}
  onSimpleButtonClicked(fButton) {
    this._delegate.onProductInfoPreviewFragmentRequestApplySize(
        this, this._fInfo.getSizeType());
  }

  setDescription(text) { this._desciption = text; }
  setInfoFragment(f) {
    f.setDataSource(this);
    f.setDelegate(this);
    // Hack
    f.setProductId("630c0f81939ca171b6a702df");
    this._fInfo = f;
    this.setChild("info", f);
  }

  _renderOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);
    let pp = new ui.Panel();
    pp.setClassName("small-info-text");
    p.pushPanel(pp);
    pp.replaceContent(this._desciption);
    if (!this._fInfo) {
      return;
    }

    if (this._fInfo.getSizeType() == dba.Shop.getItemLayoutType()) {
      this._fApply.setName("Applied");
      this._fApply.disable();
    } else {
      this._fApply.setName("Apply");
      this._fApply.enable();
    }
    pp = new ui.Panel();
    p.pushPanel(pp);
    this._fApply.attachRender(pp);
    this._fApply.render();

    pp = new ui.SectionPanel("Exmaple layout");
    p.pushPanel(pp);
    pp = pp.getContentPanel();
    pp.setClassName("quote-element");
    this._fInfo.attachRender(pp);
    this._fInfo.render();
  }
};

shop.FProductInfoLayoutPreview = FProductInfoLayoutPreview;
}(window.shop = window.shop || {}));
