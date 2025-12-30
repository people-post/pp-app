import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { C } from '../../lib/framework/Constants.js';

export class FvcCounterMain extends FScrollViewContent {
  constructor() {
    super();
    this._fQueue = new shop.FWalkinQueue();
    this._fQueue.setDelegate(this);
    this.setChild("queue", this._fQueue);
  }

  initFromUrl(urlParam) {
    super.initFromUrl(urlParam);
    this.#setBranchId(urlParam.get(C.URL_PARAM.BRANCH));
    dba.Counter.setRegisterId(urlParam.get(C.URL_PARAM.REGISTER));
    this.render();
  }

  getUrlParamString() {
    let ss = [];
    let branchId = this._fQueue.getBranchId();
    if (branchId) {
      ss.push(C.URL_PARAM.BRANCH + "=" + branchId);
      let registerId = dba.Counter.getRegisterId();
      if (registerId) {
        ss.push(C.URL_PARAM.REGISTER + "=" + registerId);
      }
    }
    return ss.join("&");
  }

  onBranchSelectedInBranchSelectionContentFragment(fvcBranchSelection,
                                                   branchId) {
    this.#setBranchId(branchId);
    fwk.Events.triggerTopAction(fwk.T_ACTION.CLOSE_DIALOG, this);
    fwk.Events.triggerTopAction(fwk.T_ACTION.REPLACE_STATE, {}, "Counter");
    this.render();
  }

  onRegisterSelectedInRegisterSelectionContentFragment(fvcRegisterSelection,
                                                       registerId) {
    dba.Counter.setRegisterId(registerId);
    fwk.Events.triggerTopAction(fwk.T_ACTION.CLOSE_DIALOG, this);
    fwk.Events.triggerTopAction(fwk.T_ACTION.REPLACE_STATE, {}, "Counter");
    this.render();
  }

  _renderContentOnRender(render) {
    if (!dba.Account.isAuthenticated()) {
      // TODO: Only allow users with permission to login
      return;
    }
    if (!this._fQueue.getBranchId()) {
      return;
    }

    this._fQueue.attachRender(render);
    this._fQueue.render();
  }

  _onContentDidAppear() {
    super._onContentDidAppear();
    if (!dba.Account.isAuthenticated()) {
      this.#showLoginView();
      return;
    }
    if (!this._fQueue.getBranchId()) {
      let v = new View();
      let f = new shop.FvcBranchSelection();
      f.setDelegate(this);
      v.setContentFragment(f);
      fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v,
                                  "Branch selection", false);
      return;
    }
    if (!dba.Counter.getRegisterId()) {
      let v = new View();
      let f = new shop.FvcRegisterSelection();
      f.setDelegate(this);
      f.setBranchId(this._fQueue.getBranchId());
      v.setContentFragment(f);
      fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v,
                                  "Register selection", false);
      return;
    }
  }

  #setBranchId(id) { this._fQueue.setBranchId(id); }

  #showLoginView() {
    // This is hack to avoid dialog pop two times, needs debug
    fwk.Events.triggerTopAction(fwk.T_ACTION.CLOSE_DIALOG, this);
    // TODO: Only allow users with permission to login
    let gw = new auth.Gateway();
    let v = gw.createLoginView();
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Login",
                                false);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcCounterMain = FvcCounterMain;
}
