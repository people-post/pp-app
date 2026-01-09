import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { TimelineVerticalPanel } from './TimelineVerticalPanel.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type { Fragment as FragmentType } from '../../lib/ui/controllers/fragments/Fragment.js';

export class TimelineFragment extends Fragment {
  protected _fItems: FFragmentList;
  protected _mode: string;
  protected _stopFlowIdx: number;

  constructor() {
    super();
    this._fItems = new FFragmentList();
    this.setChild("items", this._fItems);

    this._mode = "VERTICAL";
    this._stopFlowIdx = 0;
  }

  setMode(m: string): void { this._mode = m; }
  markStop(): void { this._stopFlowIdx = this._fItems.size(); }
  append(f: FragmentType): void { this._fItems.append(f); }
  clear(): void { this._fItems.clear(); }

  _renderOnRender(render: Panel): void {
    // Hack to make fItems as event source, may need better design
    this._fItems.attachRender(render);

    let panel = this.#createPanel();
    render.wrapPanel(panel);

    let fs = this._fItems.getChildren();
    let n = fs.length;
    for (let i = 0; i < n - 1; ++i) {
      let p = new PanelWrapper();
      if (i + 1 == this._stopFlowIdx) {
        panel.pushStopPanel(p);
      } else {
        panel.pushPanel(p);
      }
      fs[i].attachRender(p);
      fs[i].render();
    }
    if (n > 0) {
      let p = new PanelWrapper();
      panel.pushEndPanel(p);
      fs[n - 1].attachRender(p);
      fs[n - 1].render();
    }
  }

  #createPanel(): TimelineVerticalPanel {
    let p: TimelineVerticalPanel;
    switch (this._mode) {
    default:
      p = new TimelineVerticalPanel();
      break;
    }
    return p;
  }
}
