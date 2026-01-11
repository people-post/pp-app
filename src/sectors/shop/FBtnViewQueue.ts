import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Shop } from '../../common/dba/Shop.js';
import { Users } from '../../common/dba/Users.js';
import { Account } from '../../common/dba/Account.js';

export class FBtnViewQueue extends Fragment {
  protected _fBtn: Button;
  protected _branchId: string | null = null;

  constructor() {
    super();
    this._fBtn = new Button();
    this._fBtn.setName("View queue&#x1f517;");
    this._fBtn.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this._fBtn.setDelegate(this);
    this.setChild("btn", this._fBtn);
  }

  onSimpleButtonClicked(_fBtn: Button): void { this.#onViewQueue(); }

  setBranchId(id: string | null): void { this._branchId = id; }

  handleSessionDataUpdate(dataType: symbol, _data: unknown): void {
    switch (dataType) {
    case T_DATA.SHOP_BRANCH:
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, _data);
  }

  _renderOnRender(render: any): void {
    let u = this.#getSupplier();
    this._fBtn.setEnabled(!!u);
    this._fBtn.attachRender(render);
    this._fBtn.render();
  }

  #onViewQueue(): void {
    let u = this.#getSupplier();
    if (u) {
      let url: string;
      if (Account.getId() == u.getId()) {
        url = u.getCounterUrl(this._branchId!);
      } else {
        url = u.getQueueUrl(this._branchId!);
      }
      window.open(url, '_blank')?.focus();
    }
  }

  #getSupplier(): any {
    if (!this._branchId) return null;
    let b = Shop.getBranch(this._branchId);
    if (b) {
      return Users.get(b.getOwnerId());
    }
    return null;
  }
}
