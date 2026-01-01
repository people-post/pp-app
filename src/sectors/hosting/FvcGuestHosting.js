
window.CF_GUEST_HOSTING_CONTENT = {
  REGISTER : "CF_GUEST_HOSTING_CONTENT_1",
  SHOW_TIP : "CF_GUEST_HOSTING_CONTENT_2",
}

const _CFT_GUEST_HOSTING_CONTENT = {
  MAIN_PANEL : `<div class="center-align">
      <span class="steps-stage-module">__R_REGISTER__ <a class="internal-page-link" href="javascript:void(0)" onclick="javascript:G.action(CF_GUEST_HOSTING_CONTENT.REGISTER)">G-Cabin</a>.</span>
    </div>
    <div class="center-align">
      <span class="inline-block s-icon3 clickable">__DOWN_ICON__</span>
    </div>
    <div class="center-align">
      <span class="steps-stage-module">__R_PARK__</span>
    </div>`,
}

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { ICONS } from '../../lib/ui/Icons.js';
import { T_ACTION } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';

export class FvcGuestHosting extends FScrollViewContent {
  action(type, ...args) {
    switch (type) {
    case CF_GUEST_HOSTING_CONTENT.REGISTER:
      Events.triggerTopAction(T_ACTION.LOGIN);
      break;
    case CF_GUEST_HOSTING_CONTENT.SHOW_TIP:
      this._displayMessage(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(R.get("HOSTING_MSG_TITLE"));

    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderMain());

    pp = new Panel();
    pp.setClassName("s-font7");
    p.pushPanel(pp);
    pp.replaceContent(this.#renderFootNote());
  }

  #renderMain() {
    let s = _CFT_GUEST_HOSTING_CONTENT.MAIN_PANEL;
    s = s.replace("__R_REGISTER__", R.t("Login"));
    s = s.replace("__R_PARK__", R.get("PARK_DOMAIN"));
    s = s.replace("__DOMAIN__",
                  this._renderTipLink("CF_GUEST_HOSTING_CONTENT.SHOW_TIP",
                                      R.t("domain"), "TIP_DOMAIN"));
    s = s.replace("__DOWN_ICON__", Utilities.renderSvgFuncIcon(ICONS.DOWN));
    return s;
  }

  #renderFootNote() {
    let s = "*__MSG__ __REGISTRAR__";
    s = s.replace("__MSG__", R.get("HOSTING_MSG_FOOTNOTE"));
    s = s.replace("__REGISTRAR__",
                  this._renderTipLink("CF_GUEST_HOSTING_CONTENT.SHOW_TIP",
                                      R.t("registrars"), "TIP_DOMAIN"));
    return s;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hstn = window.hstn || {};
  window.hstn.FvcGuestHosting = FvcGuestHosting;
}
