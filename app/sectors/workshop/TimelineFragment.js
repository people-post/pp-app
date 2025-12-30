import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class TimelineFragment extends Fragment {
  constructor() {
    super();
    this._fItems = new FFragmentList();
    this.setChild("items", this._fItems);

    this._mode = "VERTICAL";
    this._stopFlowIdx = 0;
  }

  setMode(m) { this._mode = m; }
  markStop() { this._stopFlowIdx = this._fItems.size(); }
  append(f) { this._fItems.append(f); }
  clear() { this._fItems.clear(); }

  _renderOnRender(render) {
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

  #createPanel() {
    let p;
    switch (this._mode) {
    default:
      p = new wksp.TimelineVerticalPanel();
      break;
    }
    return p;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.TimelineFragment = TimelineFragment;
}
