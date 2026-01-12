export const CF_REGISTER = {
  ON_CLICK : "CF_REGISTER_1",
};

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ShopRegister } from '../../common/datatypes/ShopRegister.js';
import { T_DATA } from '../../common/plt/Events.js';
import { PRegisterSmall } from './PRegisterSmall.js';
import { PRegister } from './PRegister.js';
import { FPaymentTerminalList } from '../../common/pay/FPaymentTerminalList.js';
import { FvcPaymentTerminal } from '../../common/pay/FvcPaymentTerminal.js';
import { Shop } from '../../common/dba/Shop.js';
import { R } from '../../common/constants/R.js';
import { Api } from '../../common/plt/Api.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type Render from '../../lib/ui/renders/Render.js';
import { PRegisterBase } from './PRegisterBase.js';

interface RegisterDelegate {
  onRegisterFragmentRequestShowView(f: FRegister, view: View, title: string): void;
  onClickInRegisterFragment(f: FRegister, registerId: string | null): void;
}

interface RegisterDataSource {
  isRegisterSelectedInRegisterFragment(f: FRegister, registerId: string | null): boolean;
}

export class FRegister extends Fragment {
  static T_LAYOUT = {
    SMALL : Symbol(),
    FULL: Symbol(),
  } as const;

  protected _fTerminals: FPaymentTerminalList;
  protected _fNameInput: TextInput;
  protected _tLayout: symbol | null = null;
  protected _registerId: string | null = null;
  protected _isEditEnabled: boolean = false;

  constructor() {
    super();
    this._fTerminals = new FPaymentTerminalList();
    this._fTerminals.setDelegate(this);
    this.setChild("terminals", this._fTerminals);

    this._fNameInput = new TextInput();
    this._fNameInput.setDelegate(this);
    this.setChild("nameEditor", this._fNameInput);
  }

  setRegisterId(id: string | null): void { this._registerId = id; }
  setLayoutType(t: symbol | null): void { this._tLayout = t; }
  setEnableEdit(b: boolean): void { this._isEditEnabled = b; }

  onInputChangeInTextInputFragment(_fTextInput: TextInput, _value: string): void { this.#asyncUpdate(); }
  onPaymentTerminalListFragmentRequestShowView(_fTerminals: FPaymentTerminalList, view: View, title: string): void {
    this._delegate.onRegisterFragmentRequestShowView(this, view, title);
  }
  onPaymentTerminalSelectedInPaymentTerminalListFragment(_fTerminalList: FPaymentTerminalList,
                                                         terminalId: string): void {
    let v = new View();
    let f = new FvcPaymentTerminal();
    f.setTerminalId(terminalId);
    f.setEnableEdit(this._isEditEnabled);
    v.setContentFragment(f);
    this._delegate.onRegisterFragmentRequestShowView(this, v,
                                                     "Terminal config");
  }

  action(type: string | symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_REGISTER.ON_CLICK:
      this._delegate.onClickInRegisterFragment(this, this._registerId);
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: any): void {
    switch (dataType) {
    case T_DATA.SHOP_REGISTER:
      if (data && data.getId && data.getId() == this._registerId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Render): void {
    let register = Shop.getRegister(this._registerId);
    if (!register) {
      return;
    }

    let panel = this.#createPanel();
    render.wrapPanel(panel);

    if (this._dataSource && panel.isColorInvertible() &&
        this._dataSource.isRegisterSelectedInRegisterFragment(
            this, this._registerId)) {
      panel.invertColor();
    }

    let p = panel.getNameDecorationPanel();
    if (p) {
      p.replaceContent(R.t("Register name") + ": ");
    }

    p = panel.getNamePanel();
    if (p) {
      this.#renderName(register, p);
    }

    p = panel.getNameEditorPanel();
    if (p && this._isEditEnabled) {
      this._fNameInput.setConfig(
          {title : "", hint : "Register name", value : register.getName()});
      this._fNameInput.attachRender(p);
      this._fNameInput.render();
    }

    p = panel.getTerminalListPanel();
    if (p) {
      let pp = new SectionPanel("Payment terminals");
      p.wrapPanel(pp);
      this._fTerminals.setRegisterId(this._registerId);
      this._fTerminals.setEnableEdit(this._isEditEnabled);
      this._fTerminals.attachRender(pp.getContentPanel()!);
      this._fTerminals.render();
    }
  }

  #createPanel(): PRegisterBase {
    let p: PRegisterBase;
    switch (this._tLayout) {
    case FRegister.T_LAYOUT.SMALL:
      p = new PRegisterSmall();
      p.setAttribute("onclick",
                     "javascript:G.action('${CF_REGISTER.ON_CLICK}')");
      break;
    default:
      p = new PRegister();
      break;
    }
    return p;
  }

  #renderName(register: ShopRegister, panel: Panel): void {
    let name = register.getName();
    if (name && name.length) {
      panel.replaceContent(name);
    } else {
      panel.replaceContent("New register");
    }
  }
  #collectData(): FormData {
    let fd = new FormData();
    if (this._registerId) {
      fd.append("id", this._registerId);
    }
    fd.append("name", this._fNameInput.getValue());
    return fd;
  }

  #asyncUpdate(): void {
    let url = "api/shop/update_register";
    let fd = this.#collectData();
    Api.asFragmentPost(this, url, fd).then((d: any) => this.#onUpdateRRR(d));
  }

  #onUpdateRRR(data: { register: any }): void {
    Shop.updateRegister(new ShopRegister(data.register));
  }
}
