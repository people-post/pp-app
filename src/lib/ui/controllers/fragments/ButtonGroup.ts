import { Fragment } from './Fragment.js';
import { Utilities as CommonUtilities } from '../../../../common/Utilities.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { Panel } from '../../renders/panels/Panel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';

export const CF_BUTTON_GROUP = {
  ON_CLICK : "CF_BUTTON_GROUP_1",
};

const _CFT_BUTTON_GROUP = {
  F_ONCLICK : `javascript:G.action('${CF_BUTTON_GROUP.ON_CLICK}', __IDX__)`,
  ICON_WRAPPER :
      `<span class="inline-block s-icon5 v-middle-align">__ICON__</span>`,
} as const;

interface ChoiceInfo {
  name: string;
  value: any;
  icon?: string;
  fDetail?: Fragment | null;
}

export interface ButtonGroupDelegate {
  onButtonGroupSelectionChanged(f: ButtonGroup, value: any): void;
}

export class ButtonGroup extends Fragment {
  private _choices: ChoiceInfo[] = [];
  private _selectedIdx: number | null = null;

  constructor() {
    super();
    this._choices = [];
    this._selectedIdx = null;
  }

  getSelectedValue(): any {
    let c = this._choices[this._selectedIdx ?? -1];
    return c ? c.value : null;
  }
  addChoice(choiceInfo: ChoiceInfo): void {
    // {name: "", value: "", icon: "", fDetail: ""}
    this._choices.push(choiceInfo);
  }

  setSelectedValue(value: any): void {
    this._selectedIdx = this._choices.findIndex(x => x.value == value);
  }

  updateChoice(value: any, info: ChoiceInfo): void {
    let idx = this._choices.findIndex(x => x.value == value);
    if (idx < 0) {
      return;
    }
    this._choices[idx] = info;
    this.render();
  }

  clearChoices(): void {
    this._choices = [];
    this._selectedIdx = null;
  }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_BUTTON_GROUP.ON_CLICK:
      this.#onClick(args[0]);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  #onClick(idx: any): void {
    if (this._selectedIdx == idx) {
      return;
    }
    this._selectedIdx = idx;
    const delegate = this.getDelegate<ButtonGroupDelegate>();
    if (delegate) {
      delegate.onButtonGroupSelectionChanged(this, this.getSelectedValue());
    }
    this.render();
  }

  _renderOnRender(render: PanelWrapper): void {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderButtons());

    let fDetail = this.#getDetail();
    this.setChild("detail", fDetail);
    if (fDetail) {
      pp = new PanelWrapper();
      p.pushPanel(pp);
      fDetail.attachRender(pp);
      fDetail.render();
    }
  }

  #renderButtons(): string {
    let table = document.createElement("TABLE");
    table.className = "group-button";
    let row = (table as HTMLTableElement).insertRow(-1);
    for (let [i, c] of this._choices.entries()) {
      let cell = row.insertCell(-1);
      cell.innerHTML = this.#renderButtonName(c);
      this.#renderCellButton(cell, i);
    }
    return table.outerHTML;
  }

  #renderButtonName(config: ChoiceInfo): string {
    if (config.icon) {
      let ss: string = _CFT_BUTTON_GROUP.ICON_WRAPPER;
      ss = ss.replace("__ICON__", CommonUtilities.renderSvgFuncIcon(config.icon));
      return ss + config.name;
    } else {
      return config.name;
    }
  }

  #getDetail(): Fragment | null {
    let c = this._choices[this._selectedIdx ?? -1];
    return c ? (c.fDetail ?? null) : null;
  }

  #renderCellButton(cell: HTMLTableCellElement, idx: number): void {
    let s: string = _CFT_BUTTON_GROUP.F_ONCLICK;
    if (idx == this._selectedIdx) {
      cell.className = "s-cfuncbg s-csecondary";
    }
    s = s.replace("__IDX__", String(idx));
    cell.setAttribute("onclick", s);
  }
}

