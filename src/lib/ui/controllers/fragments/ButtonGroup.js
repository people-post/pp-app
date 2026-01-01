import { Fragment } from './Fragment.js';
import { Utilities as CommonUtilities } from '../../../../common/Utilities.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { Panel } from '../../renders/panels/Panel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';

export const CF_BUTTON_GROUP = {
  ON_CLICK : Symbol(),
};

// Export to window for string template access
if (typeof window !== 'undefined') {
  window.CF_BUTTON_GROUP = CF_BUTTON_GROUP;
}

const _CFT_BUTTON_GROUP = {
  F_ONCLICK : `javascript:G.action(window.CF_BUTTON_GROUP.ON_CLICK, __IDX__)`,
  ICON_WRAPPER :
      `<span class="inline-block s-icon5 v-middle-align">__ICON__</span>`,
};

export class ButtonGroup extends Fragment {
  constructor() {
    super();
    this._choices = [];
    this._selectedIdx = null;
  }

  getSelectedValue() {
    let c = this._choices[this._selectedIdx];
    return c ? c.value : null;
  }
  addChoice(choiceInfo) {
    // {name: "", value: "", icon: "", fDetail: ""}
    this._choices.push(choiceInfo);
  }

  setSelectedValue(value) {
    this._selectedIdx = this._choices.findIndex(x => x.value == value);
  }
  updateChoice(value, info) {
    let idx = this._choices.findIndex(x => x.value == value);
    if (idx < 0) {
      return;
    }
    this._choices[idx] = info;
    this.render();
  }

  clearChoices() {
    this._choices = [];
    this._selectedIdx = null;
  }

  action(type, ...args) {
    switch (type) {
    case CF_BUTTON_GROUP.ON_CLICK:
      this.#onClick(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  #onClick(idx) {
    if (this._selectedIdx == idx) {
      return;
    }
    this._selectedIdx = idx;
    this._delegate.onButtonGroupSelectionChanged(this, this.getSelectedValue());
    this.render();
  }

  _renderOnRender(render) {
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

  #renderButtons() {
    let table = document.createElement("TABLE");
    table.className = "group-button";
    let row = table.insertRow(-1);
    for (let [i, c] of this._choices.entries()) {
      let cell = row.insertCell(-1);
      cell.innerHTML = this.#renderButtonName(c);
      this.#renderCellButton(cell, i);
    }
    return table.outerHTML;
  }

  #renderButtonName(config) {
    if (config.icon) {
      let ss = _CFT_BUTTON_GROUP.ICON_WRAPPER;
      ss = ss.replace("__ICON__", CommonUtilities.renderSvgFuncIcon(config.icon));
      return ss + config.name;
    } else {
      return config.name;
    }
  }

  #getDetail() {
    let c = this._choices[this._selectedIdx];
    return c ? c.fDetail : null;
  }

  #renderCellButton(cell, idx) {
    let s = _CFT_BUTTON_GROUP.F_ONCLICK;
    if (idx == this._selectedIdx) {
      cell.className = "s-cfuncbg s-csecondary";
    }
    s = s.replace("__IDX__", idx);
    cell.setAttribute("onclick", s);
  }
};
