
window.CF_BASIC_WEB_CONFIG = {
  ON_DEFAULT_COLOR_CHANGE : "CF_BASIC_WEB_CONFIG_1",
  ON_ICON_CHANGE : "CF_BASIC_WEB_CONFIG_2",
  ON_TITLE_SET : "CF_BASIC_WEB_CONFIG_3",
}

const _CFT_BASIC_WEB_CONFIG = {
  HOME_PAGE_TITLE :
      `<input type="text" class="tight-label-like border-box s-cfunc" placeholder="Your homepage title" value="__VALUE__" onchange="javascript:G.action(CF_BASIC_WEB_CONFIG.ON_TITLE_SET, this.value)">`,
  PROFILE_ICON : `
    <div class="profile-icon inline-block s-icon1 s-cprimebg">
       <img class="photo" src="__SRC__" alt="Icon" onclick="javascript:this.nextElementSibling.click()">
       <input type="file" accept="image/*" style="display:none" onchange="javascript:G.action(CF_BASIC_WEB_CONFIG.ON_ICON_CHANGE, this.files[0])">
    </div>`,
  THEME_COLOR :
      `<input type="text" class="tight-label-like" placeholder="Color" value-bak="__VALUE__" value="__VALUE__" style="color: __COLOR__" onchange="javascript:G.action(CF_BASIC_WEB_CONFIG.ON_DEFAULT_COLOR_CHANGE, '__KEY__', this)">`,
}

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { T_DATA } from '../../common/plt/Events.js';
import { api } from '../../common/plt/Api.js';
import { Events, T_DATA as FwkT_DATA, T_ACTION } from '../../lib/framework/Events.js';

export class FvcBasicWebConfig extends FScrollViewContent {
  action(type, ...args) {
    switch (type) {
    case CF_BASIC_WEB_CONFIG.ON_DEFAULT_COLOR_CHANGE:
      this.#onDefaultThemeColorChange(args[0], args[1]);
      break;
    case CF_BASIC_WEB_CONFIG.ON_ICON_CHANGE:
      this.#onUpdateIcon(args[0]);
      break;
    case CF_BASIC_WEB_CONFIG.ON_TITLE_SET:
      this.#asyncUpdateHomePageTitle(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case FwkT_DATA.WEB_CONFIG:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      this.render();
      break;
    case T_DATA.USER_PROFILE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new SectionPanel("Home page title");
    p.pushPanel(pp);
    let cp = pp.getContentPanel();
    cp.replaceContent(_CFT_BASIC_WEB_CONFIG.HOME_PAGE_TITLE.replace(
        "__VALUE__", dba.WebConfig.getHomePageTitle()));

    pp = new SectionPanel("Default theme");
    p.pushPanel(pp);
    cp = pp.getContentPanel();
    cp.replaceContent(this.#renderDefaultThemeConfig());
  }

  #onUpdateIcon(file) { this.#asyncUpdateIcon(file); }

  #renderDefaultThemeConfig() {
    let config = dba.WebConfig.getDefaultTheme();
    let owner = dba.WebConfig.getOwner();
    let iconUrl = owner ? owner.getIconUrl() : "";
    let cPrimary = config.getPrimaryColor();
    let cSecondary = config.getSecondaryColor();
    let eTest = document.getElementById("ID_COLOR_TEST");
    eTest.className = "inline-block";
    let cMenu = config.getMenuColor(eTest);
    let cFunc = config.getFuncColor(eTest);
    eTest.className = "no-display";

    let table = document.createElement("TABLE");
    table.className = "center-align";

    let row = table.insertRow(-1);
    let cell = row.insertCell(-1);
    cell.innerHTML = "Icon:";
    cell = row.insertCell(-1);
    this.#renderIconCell(cell, iconUrl);

    row = table.insertRow(-1);
    cell = row.insertCell(-1);
    cell.innerHTML = "Header:";
    cell = row.insertCell(-1);
    this.#renderDefaultThemeColorCell(cell, cMenu, cPrimary, "primary");

    row = table.insertRow(-1);
    cell = row.insertCell(-1);
    cell.innerHTML = "Content:";
    cell = row.insertCell(-1);
    this.#renderDefaultThemeColorCell(cell, cFunc, cSecondary, "secondary");

    return table.outerHTML;
  }

  #renderIconCell(cell, iconUrl) {
    let tIcon = _CFT_BASIC_WEB_CONFIG.PROFILE_ICON;
    cell.innerHTML = tIcon.replace("__SRC__", iconUrl);
  }

  #renderDefaultThemeColorCell(cell, color, bgColor, key) {
    let s = _CFT_BASIC_WEB_CONFIG.THEME_COLOR.replace(/__VALUE__/g, bgColor);
    s = s.replace("__COLOR__", color);
    s = s.replace("__KEY__", key);
    cell.innerHTML = s;
    cell.style.backgroundColor = bgColor;
  }

  #onDefaultThemeColorChange(key, inputElement) {
    let c = inputElement.value;
    if (c == "") {
      inputElement.value = inputElement.getAttribute("value-bak");
      return;
    }

    if (ext.Utilities.isValidColor(c)) {
      let config = dba.WebConfig.getDefaultTheme();
      let other = (key == "primary") ? config.getSecondaryColor()
                                     : config.getPrimaryColor();
      this.#asyncUpdateDefaultTheme(key, c);
    } else {
      this._owner.onLocalErrorInFragment(this, R.get("EL_INVALID_COLOR"));
    }
  }

  #asyncUpdateIcon(file) {
    let url = "/api/user/update_favicon";
    let fd = new FormData();
    fd.append('favicon', file)
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onMajorUpdateRRR(d));
  }

  #onMajorUpdateRRR(data) {
    Events.triggerTopAction(T_ACTION.RELOAD_URL, this);
  }

  #asyncUpdateHomePageTitle(title) {
    let fd = new FormData();
    fd.append("home_page_title", title);
    let url = "/api/user/update_web_config";
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onMajorUpdateRRR(d));
  }

  #asyncUpdateDefaultTheme(key, color) {
    let fd = new FormData();
    fd.append("key", key);
    fd.append("color", color);
    this.#asyncUpdateConfig(fd);
  }

  #asyncUpdateConfig(fd) {
    let url = "/api/user/update_web_config";
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onWebConfigDataReceived(d));
  }

  #onWebConfigDataReceived(data) { dba.WebConfig.reset(data.web_config); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hstn = window.hstn || {};
  window.hstn.FvcBasicWebConfig = FvcBasicWebConfig;
}
