import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Shop } from '../../common/dba/Shop.js';
import { Users } from '../../common/dba/Users.js';

export class FBtnViewQueue extends Fragment {
  constructor() {
    super();
    this._fBtn = new Button();
    this._fBtn.setName("View queue&#x1f517;");
    this._fBtn.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this._fBtn.setDelegate(this);
    this.setChild("btn", this._fBtn);

    this._branchId = null;
  }

  onSimpleButtonClicked(fBtn) { this.#onViewQueue(); }

  setBranchId(id) { this._branchId = id; }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.SHOP_BRANCH:
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let u = this.#getSupplier();
    this._fBtn.setEnabled(!!u);
    this._fBtn.attachRender(render);
    this._fBtn.render();
  }

  #onViewQueue() {
    let u = this.#getSupplier();
    if (u) {
      let url;
      if (window.dba.Account.getId() == u.getId()) {
        url = u.getCounterUrl(this._branchId);
      } else {
        url = u.getQueueUrl(this._branchId);
      }
      window.open(url, '_blank').focus();
    }
  }

  #getSupplier() {
    let b = Shop.getBranch(this._branchId);
    if (b) {
      return Users.get(b.getOwnerId());
    }
    return null;
  }
};
