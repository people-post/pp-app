export const CF_BRANCH = {
  ON_CLICK : "CF_BRANCH_1",
};

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ShopBranch } from '../../common/datatypes/ShopBranch.js';
import { Address } from '../../common/gui/Address.js';
import { FRegisterList } from './FRegisterList.js';
import { FvcRegister } from './FvcRegister.js';
import { PBranch } from './PBranch.js';
import { PBranchSmall } from './PBranchSmall.js';
import { Shop } from '../../common/dba/Shop.js';
import { Address as AddressDBA } from '../../common/dba/Address.js';
import { T_DATA } from '../../common/plt/Events.js';
import { R } from '../../common/constants/R.js';
import { FvcAddressEditor } from '../../sectors/account/FvcAddressEditor.js';
import { Api } from '../../common/plt/Api.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type Render from '../../lib/ui/renders/Render.js';
import { PBranchBase } from './PBranchBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

interface BranchDelegate {
  onBranchFragmentRequestShowView(f: FBranch, view: View, title: string): void;
  onClickInBranchFragment(f: FBranch, branchId: string | null): void;
}

interface BranchDataSource {
  isBranchSelectedInBranchFragment(f: FBranch, branchId: string | null): boolean;
}

export class FBranch extends Fragment {
  static T_LAYOUT = {
    SMALL : Symbol(),
    FULL: Symbol(),
  } as const;

  protected _fRegisters: FRegisterList;
  protected _fAddress: Address;
  protected _fNameInput: TextInput;
  protected _tLayout: symbol | null = null;
  protected _branchId: string | null = null;
  protected _isEditEnabled: boolean = false;

  constructor() {
    super();
    this._fRegisters = new FRegisterList();
    this._fRegisters.setDelegate(this);
    this.setChild("registers", this._fRegisters);

    this._fAddress = new Address();
    this._fAddress.setDataSource(this);
    this._fAddress.setDelegate(this);
    this._fAddress.setLayoutType(Address.T_LAYOUT.SMALL);
    this.setChild("address", this._fAddress);

    this._fNameInput = new TextInput();
    this._fNameInput.setDelegate(this);
    this.setChild("nameEditor", this._fNameInput);
  }

  setBranchId(id: string | null): void { this._branchId = id; }
  setLayoutType(t: symbol | null): void { this._tLayout = t; }
  setEnableEdit(b: boolean): void { this._isEditEnabled = b; }

  getDataForGuiAddress(_fAddress: Address, addressId: string): any {
    return AddressDBA.get(addressId);
  }

  onInputChangeInTextInputFragment(_fTextInput: TextInput, _value: string): void { this.#asyncUpdate(); }
  onClickInAddressFragment(_fAddress: Address, addressId: string): void {
    if (!this._tLayout || this._tLayout == FBranch.T_LAYOUT.FULL) {
      this.#showAddressEditor(addressId);
    } else {
      this._delegate.onClickInBranchFragment(this, this._branchId);
    }
  }
  onAddressFragmentRequestEdit(_fAddress: Address, addressId: string): void {
    this.#showAddressEditor(addressId);
  }

  onAddressFragmentRequestDelete(_fAddress: Address, _addressId: string): void {}

  onRegisterListFragmentRequestShowView(_fRegisterList: FRegisterList, view: View, title: string): void {
    this._delegate.onBranchFragmentRequestShowView(this, view, title);
  }
  onRegisterSelectedInRegisterListFragment(_fRegisterList: FRegisterList, registerId: string): void {
    let v = new View();
    let f = new FvcRegister();
    f.setRegisterId(registerId);
    f.setEnableEdit(this._isEditEnabled);
    v.setContentFragment(f);
    this._delegate.onBranchFragmentRequestShowView(this, v, "Register config");
  }

  action(type: string | symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_BRANCH.ON_CLICK:
      this._delegate.onClickInBranchFragment(this, this._branchId);
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: any): void {
    switch (dataType) {
    case T_DATA.SHOP_BRANCH:
      if (data && data.getId && data.getId() == this._branchId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: PanelWrapper): void {
    let branch = Shop.getBranch(this._branchId);
    if (!branch) {
      return;
    }

    let panel = this.#createPanel();
    render.wrapPanel(panel);

    if (this._dataSource && panel.isColorInvertible() &&
        this._dataSource.isBranchSelectedInBranchFragment(this,
                                                          this._branchId)) {
      panel.invertColor();
    }

    let p = panel.getAddressPanel();
    if (p) {
      this._fAddress.setAddressId(branch.getAddressId());
      this._fAddress.attachRender(p);
      this._fAddress.render();
    }

    p = panel.getNameDecorationPanel();
    if (p) {
      p.replaceContent(R.t("Branch name") + ": ");
    }

    p = panel.getNamePanel();
    if (p) {
      this.#renderName(branch, p);
    }

    p = panel.getNameEditorPanel();
    if (p && this._isEditEnabled) {
      this._fNameInput.setConfig(
          {title : "", hint : "Branch name", value : branch.getName()});
      this._fNameInput.attachRender(p);
      this._fNameInput.render();
    }

    p = panel.getRegisterListPanel();
    if (p) {
      let pp = new SectionPanel("Registers");
      p.wrapPanel(pp);
      this._fRegisters.setBranchId(this._branchId);
      this._fRegisters.setEnableEdit(this._isEditEnabled);
      this._fRegisters.attachRender(pp.getContentPanel()!);
      this._fRegisters.render();
    }
  }

  #createPanel(): PBranchBase {
    let p: PBranchBase;
    switch (this._tLayout) {
    case FBranch.T_LAYOUT.SMALL:
      p = new PBranchSmall();
      p.setAttribute("onclick", "javascript:G.action('${CF_BRANCH.ON_CLICK}')");
      break;
    default:
      p = new PBranch();
      break;
    }
    return p;
  }

  #renderName(branch: ShopBranch, panel: Panel): void {
    let name = branch.getName();
    if (name && name.length) {
      panel.replaceContent(name);
    } else {
      panel.replaceContent("New branch");
    }
  }

  #showAddressEditor(addressId: string): void {
    let v = new View();
    let f = new FvcAddressEditor();
    f.setAddressId(addressId);
    v.setContentFragment(f);
    this._delegate.onBranchFragmentRequestShowView(this, v, "Edit address");
  }

  #collectData(): FormData {
    let fd = new FormData();
    if (this._branchId) {
      fd.append("id", this._branchId);
    }
    fd.append("name", this._fNameInput.getValue());
    return fd;
  }

  #asyncUpdate(): void {
    let url = "api/shop/update_branch";
    let fd = this.#collectData();
    Api.asFragmentPost(this, url, fd).then((d: any) => this.#onUpdateRRR(d));
  }

  #onUpdateRRR(data: { branch: any }): void { Shop.updateBranch(new ShopBranch(data.branch)); }
}
