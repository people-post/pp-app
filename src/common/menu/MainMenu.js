import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { MenuContent } from './MenuContent.js';
import { SearchBar } from '../gui/SearchBar.js';
import { Factory, T_CATEGORY, T_OBJ } from '../../lib/framework/Factory.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { Menus } from '../dba/Menus.js';
import { Groups } from '../dba/Groups.js';

const _CPT_MENU_ITEM = {
  V_MAIN : `<div class="flex">
    <div class="w5">
      <div id="__ID_THEME__" class="w5px h100"></div>
    </div>
    <div class="flex-grow flex bd-b-1px bd-b-solid s-cmenubd">
      <div class="w5px"></div>
      <div id="__ID_CONTENT__" class="flex-grow"></div>
      <div class="w5px flex center-align-items">
        <div id="__ID_ARROW__"></div>
      </div>
    </div>
    <div class="w5"></div>
  </div>`,
  H_MAIN : `<div>
  <div class="flex">
    <div id="__ID_CONTENT__"></div>
    <div id="__ID_ARROW__"></div>
  </div>
  <div id="__ID_THEME__" class="v-pad1px"></div>
  </div>`,
  H_BAR : `<span class="menu-hr"></span>`,
};

export class PVMenuItem extends Panel {
  #pTheme;
  #pContent;
  #pArrow;

  constructor() {
    super();
    this.#pTheme = new Panel();
    this.#pContent = new PanelWrapper();
    this.#pArrow = new Panel();
  }

  getThemePanel() { return this.#pTheme; }
  getContentPanel() { return this.#pContent; }
  getArrowPanel() { return this.#pArrow; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pTheme.attach(this._getSubElementId("T"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pArrow.attach(this._getSubElementId("A"));
  }

  _renderFramework() {
    let s = _CPT_MENU_ITEM.V_MAIN;
    s = s.replace("__ID_THEME__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_ARROW__", this._getSubElementId("A"));
    return s;
  }
};

export class PHMenuItem extends Panel {
  #pTheme;
  #pContent;
  #pArrow;

  constructor() {
    super();
    this.#pTheme = new Panel();
    this.#pContent = new PanelWrapper();
    this.#pArrow = new Panel();
  }

  getThemePanel() { return this.#pTheme; }
  getContentPanel() { return this.#pContent; }
  getArrowPanel() { return this.#pArrow; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pTheme.attach(this._getSubElementId("T"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pArrow.attach(this._getSubElementId("A"));
  }

  _renderFramework() {
    let s = _CPT_MENU_ITEM.H_MAIN;
    s = s.replace("__ID_THEME__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_ARROW__", this._getSubElementId("A"));
    return s;
  }
};

export class MainMenu extends MenuContent {
  #fBar;
  #btnAll;
  #fChoices;
  #sectorId = null;
  #currentItem = null;
  #ownerId = null;
  #tResultLayout = null;
  #cMaxWidth = null;
  #extraItems = [];

  constructor() {
    super();
    this.#fBar = new SearchBar();
    this.#fBar.setMenuRenderMode(true);
    this.#fBar.setFatMode(true);
    this.#fBar.setDelegate(this);
    this.setChild("searchbar", this.#fBar);

    this.#btnAll = new Button();
    this.#btnAll.setThemeType(Button.T_THEME.NONE);
    this.#btnAll.setName("[---- ALL ----]");
    this.#btnAll.setValue("ALL");
    this.#btnAll.setDelegate(this);
    this.setChild("all", this.#btnAll);

    this.#fChoices = new FFragmentList();
    this.setChild("choices", this.#fChoices);
  }

  onGuiSearchBarRequestSearch(fSearchBar, value) {
    this._delegate.onMenuFragmentRequestCloseMenu(this);
    let cls = Factory.getClass(
        T_CATEGORY.UI, T_OBJ.SEARCH_RESULT_VIEW_CONTENT_FRAGMENT);
    let f = new cls();
    f.setKey(value);
    f.setResultLayoutType(this.#tResultLayout);
    let v = new View();
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Search result");
  }

  setOwnerId(id) { this.#ownerId = id; }
  setSector(sectorId) { this.#sectorId = sectorId; }
  setExtraItems(items) { this.#extraItems = items; }
  setSearchResultLayoutType(t) { this.#tResultLayout = t; }
  setMaxWidthClass(name) { this.#cMaxWidth = name; }

  onSimpleButtonClicked(fBtn) { this.#onItemSelected(fBtn.getValue()); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case PltT_DATA.GROUPS:
      this.render();
      break;
    case PltT_DATA.MENUS:
      this.#currentItem = null;
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let items = this.#getCurrentItems();
    if (this._isQuickLinkRenderMode) {
      this.#renderAsQuickLink(render, items);
    } else {
      this.#renderAsDropdownList(render, items);
    }
  }

  #renderAsDropdownList(render, items) {
    let panel = new ListPanel();
    render.wrapPanel(panel);

    let p = new PanelWrapper();
    panel.pushPanel(p);
    this.#fBar.attachRender(p);
    this.#fBar.render();

    p = new Panel();
    panel.pushPanel(p);
    p.setClassName("menu-hr-wrapper");
    p.replaceContent(_CPT_MENU_ITEM.H_BAR)

    if (this.#currentItem) {
      p = new PVMenuItem();
      panel.pushPanel(p);
      this.#btnAll.attachRender(p.getContentPanel());
      this.#btnAll.render();
    }

    p = new ListPanel();
    panel.pushPanel(p);

    this.#fChoices.clear();
    this.#fChoices.attachRender(p); // Allow events

    for (let item of items) {
      let pp = new PVMenuItem();
      p.pushPanel(pp);
      this.#renderChoice(pp, item);
    }
  }

  #renderChoice(panel, item, tLayout = null) {
    let t = item.getTheme();
    if (t) {
      panel.getThemePanel().setStyle("backgroundColor", t.getPrimaryColor());
    }

    let f = new Button();
    f.setName(this.#getItemName(item));
    f.setValue(item.getId());
    if (tLayout) {
      f.setLayoutType(tLayout);
    }
    f.setThemeType(Button.T_THEME.NONE);
    f.setDelegate(this);
    f.attachRender(panel.getContentPanel());
    f.render();

    if (!item.isEmpty()) {
      panel.getArrowPanel().replaceContent(">");
    }
    this.#fChoices.append(f);
  }

  #renderAsQuickLink(render, items) {
    let pWrapper = new PanelWrapper();
    pWrapper.setClassName("flex flex-center");
    render.wrapPanel(pWrapper);

    let panel = new ListPanel();
    let names = [ "w100", "flex", "x-scroll", "no-scrollbar" ];
    if (this.#cMaxWidth) {
      names.push(this.#cMaxWidth);
    }
    panel.setClassName(names.join(" "));
    pWrapper.wrapPanel(panel);

    if (this.#currentItem && this.#currentItem.getDepth() > 0) {
      let p = new PHMenuItem();
      p.setClassName("flex-grow");
      panel.pushPanel(p);
      this.#btnAll.attachRender(p.getContentPanel());
      this.#btnAll.render();
    }

    this.#fChoices.clear();
    this.#fChoices.attachRender(panel); // Allow events
    for (let item of items) {
      let p = new PHMenuItem();
      p.setClassName("flex-grow flex flex-center");
      panel.pushPanel(p);
      this.#renderChoice(p, item, Button.LAYOUT_TYPE.BARE);
    }
  }

  #onItemSelected(itemId) {
    if (itemId == "ALL") {
      let item = this.#currentItem;
      this.#currentItem = null;
      this._delegate.onItemSelectedInGuiMainMenu(this, item);
    } else {
      let item = this.#getItem(itemId);
      if (item) {
        if (item.isEmpty()) {
          this.#currentItem = null;
          this._delegate.onItemSelectedInGuiMainMenu(this, item);
        } else {
          this.#currentItem = item;
        }
      }
    }
    this.render();
  }

  #getItem(itemId) {
    for (let i of this.#getCurrentItems()) {
      if (i.getId() == itemId) {
        return i;
      }
    }
    return null;
  }

  #getCurrentItems() {
    if (this.#currentItem) {
      return this.#currentItem.getSubItems();
    }
    return this.#getMenus();
  }

  #getMenus() {
    let items = Menus.get(this.#sectorId, this.#ownerId);
    if (items.length == 1) {
      // Auto expand to next level
      items = items[0].getSubItems();
    }
    return items.concat(this.#extraItems);
  }

  #getItemName(item) {
    let name = item.getName();
    if (!name) {
      // TODO: Should use tag
      let tag = Groups.getTag(item.getTagId());
      if (tag) {
        name = tag.getName();
      }
    }
    return name;
  }
};
