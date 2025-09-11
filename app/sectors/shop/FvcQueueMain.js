(function(shop) {
class FvcQueueMain extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fQueue = new shop.FWalkinQueue();
    this._fQueue.setReadOnly(true);
    this.setChild("queue", this._fQueue);
  }

  initFromUrl(urlParam) {
    super.initFromUrl(urlParam);
    let branchId = urlParam.get(C.URL_PARAM.BRANCH);
    this._fQueue.setBranchId(branchId);
    this.render();
  }

  getUrlParamString() {
    return C.URL_PARAM.BRANCH + "=" + this._fQueue.getBranchId();
  }

  onBranchSelectedInBranchSelectionContentFragment(fvcBranchSelection, branchId) {
    this._fQueue.setBranchId(branchId);
    fwk.Events.triggerTopAction(fwk.T_ACTION.CLOSE_DIALOG, this);
    fwk.Events.triggerTopAction(fwk.T_ACTION.REPLACE_STATE, {}, "Queue");
    this.render();
  }

  _renderContentOnRender(render) {
    if (!this._fQueue.getSupplierId()) {
      this._fQueue.setSupplierId(dba.WebConfig.getOwnerId());
    }

    if (!this._fQueue.getBranchId()) {
      return;
    }

    this._fQueue.attachRender(render);
    this._fQueue.render();
  }

  _onContentDidAppear() {
    super._onContentDidAppear();
    if (!this._fQueue.getBranchId()) {
      let v = new ui.View();
      let f = new shop.FvcBranchSelection();
      f.setDelegate(this);
      v.setContentFragment(f);
      fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v,
                                  "Branch selection", false);
      return;
    }
  }
};

shop.FvcQueueMain = FvcQueueMain;
}(window.shop = window.shop || {}));
