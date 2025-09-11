(function(ui) {
const _CFT_PULL_TO_REFRESH = {
  ICON :
      `<span class="inline-block s-icon6" style="transform:rotate(__DEG__deg);">__ICON__</span>`,
};

class FPullToRefresh extends ui.Fragment {
  #pIcon;
  #progress = 0;

  constructor() {
    super();
    this.#pIcon = new ui.PanelWrapper();
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
    let p = new ui.ListPanel();
    p.setClassName("bglightgrey");
    render.wrapPanel(p);
    p.pushSpace(10);
    p.pushPanel(this.#pIcon);
    p = new ui.Panel();
    p.setClassName("relative");

    this.#pIcon.wrapPanel(p);

    let s = _CFT_PULL_TO_REFRESH.ICON;
    if (this.#progress > 95) {
      s = s.replace("__ICON__",
                    Utilities.renderSvgFuncIcon(ui.ICONS.SOLID_DOWN));
      s = s.replace("__DEG__", "0");
    } else {
      s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(ui.ICONS.DOWN));
      if (this.#progress > 25 && this.#progress < 90) {
        s = s.replace("__DEG__", (this.#progress - 25) / 65 * 360);
      } else {
        s = s.replace("__DEG__", "0");
      }
    }

    p.replaceContent(s);
  }
};

ui.FPullToRefresh = FPullToRefresh;
}(window.ui = window.ui || {}));
