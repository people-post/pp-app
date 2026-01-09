import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { PSquareTerminal } from './PSquareTerminal.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { SquareTerminal } from '../datatypes/SquareTerminal.js';

export class FSquareTerminal extends Fragment {
  private _obj: SquareTerminal | null = null;

  constructor() {
    super();
    this._obj = null;
  }

  setData(obj: SquareTerminal): void { this._obj = obj; }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
    if (!this._obj) return;
    let panel = new PSquareTerminal();
    render.wrapPanel(panel);

    let p = panel.getTitlePanel();
    this.#renderItemInfo(p, "Square terminal", "Device type");

    p = panel.getDeviceIdPanel();
    this.#renderItemInfo(p, this._obj.getDeviceId(), "Device id");

    p = panel.getPairCodePanel();
    this.#renderItemInfo(p, this._obj.getPairCode(), "Pair code");

    p = panel.getPairByPanel();
    this.#renderItemInfo(p, this._obj.getPairBy(), "Pair by");

    p = panel.getStatusPanel();
    this.#renderItemInfo(p, this._obj.getStatus(), "Status");

    p = panel.getPairedAtPanel();
    this.#renderItemInfo(p, this._obj.getPairedAt(), "Paired at");
  }

  #renderItemInfo(panel: Panel, value: string | null, title: string): void {
    if (value) {
      panel.replaceContent(title + ": " + value);
    }
  }
}

export default FSquareTerminal;
