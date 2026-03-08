import { Fragment } from './Fragment.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { Panel } from '../../renders/panels/Panel.js';
import { ICONS } from '../../Icons.js';
import { Utilities as CommonUtilities } from '../../../../common/Utilities.js';

const _CFT_PULL_TO_REFRESH = {
  ICON :
      `<span class="tw-inline-block s-icon6" style="transform:rotate(__DEG__deg);">__ICON__</span>`,
} as const;

export class FPullToRefresh extends Fragment {
  #pIcon: PanelWrapper;
  #progress: number = 0;

  constructor() {
    super();
    this.#pIcon = new PanelWrapper();
    this.#pIcon.setClassName("tw-flex tw-justify-around");
  }

  getHeight(): number {
    let r = this.getRender();
    return r ? r.getHeight() : 0;
  }

  setProgress(percent: number): void {
    this.#progress = Math.min(percent, 100);
    this.render();
  }

  _renderOnRender(render: any): void {
    let p = new ListPanel();
    p.setClassName("tw-bg-gray-300");
    render.wrapPanel(p);
    p.pushSpace(10);
    p.pushPanel(this.#pIcon);
    let pWrapper = new Panel();
    pWrapper.setClassName("tw-relative");

    this.#pIcon.wrapPanel(pWrapper);

    let s: string = _CFT_PULL_TO_REFRESH.ICON;
    if (this.#progress > 95) {
      s = s.replace("__ICON__",
                    CommonUtilities.renderSvgFuncIcon(ICONS.SOLID_DOWN));
      s = s.replace("__DEG__", "0");
    } else {
      s = s.replace("__ICON__", CommonUtilities.renderSvgFuncIcon(ICONS.DOWN));
      if (this.#progress > 25 && this.#progress < 90) {
        s = s.replace("__DEG__", String((this.#progress - 25) / 65 * 360));
      } else {
        s = s.replace("__DEG__", "0");
      }
    }

    pWrapper.replaceContent(s);
  }
}

