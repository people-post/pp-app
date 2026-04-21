import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Menus } from '../dba/Menus.js';
import { WebConfig } from '../dba/WebConfig.js';

const CF_MENU_ITEM_NAME = {
  ONCLICK : "CF_GUI_MENU_ITEM_NAME_1",
  DELETE : "CF_GUI_MENU_ITEM_NAME_2",
}

const _CFT_MENU_ITEM_NAME = {
  MAIN : `<table class="tw:w-full">
    <tbody>
      <tr>
        <td>
        __NAME__
        </td>
        <td class="tw:text-right">
          <span class="button-like small danger" data-pp-action="${CF_MENU_ITEM_NAME.DELETE}">Delete...</span>
        </td>
      </tr>
    </tbody>
  </table>`,
  DIR_NAME :
      `<span class="tw:cursor-pointer tw:underline" data-pp-action="${CF_MENU_ITEM_NAME.ONCLICK}">__TEXT__</span>`,
}

export interface MenuItemNameDelegate {
  onItemClickedInGuiMenuItemName(f: MenuItemName, itemId: string): void;
  onGuiMenuItemNameRequestDeleteItem(f: MenuItemName, itemId: string): void;
}

export class MenuItemName extends Fragment {
  protected _itemId: string;

  constructor(itemId: string) {
    super();
    this._itemId = itemId;
  }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_MENU_ITEM_NAME.ONCLICK:
      this.#onClick();
      break;
    case CF_MENU_ITEM_NAME.DELETE:
      this.#onDelete();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    let p = new Panel();
    p.setClassName("");
    render.wrapPanel(p);
    p.replaceContent(this._renderName());
  }

  _renderName(): string {
    let item = this._getItem();
    if (!item) {
      return "";
    }
    let tag = WebConfig.getTag(item.getTagId());
    let s = _CFT_MENU_ITEM_NAME.MAIN;
    let name = tag ? tag.getName() || "" : item.getName() || "";
    if (item.getDepth() < 5) {
      name = _CFT_MENU_ITEM_NAME.DIR_NAME.replace("__TEXT__", name);
    }
    s = s.replace("__NAME__", name);
    return s;
  }

  _getItem(): ReturnType<typeof Menus.find> { return Menus.find(this._itemId); }

  #onClick(): void {
    this.getDelegate<MenuItemNameDelegate>()?.onItemClickedInGuiMenuItemName(this, this._itemId);
  }

  #onDelete(): void {
    this.getDelegate<MenuItemNameDelegate>()?.onGuiMenuItemNameRequestDeleteItem(this, this._itemId);
  }
}

export default MenuItemName;
