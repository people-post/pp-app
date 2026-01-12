import { DirFragment } from '../gui/DirFragment.js';
import { ThemeEditorFragment } from '../gui/ThemeEditorFragment.js';
import { FSmartInput } from '../gui/FSmartInput.js';
import { MenuItemName } from './MenuItemName.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Menus } from '../dba/Menus.js';
import { WebConfig } from '../dba/WebConfig.js';
import { MAX } from '../constants/Constants.js';

export const CF_MENU_ENTRY_ITEM_CONFIG = {
  CHANGE_DIR : "CF_GUI_MENU_ENTRY_ITEM_CONFIG_2",
}

const _CFT_MENU_ENTRY_ITEM_CONFIG = {
  NAME : `<span class="menu-item-config-name">Name:</span>
  <span>__NAME__</span>`,
  PATH_ITEM :
      `<span class="clickable cblue underline" onclick="javascript:G.action('${CF_MENU_ENTRY_ITEM_CONFIG.CHANGE_DIR}', '__ID__')">__NAME__</span>`,
  PATH : `Current path: <span class="cblue">__ITEMS__</span>`,
}

export class MenuEntryItemConfig extends DirFragment {
  private _fThemeEditor: ThemeEditorFragment;
  protected _itemId: string;
  private _subItemId: string | null = null;

  constructor(itemId: string) {
    super();
    this._fThemeEditor = new ThemeEditorFragment();
    this._fThemeEditor.setDelegate(this);
    this.setChild("themeEditor", this._fThemeEditor);

    let f = new FSmartInput();
    f.setHintText("+New tag name");
    f.setDelegate(this);
    this.setNewItemFragment(f);
    this.setNMaxItems(MAX.N_MENU_ITEMS);

    this._itemId = itemId;
  }

  onItemClickedInGuiMenuItemName(_fName: MenuItemName, itemId: string): void {
    this._subItemId = itemId;
    this.render();
  }
  onGuiMenuItemNameRequestDeleteItem(_fName: MenuItemName, itemId: string): void {
    // @ts-expect-error - delegate may have this method
    this._delegate?.onEntryItemRequestDelete?.(this, itemId);
  }
  onGuiThemeEditorFragmentRequestChangeColor(_fThemeEditor: ThemeEditorFragment, key: string, color: string): void {
    // @ts-expect-error - delegate may have this method
    this._delegate?.onGuiMenuEntryItemConfigRequestChangeTheme?.(
        this, this._itemId, key, color);
  }

  onItemChosenInSmartInputFragment(_fSmartInput: FSmartInput, tagId: string): void {
    if (this._subItemId) {
      // @ts-expect-error - delegate may have this method
      this._delegate?.onMenuItemRequestAddSubItem?.(this, this._subItemId, tagId);
    } else {
      // @ts-expect-error - delegate may have this method
      this._delegate?.onMenuItemRequestAddSubItem?.(this, this._itemId, tagId);
    }
  }

  getFilteredItemsForSmartInputFragment(_fSmartInput: FSmartInput, filterStr: string): Array<{id: string; name: string}> {
    let s = filterStr.toLowerCase();
    let items: Array<{id: string; name: string}> = [];
    for (let t of WebConfig.getTags()) {
      if (t.getName().toLowerCase().indexOf(s) > -1) {
        items.push({id : t.getId(), name : t.getName()});
      }
    }
    return items;
  }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_MENU_ENTRY_ITEM_CONFIG.CHANGE_DIR:
      this.#onChangeDir(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    let owner = WebConfig.getOwner();
    let iconUrl = owner ? owner.getIconUrl() : "";

    let item = Menus.find(this._itemId);
    let pp = new Panel();
    p.pushPanel(pp);
    let s = _CFT_MENU_ENTRY_ITEM_CONFIG.NAME;
    s = s.replace("__NAME__", this.#getTagName(item ? item.getTagId() : null));
    pp.replaceContent(s);

    // Theme
    let theme = item ? item.getTheme() : null;
    this._fThemeEditor.setTheme(theme);
    this._fThemeEditor.setIconUrl(iconUrl);
    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fThemeEditor.attachRender(pp);
    this._fThemeEditor.render();

    p.pushSpace(1);

    pp = new Panel();
    pp.setClassName("s-font5");
    p.pushPanel(pp);
    pp.replaceContent(
        this.#renderPath(this._subItemId ? this._subItemId : this._itemId));

    pp = new PanelWrapper();
    p.pushPanel(pp);
    super._renderOnRender(pp);

    p.pushSpace(1);
  }

  _createSubDirFragment(item: ReturnType<typeof Menus.find>): MenuItemName {
    if (!item) {
      throw new Error("Item is required");
    }
    let f = new MenuItemName(item.getId());
    f.setDelegate(this);
    return f;
  }

  _getSubItems(): unknown[] {
    if (this._subItemId) {
      return this.#getSubItems(this._subItemId);
    }
    return this.#getSubItems(this._itemId);
  }

  #getSubItems(itemId: string): unknown[] {
    let i = Menus.find(itemId);
    return i ? i.getSubItems() : [];
  }

  #renderPath(itemId: string): string {
    let names: string[] = [];
    let i = Menus.find(itemId);
    while (i) {
      if (names.length) {
        names.unshift(this.#renderPathItem(i));
      } else {
        names.unshift(this.#getTagName(i.getTagId()));
      }
      i = i.getParent();
    }
    let s = _CFT_MENU_ENTRY_ITEM_CONFIG.PATH;
    s = s.replace("__ITEMS__", names.join("/"));
    return s;
  }

  #renderPathItem(item: ReturnType<typeof Menus.find>): string {
    if (!item) {
      return "";
    }
    let s = _CFT_MENU_ENTRY_ITEM_CONFIG.PATH_ITEM;
    s = s.replace("__ID__", item.getId());
    s = s.replace("__NAME__", this.#getTagName(item.getTagId()));
    return s;
  }

  #getTagName(tagId: string | null): string {
    let tag = WebConfig.getTag(tagId);
    return tag ? tag.getName() : "";
  }

  #getItem(): ReturnType<typeof Menus.find> { return Menus.find(this._itemId); }

  #onChangeDir(menuItemId: string): void {
    this._subItemId = menuItemId;
    this.render();
  }
}

export default MenuEntryItemConfig;
