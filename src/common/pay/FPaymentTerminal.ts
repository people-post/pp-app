import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { PPaymentTerminalSmall } from './PPaymentTerminalSmall.js';
import { PPaymentTerminal } from './PPaymentTerminal.js';
import { FSquareTerminal } from './FSquareTerminal.js';
import { T_DATA } from '../plt/Events.js';
import { Shop } from '../dba/Shop.js';
import { PaymentTerminal } from '../datatypes/PaymentTerminal.js';
import { Utilities } from '../Utilities.js';
import { Api } from '../plt/Api.js';
import { R } from '../constants/R.js';

export const CF_PAYMENT_TERMINAL = {
  ON_CLICK : Symbol(),
};

interface FPaymentTerminalDelegate {
  onClickInPaymentTerminalFragment(f: FPaymentTerminal, terminalId: string | null): void;
}

interface FPaymentTerminalDataSource {
  isTerminalSelectedInPaymentTerminalFragment(f: FPaymentTerminal, terminalId: string | null): boolean;
}

export class FPaymentTerminal extends Fragment {
  static T_LAYOUT = {
    SMALL : Symbol(),
    FULL: Symbol(),
  };

  protected _fNameInput: TextInput;
  protected _fDetail: Fragment | null = null;
  protected _tLayout: symbol | null = null;
  protected _terminalId: string | null = null;
  protected _isEditEnabled: boolean = false;
  protected _delegate!: FPaymentTerminalDelegate;
  protected _dataSource!: FPaymentTerminalDataSource;

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

  setTerminalId(id: string | null): void { this._terminalId = id; }
  setLayoutType(t: symbol | null): void { this._tLayout = t; }
  setEnableEdit(b: boolean): void { this._isEditEnabled = b; }

  onInputChangeInTextInputFragment(fTextInput: TextInput, value: string): void { this.#asyncUpdate(); }

  action(type: string | symbol, ...args: any[]): void {
    switch (type) {
    case CF_PAYMENT_TERMINAL.ON_CLICK:
      this._delegate.onClickInPaymentTerminalFragment(this, this._terminalId);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType: string, data: any): void {
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

  _renderOnRender(render: any): void {
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
          {title : "", hint : "Terminal name", value : terminal.getName() || ""});
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

  #createPanel(): PPaymentTerminal | PPaymentTerminalSmall {
    let p: PPaymentTerminal | PPaymentTerminalSmall;
    switch (this._tLayout) {
    case FPaymentTerminal.T_LAYOUT.SMALL:
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

  #renderName(terminal: PaymentTerminal, panel: any): void {
    let s = terminal.getName() || "";
    s = s + "[" + terminal.getTypeName() + "]";
    panel.replaceContent(s);
  }

  #initDetailFragment(type: string | undefined, dataObj: any): Fragment | null {
    let f: Fragment | null = null;
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

  #collectData(): FormData {
    let fd = new FormData();
    fd.append("id", this._terminalId || "");
    fd.append("name", this._fNameInput.getValue());
    return fd;
  }

  #asyncUpdate(): void {
    let url = "api/shop/update_terminal";
    let fd = this.#collectData();
    Api.asFragmentPost(this, url, fd).then((d: any) => this.#onUpdateRRR(d));
  }

  #onUpdateRRR(data: any): void {
    Shop.updatePaymentTerminal(new PaymentTerminal(data.terminal));
  }
}
