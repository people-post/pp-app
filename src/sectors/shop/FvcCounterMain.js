import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { URL_PARAM } from '../../common/constants/Constants.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FWalkinQueue } from './FWalkinQueue.js';
import { FvcBranchSelection } from './FvcBranchSelection.js';
import { FvcRegisterSelection } from './FvcRegisterSelection.js';
import { Counter } from '../../common/dba/Counter.js';
import { Gateway as AuthGateway } from '../../sectors/auth/Gateway.js';
export class FvcCounterMain extends FScrollViewContent {
  constructor() {
    super();
    this._fQueue = new FWalkinQueue();
    this._fQueue.setDelegate(this);
    this.setChild("queue", this._fQueue);
  }

  initFromUrl(urlParam) {
    super.initFromUrl(urlParam);
    this.#setBranchId(urlParam.get(URL_PARAM.BRANCH));
    Counter.setRegisterId(urlParam.get(URL_PARAM.REGISTER));
    this.render();
  }

  getUrlParamString() {
    let ss = [];
    let branchId = this._fQueue.getBranchId();
    if (branchId) {
      ss.push(URL_PARAM.BRANCH + "=" + branchId);
      let registerId = Counter.getRegisterId();
      if (registerId) {
        ss.push(URL_PARAM.REGISTER + "=" + registerId);
      }
    }
    return ss.join("&");
  }

  onBranchSelectedInBranchSelectionContentFragment(fvcBranchSelection,
                                                   branchId) {
    this.#setBranchId(branchId);
    Events.triggerTopAction(T_ACTION.CLOSE_DIALOG, this);
    Events.triggerTopAction(T_ACTION.REPLACE_STATE, {}, "Counter");
    this.render();
  }

  onRegisterSelectedInRegisterSelectionContentFragment(fvcRegisterSelection,
                                                       registerId) {
    Counter.setRegisterId(registerId);
    Events.triggerTopAction(T_ACTION.CLOSE_DIALOG, this);
    Events.triggerTopAction(T_ACTION.REPLACE_STATE, {}, "Counter");
    this.render();
  }

  _renderContentOnRender(render) {
    if (!window.dba.Account.isAuthenticated()) {
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
    if (!window.dba.Account.isAuthenticated()) {
      this.#showLoginView();
      return;
    }
    if (!this._fQueue.getBranchId()) {
      let v = new View();
      let f = new FvcBranchSelection();
      f.setDelegate(this);
      v.setContentFragment(f);
      Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                  "Branch selection", false);
      return;
    }
    if (!Counter.getRegisterId()) {
      let v = new View();
      let f = new FvcRegisterSelection();
      f.setDelegate(this);
      f.setBranchId(this._fQueue.getBranchId());
      v.setContentFragment(f);
      Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                  "Register selection", false);
      return;
    }
  }

  #setBranchId(id) { this._fQueue.setBranchId(id); }

  #showLoginView() {
    // This is hack to avoid dialog pop two times, needs debug
    Events.triggerTopAction(T_ACTION.CLOSE_DIALOG, this);
    // TODO: Only allow users with permission to login
    let gw = new AuthGateway();
    let v = gw.createLoginView();
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Login",
                                false);
  }
};
