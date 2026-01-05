export const CF_REGISTER = {
  ON_CLICK : Symbol(),
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

export class FRegister extends Fragment {
  static T_LAYOUT = {
    SMALL : Symbol(),
    FULL: Symbol(),
  };

  constructor() {
    super();
    this._fTerminals = new FPaymentTerminalList();
    this._fTerminals.setDelegate(this);
    this.setChild("terminals", this._fTerminals);

    this._fNameInput = new TextInput();
    this._fNameInput.setDelegate(this);
    this.setChild("nameEditor", this._fNameInput);

    this._tLayout = null;
    this._registerId = null;
    this._isEditEnabled = false;
  }

  setRegisterId(id) { this._registerId = id; }
  setLayoutType(t) { this._tLayout = t; }
  setEnableEdit(b) { this._isEditEnabled = b; }

  onInputChangeInTextInputFragment(fTextInput, value) { this.#asyncUpdate(); }
  onPaymentTerminalListFragmentRequestShowView(fTerminals, view, title) {
    this._delegate.onRegisterFragmentRequestShowView(this, view, title);
  }
  onPaymentTerminalSelectedInPaymentTerminalListFragment(fTerminalList,
                                                         terminalId) {
    let v = new View();
    let f = new FvcPaymentTerminal();
    f.setTerminalId(terminalId);
    f.setEnableEdit(this._isEditEnabled);
    v.setContentFragment(f);
    this._delegate.onRegisterFragmentRequestShowView(this, v,
                                                     "Terminal config");
  }

  action(type, ...args) {
    switch (type) {
    case CF_REGISTER.ON_CLICK:
      this._delegate.onClickInRegisterFragment(this, this._registerId);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.SHOP_REGISTER:
      if (data.getId() == this._registerId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
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
      this._fTerminals.attachRender(pp.getContentPanel());
      this._fTerminals.render();
    }
  }

  #createPanel() {
    let p;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.SMALL:
      p = new PRegisterSmall();
      p.setAttribute("onclick",
                     "javascript:G.action(shop.CF_REGISTER.ON_CLICK)");
      break;
    default:
      p = new PRegister();
      break;
    }
    return p;
  }

  #renderName(register, panel) {
    let name = register.getName();
    if (name && name.length) {
      panel.replaceContent(name);
    } else {
      panel.replaceContent("New register");
    }
  }
  #collectData() {
    let fd = new FormData();
    fd.append("id", this._registerId);
    fd.append("name", this._fNameInput.getValue());
    return fd;
  }

  #asyncUpdate() {
    let url = "api/shop/update_register";
    let fd = this.#collectData();
    Api.asFragmentPost(this, url, fd).then(d => this.#onUpdateRRR(d));
  }

  #onUpdateRRR(data) {
    Shop.updateRegister(new ShopRegister(data.register));
  }
};
