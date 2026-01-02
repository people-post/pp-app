import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ShopRegister } from '../../common/datatypes/ShopRegister.js';

export class FRegisterList extends Fragment {
  constructor() {
    super();
    this._fItems = new FSimpleFragmentList();
    this.setChild("items", this._fItems);

    this._fBtnAdd = new Button();
    this._fBtnAdd.setName("+New register");
    this._fBtnAdd.setDelegate(this);
    this.setChild("btnAdd", this._fBtnAdd);

    this._branchId = null;
    this._ids = null;
    this._selectedId = null;
    this._isEditEnabled = false;
  }

  setBranchId(id) { this._branchId = id; }
  setEnableEdit(b) { this._isEditEnabled = b; }

  isRegisterSelectedInRegisterFragment(fRegister, registerId) {
    return this._selectedId == registerId;
  }

  onSimpleButtonClicked(fBtn) { this.#asyncAdd(); }
  onRegisterFragmentRequestShowView(fRegister, view, title) {
    this._delegate.onRegisterListFragmentRequestShowView(this, view, title);
  }
  onClickInRegisterFragment(fRegister, registerId) {
    this._selectedId = registerId;
    this.render();
    this._delegate.onRegisterSelectedInRegisterListFragment(this, registerId);
  }

  _renderOnRender(render) {
    if (!this._ids) {
      this.#asyncGetRegisterIds();
      return;
    }

    let pMain = new ListPanel();
    render.wrapPanel(pMain);
    let p = new PanelWrapper();
    pMain.pushPanel(p);

    this._fItems.clear();
    for (let id of this._ids) {
      let f = new FRegister();
      f.setLayoutType(FRegister.T_LAYOUT.SMALL);
      f.setRegisterId(id);
      f.setEnableEdit(this._isEditEnabled);
      f.setDataSource(this);
      f.setDelegate(this);
      this._fItems.append(f);
    }
    this._fItems.attachRender(p);
    this._fItems.render();

    pMain.pushSpace(1);

    if (this._isEditEnabled) {
      p = new PanelWrapper();
      pMain.pushPanel(p);
      this._fBtnAdd.attachRender(p);
      this._fBtnAdd.render();
    }
  }

  #asyncGetRegisterIds() {
    let url = "api/shop/register_ids";
    let fd = new FormData();
    fd.append("branch_id", this._branchId);
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onRegisterIdsRRR(d));
  }

  #onRegisterIdsRRR(data) {
    this._ids = data.ids;
    this.render();
  }

  #asyncAdd() {
    let url = "api/shop/add_register";
    let fd = new FormData();
    fd.append("branch_id", this._branchId);
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onAddRegisterRRR(d));
  }

  #onAddRegisterRRR(data) {
    if (this._ids) {
      let r = new ShopRegister(data.register);
      this._ids.push(r.getId());
    }
    this.render();
  }
};
