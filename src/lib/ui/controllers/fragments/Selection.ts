import { Fragment } from './Fragment.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { Panel } from '../../renders/panels/Panel.js';

export const CF_SELECTION = {
  ONSELECT : "CF_SELECTION_1",
} as const;

// Export to window for string template access
declare global {
  interface Window {
    CF_SELECTION?: typeof CF_SELECTION;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_SELECTION = CF_SELECTION;
}

interface SelectionItem {
  text: string;
  value: string;
}

export class Selection extends Fragment {
  private _hintText: string;

  constructor() {
    super();
    this._hintText = "";
  }

  setHintText(t: string): void { this._hintText = t; }

  action(type: string | symbol, ...args: any[]): void {
    switch (type) {
    case CF_SELECTION.ONSELECT:
      if (this._delegate && typeof (this._delegate as any).onSelectionChangedInSelection === 'function') {
        (this._delegate as any).onSelectionChangedInSelection(this, args[0]);
      }
      break;
    default:
      super.action.apply(this, arguments as any);
    }
  }

  _renderOnRender(render: any): void {
    let e = this.#renderSelectionElement();
    let p: any = render;
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

  _onContentDidAppear(): void {
    super._onContentDidAppear();
    let e = document.getElementById(this.#getElementId());
    if (e && this._dataSource && typeof (this._dataSource as any).getSelectedValueForSelection === 'function') {
      (e as HTMLSelectElement).value = (this._dataSource as any).getSelectedValueForSelection(this);
    }
  }

  #getElementId(): string { return this._id + "_SELECT"; }

  #renderSelectionElement(): HTMLSelectElement {
    let items: SelectionItem[] = [];
    if (this._dataSource && typeof (this._dataSource as any).getItemsForSelection === 'function') {
      items = (this._dataSource as any).getItemsForSelection(this);
    }
    let e = document.createElement("SELECT") as HTMLSelectElement;
    e.id = this.#getElementId();
    e.setAttribute("onchange",
                   "javascript:G.action(window.CF_SELECTION.ONSELECT, this.value)");
    e.setAttribute("onclick", "javascript:G.anchorClick()");
    for (let item of items) {
      let eOption = document.createElement("OPTION") as HTMLOptionElement;
      eOption.text = item.text;
      eOption.value = item.value;
      e.add(eOption);
    }
    return e;
  }
}

