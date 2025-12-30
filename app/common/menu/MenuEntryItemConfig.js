export const CF_MENU_ENTRY_ITEM_CONFIG = {
  CHANGE_DIR : "CF_GUI_MENU_ENTRY_ITEM_CONFIG_2",
}

const _CFT_MENU_ENTRY_ITEM_CONFIG = {
  NAME : `<span class="menu-item-config-name">Name:</span>
  <span>__NAME__</span>`,
  PATH_ITEM :
      `<span class="clickable cblue underline" onclick="javascript:G.action(gui.CF_MENU_ENTRY_ITEM_CONFIG.CHANGE_DIR, '__ID__')">__NAME__</span>`,
  PATH : `Current path: <span class="cblue">__ITEMS__</span>`,
}

export class MenuEntryItemConfig extends gui.DirFragment {
  constructor(itemId) {
    super();
    this._fThemeEditor = new gui.ThemeEditorFragment();
    this._fThemeEditor.setDelegate(this);
    this.setChild("themeEditor", this._fThemeEditor);

    let f = new gui.FSmartInput();
    f.setHintText("+New tag name");
    f.setDelegate(this);
    this.setNewItemFragment(f);
    this.setNMaxItems(C.MAX.N_MENU_ITEMS);

    this._itemId = itemId;
    this._subItemId = null;
  }

  onItemClickedInGuiMenuItemName(fName, itemId) {
    this._subItemId = itemId;
    this.render();
  }
  onGuiMenuItemNameRequestDeleteItem(fName, itemId) {
    this._delegate.onEntryItemRequestDelete(this, itemId);
  }
  onGuiThemeEditorFragmentRequestChangeColor(fThemeEditor, key, color) {
    this._delegate.onGuiMenuEntryItemConfigRequestChangeTheme(
        this, this._itemId, key, color);
  }

  onItemChosenInSmartInputFragment(fSmartInput, tagId) {
    if (this._subItemId) {
      this._delegate.onMenuItemRequestAddSubItem(this, this._subItemId, tagId);
    } else {
      this._delegate.onMenuItemRequestAddSubItem(this, this._itemId, tagId);
    }
  }

  getFilteredItemsForSmartInputFragment(fSmartInput, filterStr) {
    let s = filterStr.toLowerCase();
    let items = [];
    for (let t of dba.WebConfig.getTags()) {
      if (t.getName().toLowerCase().indexOf(s) > -1) {
        items.push({id : t.getId(), name : t.getName()});
      }
    }
    return items;
  }

  action(type, ...args) {
    switch (type) {
    case CF_MENU_ENTRY_ITEM_CONFIG.CHANGE_DIR:
      this.#onChangeDir(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let owner = dba.WebConfig.getOwner();
    let iconUrl = owner ? owner.getIconUrl() : "";

    let item = dba.Menus.find(this._itemId);
    let pp = new ui.Panel();
    p.pushPanel(pp);
    let s = _CFT_MENU_ENTRY_ITEM_CONFIG.NAME;
    s = s.replace("__NAME__", this.#getTagName(item ? item.getTagId() : null));
    pp.replaceContent(s);

    // Theme
    let theme = item ? item.getTheme() : null;
    this._fThemeEditor.setTheme(theme);
    this._fThemeEditor.setIconUrl(iconUrl);
    pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this._fThemeEditor.attachRender(pp);
    this._fThemeEditor.render();

    p.pushSpace(1);

    pp = new ui.Panel();
    pp.setClassName("s-font5");
    p.pushPanel(pp);
    pp.replaceContent(
        this.#renderPath(this._subItemId ? this._subItemId : this._itemId));

    pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    super._renderOnRender(pp);

    p.pushSpace(1);
  }

  _createSubDirFragment(item) {
    let f = new gui.MenuItemName(item.getId());
    f.setDelegate(this);
    return f;
  }

  _getSubItems() {
    if (this._subItemId) {
      return this.#getSubItems(this._subItemId);
    }
    return this.#getSubItems(this._itemId);
  }

  #getSubItems(itemId) {
    let i = dba.Menus.find(itemId);
    return i ? i.getSubItems() : [];
  }

  #renderPath(itemId) {
    let names = [];
    let i = dba.Menus.find(itemId);
    while (i) {
      if (names.length) {
        names.unshift(this.#renderPathItem(i));
      } else {
        names.unshift(this.#getTagName(i.getTagId()));
      }
      i = i.getParent();
    }
    let s = _CFT_MENU_ENTRY_ITEM_CONFIG.PATH;
    s = s.replace("__ITEMS__", names.join("/"))
    return s;
  }

  #renderPathItem(item) {
    let s = _CFT_MENU_ENTRY_ITEM_CONFIG.PATH_ITEM;
    s = s.replace("__ID__", item.getId());
    s = s.replace("__NAME__", this.#getTagName(item.getTagId()));
    return s;
  }

  #getTagName(tagId) {
    let tag = dba.WebConfig.getTag(tagId);
    return tag ? tag.getName() : "";
  }

  #getItem() { return dba.Menus.find(this._itemId); }

  #onChangeDir(menuItemId) {
    this._subItemId = menuItemId;
    this.render();
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.CF_MENU_ENTRY_ITEM_CONFIG = CF_MENU_ENTRY_ITEM_CONFIG;
  window.gui.MenuEntryItemConfig = MenuEntryItemConfig;
}
