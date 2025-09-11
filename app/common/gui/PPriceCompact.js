(function(gui) {
/*
 * +-------------+
 * |   SYMBOL    |
 * +-------------+
 * | LIST_PRICE  |
 * +-------------+
 * | SALES_PRICE |
 * +-------------+
 */

const _CPT_COMPACT_PRICE = {
  MAIN : `<div id="__ID_UNIT__"></div>
    <div id="__ID_LIST_PRICE__" class="list-price center-align"></div>
    <div id="__ID_SALES_PRICE__" class="sales-price center-align"></div>`,
}

class PPriceCompact extends gui.PPriceBase {
  _renderFramework() {
    let s = _CPT_COMPACT_PRICE.MAIN;
    s = s.replace("__ID_UNIT__", this._getSubElementId("U"));
    s = s.replace("__ID_LIST_PRICE__", this._getSubElementId("LP"));
    s = s.replace("__ID_SALES_PRICE__", this._getSubElementId("SP"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pUnit.attach(this._getSubElementId("U"));
    this._pListPrice.attach(this._getSubElementId("LP"));
    this._pSalesPrice.attach(this._getSubElementId("SP"));
  }
};

gui.PPriceCompact = PPriceCompact;
}(window.gui = window.gui || {}));