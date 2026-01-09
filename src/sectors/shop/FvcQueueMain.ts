import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { URL_PARAM } from '../../common/constants/Constants.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FWalkinQueue } from './FWalkinQueue.js';
import { FvcBranchSelection } from './FvcBranchSelection.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import type { UrlParam } from '../../common/constants/Constants.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcQueueMain extends FScrollViewContent {
  protected _fQueue: FWalkinQueue;

  constructor() {
    super();
    this._fQueue = new FWalkinQueue();
    this._fQueue.setReadOnly(true);
    this.setChild("queue", this._fQueue);
  }

  initFromUrl(urlParam: UrlParam): void {
    super.initFromUrl(urlParam);
    let branchId = urlParam.get(URL_PARAM.BRANCH);
    this._fQueue.setBranchId(branchId);
    this.render();
  }

  getUrlParamString(): string {
    let branchId = this._fQueue.getBranchId();
    return URL_PARAM.BRANCH + "=" + (branchId || "");
  }

  onBranchSelectedInBranchSelectionContentFragment(_fvcBranchSelection: FvcBranchSelection, branchId: string): void {
    this._fQueue.setBranchId(branchId);
    Events.triggerTopAction(T_ACTION.CLOSE_DIALOG, this);
    Events.triggerTopAction(T_ACTION.REPLACE_STATE, {}, "Queue");
    this.render();
  }

  _renderContentOnRender(render: Render): void {
    if (!this._fQueue.getSupplierId()) {
      this._fQueue.setSupplierId(WebConfig.getOwnerId());
    }

    if (!this._fQueue.getBranchId()) {
      return;
    }

    this._fQueue.attachRender(render);
    this._fQueue.render();
  }

  _onContentDidAppear(): void {
    super._onContentDidAppear();
    if (!this._fQueue.getBranchId()) {
      let v = new View();
      let f = new FvcBranchSelection();
      f.setDelegate(this);
      v.setContentFragment(f);
      Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                  "Branch selection", false);
      return;
    }
  }
}
