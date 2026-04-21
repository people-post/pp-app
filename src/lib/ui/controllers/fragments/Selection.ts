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

export interface FSelectionDataSource {
  getItemsForSelection(f: Selection): Array<{text: string; value: string}>;
  getSelectedValueForSelection(f: Selection): string;
}

export interface FSelectionDelegate {
  onSelectionChangedInSelection(f: Selection, value: string): void;
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
      this.getDelegate<FSelectionDelegate>()?.onSelectionChangedInSelection(this, args[0]);
      break;
    default:
      super.action(type, ...args);
    }
  }

  _renderOnRender(render: any): void {
    let e = this.#renderSelectionElement();
    let p: any = render;
    if (this._hintText && this._hintText.length) {
      let panel = new ListPanel();
      panel.setClassName("tw:flex tw:justify-start");
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
    let dataSource = this.getDataSource<FSelectionDataSource>();
    let e = document.getElementById(this.#getElementId());
    if (e && dataSource) {
      (e as HTMLSelectElement).value = dataSource.getSelectedValueForSelection(this);
    }
  }

  #getElementId(): string { return this._getFragmentId() + "_SELECT"; }

  #renderSelectionElement(): HTMLSelectElement {
    let items: SelectionItem[] = [];
    let dataSource = this.getDataSource<FSelectionDataSource>();
    if (dataSource) {
      items = dataSource.getItemsForSelection(this);
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

