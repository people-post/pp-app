import { FFragmentList } from './FFragmentList.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';

interface GridConfig {
  nCols: number;
}

export class FSimpleFragmentList extends FFragmentList {
  #mode: string | null = null;
  #config: GridConfig | null = null;

  constructor() {
    super();
  }

  setHorizontalMode(b: boolean): void { this.#mode = b ? "H" : null; }
  setGridMode(b: boolean, nCols: number = 0): void {
    this.#mode = b ? "G" : null;
    if (b) {
      this.#config = {"nCols" : nCols};
    }
  }

  _renderOnRender(render: any): void {
    let pList: ListPanel;
    if (render instanceof ListPanel) {
      pList = render;
      pList.clear();
    } else {
      pList = new ListPanel();
      this.#initPanel(pList);
      render.wrapPanel(pList);
    }
    for (let f of this.getChildren()) {
      let p = this.#createItemPanel();
      pList.pushPanel(p);
      f.attachRender(p);
      f.render();
    }
  }

  #initPanel(panel: ListPanel): void {
    switch (this.#mode) {
    case "H":
      panel.setClassName("flex flex-start center-align-items x-scroll no-wrap");
      break;
    default:
      break;
    }
  }

  #createItemPanel(): PanelWrapper {
    let p = new PanelWrapper();
    switch (this.#mode) {
    case "G":
      if (this.#config) {
        this.#initGridItemPanel(p, this.#config);
      }
      break;
    case "H":
      this.#initHorizontalItemPanel(p);
      break;
    default:
      break;
    }
    return p;
  }

  #initHorizontalItemPanel(_panel: PanelWrapper): void {}
  #initGridItemPanel(panel: PanelWrapper, config: GridConfig): void {
    panel.setClassName("inline-block");
    if (config.nCols > 0) {
      // Grid layout
      let w = Math.floor(1000 / config.nCols) / 10.0;
      panel.setAttribute("style", "width: " + w + "%;");
    } else {
      // Flex layout
    }
  }
}

