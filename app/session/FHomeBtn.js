(function(main) {
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

class FHomeBtn extends ui.FHeaderMenu {
  #url = null;
  #icon = null;

  setIcon(icon) { this.#icon = icon; }
  setUrl(url) { this.#url = url; }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PUBLIC_PROFILE:
      if (data == dba.WebConfig.getOwnerId() || data == dba.Account.getId()) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    if (this.#icon) {
      this.#renderIcon(render);
    } else {
      this.#renderIconUrl(render);
    }
  }

  #renderIcon(panel) {
    let s = _CFT_HOME_BTN.ICON;
    s = s.replace("__URL__", this.#url);
    s = s.replace("__ICON__", Utilities.renderSvgMenuIcon(this.#icon));
    panel.replaceContent(s);
  }

  #renderIconUrl(panel) {
    let s = _CFT_HOME_BTN.ICON_URL;
    s = s.replace("__URL__", this.#url);
    let owner = dba.WebConfig.getOwner();
    let iconUrl = owner ? owner.getLogoUrl() : "";
    s = s.replace("__ICON_URL__", iconUrl);
    panel.replaceContent(s);
  }
};

main.FHomeBtn = FHomeBtn;
}(window.main = window.main || {}));
