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
import { Events, T_DATA as FwkT_DATA, T_ACTION } from '../../lib/framework/Events.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';
import { Api } from '../../common/plt/Api.js';
import { R } from '../../common/constants/R.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export class FvcBasicWebConfig extends FScrollViewContent {
  action(type: string, ...args: unknown[]): void {
    switch (type) {
    case CF_BASIC_WEB_CONFIG.ON_DEFAULT_COLOR_CHANGE:
      this.#onDefaultThemeColorChange(args[0] as string, args[1] as HTMLInputElement);
      break;
    case CF_BASIC_WEB_CONFIG.ON_ICON_CHANGE:
      this.#onUpdateIcon(args[0] as File);
      break;
    case CF_BASIC_WEB_CONFIG.ON_TITLE_SET:
      this.#asyncUpdateHomePageTitle(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
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
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: Render): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new SectionPanel("Home page title");
    p.pushPanel(pp);
    let cp = pp.getContentPanel();
    if (cp) {
      cp.replaceContent(_CFT_BASIC_WEB_CONFIG.HOME_PAGE_TITLE.replace(
          "__VALUE__", WebConfig.getHomePageTitle()));
    }

    pp = new SectionPanel("Default theme");
    p.pushPanel(pp);
    cp = pp.getContentPanel();
    if (cp) {
      cp.replaceContent(this.#renderDefaultThemeConfig());
    }
  }

  #onUpdateIcon(file: File): void { this.#asyncUpdateIcon(file); }

  #renderDefaultThemeConfig(): string {
    let config = WebConfig.getDefaultTheme();
    let owner = WebConfig.getOwner();
    let iconUrl = owner ? owner.getIconUrl() : "";
    let cPrimary = config.getPrimaryColor();
    let cSecondary = config.getSecondaryColor();
    let eTest = document.getElementById("ID_COLOR_TEST");
    if (!eTest) {
      return "";
    }
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

  #renderIconCell(cell: HTMLTableCellElement, iconUrl: string): void {
    let tIcon = _CFT_BASIC_WEB_CONFIG.PROFILE_ICON;
    cell.innerHTML = tIcon.replace("__SRC__", iconUrl);
  }

  #renderDefaultThemeColorCell(cell: HTMLTableCellElement, color: string, bgColor: string, key: string): void {
    let s = _CFT_BASIC_WEB_CONFIG.THEME_COLOR.replace(/__VALUE__/g, bgColor);
    s = s.replace("__COLOR__", color);
    s = s.replace("__KEY__", key);
    cell.innerHTML = s;
    cell.style.backgroundColor = bgColor;
  }

  #onDefaultThemeColorChange(key: string, inputElement: HTMLInputElement): void {
    let c = inputElement.value;
    if (c == "") {
      let bakValue = inputElement.getAttribute("value-bak");
      if (bakValue) {
        inputElement.value = bakValue;
      }
      return;
    }

      if (UtilitiesExt.isValidColor(c)) {
      let config = WebConfig.getDefaultTheme();
      let other = (key == "primary") ? config.getSecondaryColor()
                                     : config.getPrimaryColor();
      this.#asyncUpdateDefaultTheme(key, c);
    } else {
      this._owner.onLocalErrorInFragment(this, R.get("EL_INVALID_COLOR"));
    }
  }

  #asyncUpdateIcon(file: File): void {
    let url = "/api/user/update_favicon";
    let fd = new FormData();
    fd.append('favicon', file)
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onMajorUpdateRRR(d));
  }

  #onMajorUpdateRRR(data: unknown): void {
    Events.triggerTopAction(T_ACTION.RELOAD_URL, this);
  }

  #asyncUpdateHomePageTitle(title: string): void {
    let fd = new FormData();
    fd.append("home_page_title", title);
    let url = "/api/user/update_web_config";
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onMajorUpdateRRR(d));
  }

  #asyncUpdateDefaultTheme(key: string, color: string): void {
    let fd = new FormData();
    fd.append("key", key);
    fd.append("color", color);
    this.#asyncUpdateConfig(fd);
  }

  #asyncUpdateConfig(fd: FormData): void {
    let url = "/api/user/update_web_config";
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onWebConfigDataReceived(d));
  }

  #onWebConfigDataReceived(data: unknown): void { 
    let webConfig = (data as { web_config?: unknown }).web_config;
    if (webConfig) {
      WebConfig.reset(webConfig);
    }
  }
};
