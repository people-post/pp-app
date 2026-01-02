import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { PPaymentTerminalSmall } from './PPaymentTerminalSmall.js';
import { PPaymentTerminal } from './PPaymentTerminal.js';
import { FSquareTerminal } from './FSquareTerminal.js';
import { T_DATA } from '../plt/Events.js';
import { Shop } from '../dba/Shop.js';
import { PaymentTerminal } from '../datatypes/PaymentTerminal.js';
import Utilities from '../Utilities.js';

export const CF_PAYMENT_TERMINAL = {
  ON_CLICK : Symbol(),
};

export class FPaymentTerminal extends Fragment {
  static T_LAYOUT = {
    SMALL : Symbol(),
    FULL: Symbol(),
  };

  constructor() {
    super();
    this._fNameInput = new TextInput();
    this._fNameInput.setDelegate(this);
    this.setChild("nameEditor", this._fNameInput);

    this._fDetail = null;

    this._tLayout = null;
    this._terminalId = null;
    this._isEditEnabled = false;
  }

  setTerminalId(id) { this._terminalId = id; }
  setLayoutType(t) { this._tLayout = t; }
  setEnableEdit(b) { this._isEditEnabled = b; }

  onInputChangeInTextInputFragment(fTextInput, value) { this.#asyncUpdate(); }

  action(type, ...args) {
    switch (type) {
    case CF_PAYMENT_TERMINAL.ON_CLICK:
      this._delegate.onClickInPaymentTerminalFragment(this, this._terminalId);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.PAYMENT_TERMINAL:
      if (data.getId() == this._terminalId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let terminal = Shop.getPaymentTerminal(this._terminalId);
    if (!terminal) {
      return;
    }

    let panel = this.#createPanel();
    render.wrapPanel(panel);

    if (this._dataSource && panel.isColorInvertible() &&
        this._dataSource.isTerminalSelectedInPaymentTerminalFragment(
            this, this._terminalId)) {
      panel.invertColor();
    }

    let p = panel.getNameDecorationPanel();
    if (p) {
      p.replaceContent(R.t("Terminal name") + ": ");
    }
    p = panel.getNamePanel();
    if (p) {
      this.#renderName(terminal, p);
    }

    p = panel.getNameEditorPanel();
    if (p && this._isEditEnabled) {
      this._fNameInput.setConfig(
          {title : "", hint : "Terminal name", value : terminal.getName()});
      this._fNameInput.attachRender(p);
      this._fNameInput.render();
    }

    p = panel.getStatusPanel();
    if (p) {
      p.replaceContent(
          Utilities.renderStatus(terminal.getState(), terminal.getStatus()));
    }

    p = panel.getDetailPanel();
    if (p) {
      this._fDetail =
          this.#initDetailFragment(terminal.getType(), terminal.getDataObj());
      this.setChild("detail", this._fDetail);
      if (this._fDetail) {
        this._fDetail.attachRender(p);
        this._fDetail.render();
      }
    }
  }

  #createPanel() {
    let p;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.SMALL:
      p = new PPaymentTerminalSmall();
      p.setAttribute("onclick",
                     "javascript:G.action(pay.CF_PAYMENT_TERMINAL.ON_CLICK)");
      break;
    default:
      p = new PPaymentTerminal();
      break;
    }
    return p;
  }

  #renderName(terminal, panel) {
    let s = terminal.getName();
    s = s ? s : "";
    s = s + "[" + terminal.getTypeName() + "]";
    panel.replaceContent(s);
  }

  #initDetailFragment(type, dataObj) {
    let f;
    switch (type) {
    case PaymentTerminal.T_TYPE.SQUARE_TERMINAL:
      f = new FSquareTerminal();
      f.setData(dataObj);
      break;
    default:
      break;
    }
    return f;
  }

  #collectData() {
    let fd = new FormData();
    fd.append("id", this._terminalId);
    fd.append("name", this._fNameInput.getValue());
    return fd;
  }

  #asyncUpdate() {
    let url = "api/shop/update_terminal";
    let fd = this.#collectData();
    glb.api.asFragmentPost(this, url, fd).then(d => this.#onUpdateRRR(d));
  }

  #onUpdateRRR(data) {
    Shop.updatePaymentTerminal(new PaymentTerminal(data.terminal));
  }
};
