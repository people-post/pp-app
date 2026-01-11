import { FHeaderMenu } from '../lib/ui/controllers/fragments/FHeaderMenu.js';
import { T_DATA } from '../common/plt/Events.js';
import { WebConfig } from '../common/dba/WebConfig.js';
import { Utilities } from '../common/Utilities.js';
import Render from '../lib/ui/renders/Render.js';
import { Account } from '../common/dba/Account.js';

const _CFT_HOME_BTN = {
  ICON : `<div class="pad5px">
    <a href="__URL__">
      <span class="inline-block s-icon32">__ICON__</span>
    </a>
  </div>`,
  ICON_URL : `<div class="pad5px">
    <a href="__URL__">
      <img class="hmax40px" src="__ICON_URL__"/>
    </a>
  </div>`,
};

export class FHomeBtn extends FHeaderMenu {
  #url: string | null = null;
  #icon: string | null = null;

  setIcon(icon: string | null): void {
    this.#icon = icon;
  }

  setUrl(url: string | null): void {
    this.#url = url;
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILE:
      if (data == WebConfig.getOwnerId() || data == (Account.getId() || null)) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Render): void {
    if (this.#icon) {
      this.#renderIcon(render);
    } else {
      this.#renderIconUrl(render);
    }
  }

  #renderIcon(panel: Render): void {
    let s = _CFT_HOME_BTN.ICON;
    s = s.replace("__URL__", this.#url || "");
    s = s.replace("__ICON__", Utilities.renderSvgMenuIcon(this.#icon!));
    panel.replaceContent(s);
  }

  #renderIconUrl(panel: Render): void {
    let s = _CFT_HOME_BTN.ICON_URL;
    s = s.replace("__URL__", this.#url || "");
    let owner = WebConfig.getOwner();
    let iconUrl = owner ? (owner.getLogoUrl() || "") : "";
    s = s.replace("__ICON_URL__", iconUrl);
    panel.replaceContent(s);
  }
}
