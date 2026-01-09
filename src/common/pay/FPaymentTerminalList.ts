import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FPaymentTerminal } from './FPaymentTerminal.js';
import { PaymentTerminal } from '../datatypes/PaymentTerminal.js';
import { Api } from '../plt/Api.js';
import { View } from '../../lib/ui/controllers/views/View.js';

export class FPaymentTerminalList extends Fragment {
  private _fItems: FSimpleFragmentList;
  private _fBtnAdd: Button;
  private _registerId: string | null = null;
  private _ids: string[] | null = null;
  private _selectedId: string | null = null;
  private _isEditEnabled = false;

  constructor() {
    super();
    this._fItems = new FSimpleFragmentList();
    this.setChild("items", this._fItems);

    this._fBtnAdd = new Button();
    this._fBtnAdd.setName("+New payment device...");
    this._fBtnAdd.setDelegate(this);
    this.setChild("btnAdd", this._fBtnAdd);

    this._registerId = null;
    this._ids = null;
    this._selectedId = null;
    this._isEditEnabled = false;
  }

  getRegisterId(): string | null { return this._registerId; }

  setRegisterId(id: string | null): void { this._registerId = id; }
  setEnableEdit(b: boolean): void { this._isEditEnabled = b; }

  isTerminalSelectedInPaymentTerminalFragment(_fTerminal: FPaymentTerminal, terminalId: string): boolean {
    return this._selectedId == terminalId;
  }

  onSimpleButtonClicked(_fBtn: Button): void { this.#asyncStartAdd(); }
  onPaymentTerminalFragmentRequestShowView(_fTerminal: FPaymentTerminal, view: View, title: string): void {
    // @ts-expect-error - delegate may have this method
    this._delegate?.onPaymentTerminalListFragmentRequestShowView?.(this, view, title);
  }
  onClickInPaymentTerminalFragment(_fTerminal: FPaymentTerminal, terminalId: string): void {
    this._selectedId = terminalId;
    this.render();
    // @ts-expect-error - delegate may have this method
    this._delegate?.onPaymentTerminalSelectedInPaymentTerminalListFragment?.(this, terminalId);
  }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
    if (!this._ids) {
      this.#asyncGetTerminalIds();
      return;
    }

    let pMain = new ListPanel();
    render.wrapPanel(pMain);
    let p = new PanelWrapper();
    pMain.pushPanel(p);

    this._fItems.clear();
    for (let id of this._ids) {
      let f = new FPaymentTerminal();
      f.setLayoutType(FPaymentTerminal.T_LAYOUT.SMALL);
      f.setTerminalId(id);
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

  #asyncGetTerminalIds(): void {
    let url = "api/shop/payment_terminal_ids";
    let fd = new FormData();
    if (this._registerId) {
      fd.append("register_id", this._registerId);
    }
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onTerminalIdsRRR(d));
  }

  #onTerminalIdsRRR(data: { ids: string[] }): void {
    this._ids = data.ids;
    this.render();
  }

  #asyncStartAdd(): void {
    this._confirmDangerousOperation(
        "Currently only support square terminal. Do you want to preceed?",
        () => this.#asyncAdd());
  }

  #asyncAdd(): void {
    let url = "api/shop/add_terminal";
    let fd = new FormData();
    if (this._registerId) {
      fd.append("register_id", this._registerId);
    }
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onAddTerminalRRR(d));
  }

  #onAddTerminalRRR(data: { terminal: unknown }): void {
    if (this._ids) {
      let t = new PaymentTerminal(data.terminal);
      this._ids.push(t.getId());
    }
    this.render();
  }
}

export default FPaymentTerminalList;
