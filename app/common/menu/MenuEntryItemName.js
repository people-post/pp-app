(function(gui) {
const _CFT_MENU_ENTRY_ITEM_NAME = {
  MENU_ITEM_HEADER : `<table class="main-menu-item-config-title">
    <tbody>
      <tr>
        <td class="name" style="color:__COLOR_1__; background-color:__BG_COLOR_1__">__NAME__</td>
        <td style="background-color:__BG_COLOR_2__"></td>
      </tr>
    </tbody>
  </table>`,
}

class MenuEntryItemName extends gui.MenuItemName {
  _renderName() {
    let menuItem = this._getItem();
    let s = _CFT_MENU_ENTRY_ITEM_NAME.MENU_ITEM_HEADER;
    let tag = dba.WebConfig.getTag(menuItem ? menuItem.getTagId() : null);
    if (tag) {
      s = s.replace("__NAME__", tag.getName());
      let theme = menuItem.getTheme();
      if (!theme) {
        theme = dba.WebConfig.getDefaultTheme();
      }
      s = s.replace("__BG_COLOR_1__", theme.getPrimaryColor());
      s = s.replace("__COLOR_1__", theme.getSecondaryColor());
      s = s.replace("__BG_COLOR_2__", theme.getSecondaryColor());
      return s;
    }
    return "";
  }
};

gui.MenuEntryItemName = MenuEntryItemName;
}(window.gui = window.gui || {}));
