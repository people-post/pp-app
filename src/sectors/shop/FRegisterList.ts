import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ShopRegister } from '../../common/datatypes/ShopRegister.js';
import { Api } from '../../common/plt/Api.js';
import { FRegister } from './FRegister.js';
import type Render from '../../lib/ui/renders/Render.js';
import { View } from '../../lib/ui/controllers/views/View.js';

interface RegisterListDelegate {
  onRegisterListFragmentRequestShowView(f: FRegisterList, view: View, title: string): void;
  onRegisterSelectedInRegisterListFragment(f: FRegisterList, registerId: string): void;
}

export class FRegisterList extends Fragment {
  protected _fItems: FSimpleFragmentList;
  protected _fBtnAdd: Button;
  protected _branchId: string | null = null;
  protected _ids: string[] | null = null;
  protected _selectedId: string | null = null;
  protected _isEditEnabled: boolean = false;
  protected _delegate!: RegisterListDelegate;

  constructor() {
    super();
    this._fItems = new FSimpleFragmentList();
    this.setChild("items", this._fItems);

    this._fBtnAdd = new Button();
    this._fBtnAdd.setName("+New register");
    this._fBtnAdd.setDelegate(this);
    this.setChild("btnAdd", this._fBtnAdd);
  }

  setBranchId(id: string | null): void { this._branchId = id; }
  setEnableEdit(b: boolean): void { this._isEditEnabled = b; }

  isRegisterSelectedInRegisterFragment(_fRegister: FRegister, registerId: string): boolean {
    return this._selectedId == registerId;
  }

  onSimpleButtonClicked(_fBtn: Button): void { this.#asyncAdd(); }
  onRegisterFragmentRequestShowView(_fRegister: FRegister, view: View, title: string): void {
    this._delegate.onRegisterListFragmentRequestShowView(this, view, title);
  }
  onClickInRegisterFragment(_fRegister: FRegister, registerId: string): void {
    this._selectedId = registerId;
    this.render();
    this._delegate.onRegisterSelectedInRegisterListFragment(this, registerId);
  }

  _renderOnRender(render: Render): void {
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

  #asyncGetRegisterIds(): void {
    if (!this._branchId) return;
    let url = "api/shop/register_ids";
    let fd = new FormData();
    fd.append("branch_id", this._branchId);
    Api.asFragmentPost(this, url, fd)
        .then((d: any) => this.#onRegisterIdsRRR(d));
  }

  #onRegisterIdsRRR(data: { ids: string[] }): void {
    this._ids = data.ids;
    this.render();
  }

  #asyncAdd(): void {
    if (!this._branchId) return;
    let url = "api/shop/add_register";
    let fd = new FormData();
    fd.append("branch_id", this._branchId);
    Api.asFragmentPost(this, url, fd)
        .then((d: any) => this.#onAddRegisterRRR(d));
  }

  #onAddRegisterRRR(data: { register: any }): void {
    if (this._ids) {
      let r = new ShopRegister(data.register);
      this._ids.push(r.getId());
    }
    this.render();
  }
}
