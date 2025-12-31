import { Fragment } from './Fragment.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { Panel } from '../../renders/panels/Panel.js';

export const CF_SELECTION = {
  ONSELECT : "CF_SELECTION_1",
}

export class Selection extends Fragment {
  constructor() {
    super();
    this._hintText = "";
  }

  setHintText(t) { this._hintText = t; }

  action(type, ...args) {
    switch (type) {
    case CF_SELECTION.ONSELECT:
      this._delegate.onSelectionChangedInSelection(this, args[0]);
      break;
    default:
      super.action.apply(this, arguments);
    }
  }

  _renderOnRender(render) {
    let e = this.#renderSelectionElement();
    let p = render;
    if (this._hintText && this._hintText.length) {
      let panel = new ListPanel();
      panel.setClassName("flex flex-start");
      render.wrapPanel(panel);
      p = new Panel();
      p.replaceContent(this._hintText);
      panel.pushPanel(p);
      p = new Panel();
      panel.pushPanel(p);
    }
    p.replaceContent(e.outerHTML);
  }

  _onContentDidAppear() {
    super._onContentDidAppear();
    let e = document.getElementById(this.#getElementId());
    if (e) {
      e.value = this._dataSource.getSelectedValueForSelection(this);
    }
  }

  #getElementId() { return this._id + "_SELECT"; }

  #renderSelectionElement() {
    let items = this._dataSource.getItemsForSelection(this);
    let e = document.createElement("SELECT");
    e.id = this.#getElementId();
    e.setAttribute("onchange",
                   "javascript:G.action(window.CF_SELECTION.ONSELECT, this.value)");
    e.setAttribute("onclick", "javascript:G.anchorClick()");
    let eOption;
    for (let item of items) {
      eOption = document.createElement("OPTION");
      eOption.text = item.text;
      eOption.value = item.value;
      e.add(eOption);
    }
    return e;
  }
}

