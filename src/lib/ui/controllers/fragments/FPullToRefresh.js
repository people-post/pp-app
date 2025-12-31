import { Fragment } from './Fragment.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { Panel } from '../../renders/panels/Panel.js';
import { ICONS } from '../../Icons.js';
import { Utilities as CommonUtilities } from '../../../../common/Utilities.js';

const _CFT_PULL_TO_REFRESH = {
  ICON :
      `<span class="inline-block s-icon6" style="transform:rotate(__DEG__deg);">__ICON__</span>`,
};

export class FPullToRefresh extends Fragment {
  #pIcon;
  #progress = 0;

  constructor() {
    super();
    this.#pIcon = new PanelWrapper();
    this.#pIcon.setClassName("flex space-around");
  }

  getHeight() {
    let r = this.getRender();
    return r ? r.getHeight() : 0;
  }

  setProgress(percent) {
    this.#progress = Math.min(percent, 100);
    this.render();
  }

  _renderOnRender(render) {
    let p = new ListPanel();
    p.setClassName("bglightgrey");
    render.wrapPanel(p);
    p.pushSpace(10);
    p.pushPanel(this.#pIcon);
    p = new Panel();
    p.setClassName("relative");

    this.#pIcon.wrapPanel(p);

    let s = _CFT_PULL_TO_REFRESH.ICON;
    if (this.#progress > 95) {
      s = s.replace("__ICON__",
                    CommonUtilities.renderSvgFuncIcon(ICONS.SOLID_DOWN));
      s = s.replace("__DEG__", "0");
    } else {
      s = s.replace("__ICON__", CommonUtilities.renderSvgFuncIcon(ICONS.DOWN));
      if (this.#progress > 25 && this.#progress < 90) {
        s = s.replace("__DEG__", (this.#progress - 25) / 65 * 360);
      } else {
        s = s.replace("__DEG__", "0");
      }
    }

    p.replaceContent(s);
  }
};

