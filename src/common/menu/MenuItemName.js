import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Menus } from '../dba/Menus.js';
import { WebConfig } from '../dba/WebConfig.js';

export const CF_MENU_ITEM_NAME = {
  ONCLICK : "CF_GUI_MENU_ITEM_NAME_1",
  DELETE : "CF_GUI_MENU_ITEM_NAME_2",
}

const _CFT_MENU_ITEM_NAME = {
  MAIN : `<table class="w100">
    <tbody>
      <tr>
        <td>
        __NAME__
        </td>
        <td class="right-align">
          <span class="button-like small danger" onclick="javascript:G.action(gui.CF_MENU_ITEM_NAME.DELETE)">Delete...</span>
        </td>
      </tr>
    </tbody>
  </table>`,
  DIR_NAME :
      `<span class="clickable underline" onclick="javascript:G.action(gui.CF_MENU_ITEM_NAME.ONCLICK)">__TEXT__</span>`,
}

export class MenuItemName extends Fragment {
  constructor(itemId) {
    super();
    this._itemId = itemId;
  }

  action(type, ...args) {
    switch (type) {
    case CF_MENU_ITEM_NAME.ONCLICK:
      this.#onClick();
      break;
    case CF_MENU_ITEM_NAME.DELETE:
      this.#onDelete();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let p = new Panel();
    p.setClassName("");
    render.wrapPanel(p);
    p.replaceContent(this._renderName());
  }

  _renderName() {
    let item = this._getItem();
    let tag = WebConfig.getTag(item.getTagId());
    let s = _CFT_MENU_ITEM_NAME.MAIN;
    let name = tag ? tag.getName() : item.getName();
    if (item.getDepth() < 5) {
      name = _CFT_MENU_ITEM_NAME.DIR_NAME.replace("__TEXT__", name);
    }
    s = s.replace("__NAME__", name);
    return s;
  }

  _getItem() { return Menus.find(this._itemId); }

  #onClick() {
    this._delegate.onItemClickedInGuiMenuItemName(this, this._itemId);
  }

  #onDelete() {
    this._delegate.onGuiMenuItemNameRequestDeleteItem(this, this._itemId);
  }
};
