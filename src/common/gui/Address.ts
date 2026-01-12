import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { PAddress } from './PAddress.js';
import { PAddressSmall } from './PAddressSmall.js';
import { T_DATA } from '../plt/Events.js';
import type { Address as AddressDataType } from '../datatypes/Address.js';

export const CF_ADDRESS = {
  ON_CLICK : "CF_ADDRESS_1",
};

export class Address extends Fragment {
  static T_LAYOUT = {
    LARGE : Symbol(),
    SMALL: Symbol(),
  };

  #fBtnEdit: Button;
  #fBtnDelete: Button;
  #addressId: string | null = null;
  #tLayout: symbol | null = null;

  constructor() {
    super();
    this.#fBtnEdit = new Button();
    this.#fBtnEdit.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#fBtnEdit.setName("Edit");
    this.#fBtnEdit.setDelegate(this as unknown as { [key: string]: unknown; onRemoteErrorInController?(c: unknown, e: unknown): void });
    this.setChild("btnEdit", this.#fBtnEdit);

    this.#fBtnDelete = new Button();
    this.#fBtnDelete.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#fBtnDelete.setName("Delete...");
    this.#fBtnDelete.setThemeType(Button.T_THEME.DANGER);
    this.#fBtnDelete.setDelegate(this as unknown as { [key: string]: unknown; onRemoteErrorInController?(c: unknown, e: unknown): void });
    this.setChild("btnDelete", this.#fBtnDelete);
  }

  getAddressId(): string | null { return this.#addressId; }

  setAddressId(id: string | null): void { this.#addressId = id; }
  setLayoutType(t: symbol | null): void { this.#tLayout = t; }

  onSimpleButtonClicked(fBtn: Button): void {
    switch (fBtn) {
    case this.#fBtnEdit:
      this.#onEdit();
      break;
    case this.#fBtnDelete:
      this.#onDelete();
      break;
    default:
      break;
    }
  }

  action(type: symbol): void {
    switch (type) {
    case CF_ADDRESS.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action(type);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.ADDRESS:
      if ((data as { getId(): string }).getId() == this.#addressId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: unknown): void {
    const addr = (this._dataSource as { getDataForGuiAddress(f: Address, id: string | null): AddressDataType | null }).getDataForGuiAddress(this, this.#addressId);
    if (!addr) {
      return;
    }
    const panel = this.#createPanel();
    panel.setAttribute("onclick",
                       "javascript:G.action('${CF_ADDRESS.ON_CLICK}')");
    (render as { wrapPanel(p: unknown): void }).wrapPanel(panel);
    let p = panel.getNicknamePanel();
    if (p) {
      p.replaceContent(this.#toString(addr.getNickname()));
    }
    p = panel.getNamePanel();
    if (p) {
      p.replaceContent(this.#toString(addr.getName()));
    }
    p = panel.getCountryPanel();
    if (p) {
      p.replaceContent(this.#toString(addr.getCountry()));
    }
    p = panel.getStatePanel();
    if (p) {
      p.replaceContent(this.#toString(addr.getState()));
    }
    p = panel.getCityPanel();
    if (p) {
      p.replaceContent(this.#toString(addr.getCity()));
    }
    p = panel.getZipcodePanel();
    if (p) {
      p.replaceContent(this.#toString(addr.getZipcode()));
    }
    p = panel.getLine1Panel();
    if (p) {
      p.replaceContent(this.#toString(addr.getLine(0)));
    }
    p = panel.getLine2Panel();
    if (p) {
      p.replaceContent(this.#toString(addr.getLine(1)));
    }
    p = panel.getEditBtnPanel();
    if (p) {
      this.#fBtnEdit.attachRender(p);
      this.#fBtnEdit.render();
    }
    p = panel.getDeleteBtnPanel();
    if (p) {
      this.#fBtnDelete.attachRender(p);
      this.#fBtnDelete.render();
    }
  }

  #createPanel(): PAddress | PAddressSmall {
    let p: PAddress | PAddressSmall;
    switch (this.#tLayout) {
    case Address.T_LAYOUT.SMALL:
      p = new PAddressSmall();
      break;
    default:
      p = new PAddress();
      break;
    }
    return p;
  }

  #toString(s: string | undefined): string { return s ? s : ""; }

  #onClick(): void {
    if (this._delegate) {
      (this._delegate as { onClickInAddressFragment(f: Address, id: string | null): void }).onClickInAddressFragment(this, this.#addressId);
    }
  }

  #onEdit(): void {
    if (this._delegate) {
      (this._delegate as { onAddressFragmentRequestEdit(f: Address, id: string | null): void }).onAddressFragmentRequestEdit(this, this.#addressId);
    }
  }

  #onDelete(): void {
    if (this._delegate) {
      (this._delegate as { onAddressFragmentRequestDelete(f: Address, id: string | null): void }).onAddressFragmentRequestDelete(this, this.#addressId);
    }
  }
}

