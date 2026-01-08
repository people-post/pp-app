import { DirFragment } from '../gui/DirFragment.js';
import { FSmartInput } from '../gui/FSmartInput.js';
import { FoldableItemFragment } from '../gui/FoldableItemFragment.js';
import { MenuEntryItemName } from './MenuEntryItemName.js';
import { MenuEntryItemConfig } from './MenuEntryItemConfig.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Menus } from '../dba/Menus.js';
import { WebConfig } from '../dba/WebConfig.js';
import Utilities from '../../lib/ext/Utilities.js';
import { T_DATA } from '../../lib/framework/Events.js';
import { MAX } from '../constants/Constants.js';

export class MenuConfig extends DirFragment {
  private _fSelected: FoldableItemFragment | null = null;
  private _sectorId: string | null = null;

  constructor() {
    super();
    let f = new FSmartInput();
    f.setHintText("+New tag name");
    f.setDelegate(this);

    this.setNewItemFragment(f);
    this.setNMaxItems(MAX.N_MENU_ITEMS);
  }

  setSectorId(sectorId: string | null): void { this._sectorId = sectorId; }

  onEntryItemRequestDelete(_fEntryItem: MenuEntryItemConfig, itemId: string): void {
    this.#onDeleteMenuItem(itemId);
  }
  onSimpleButtonClicked(fBtn: Button): void { this.#onDeleteMenuItem(fBtn.getValue() as string); }

  onFoldableItemOpen(fItem: FoldableItemFragment, _itemId: string): void {
    if (this._fSelected) {
      this._fSelected.close();
    }
    this._fSelected = fItem;
  }
  onFoldableItemClose(_fItem: FoldableItemFragment, _itemId: string): void { this._fSelected = null; }

  onItemChosenInSmartInputFragment(_fSmartInput: FSmartInput, itemId: string): void {
    let m = this.#getMenuItem();
    Menus.asyncAddMenuItem(this._sectorId, m ? m.getId() : "", itemId);
  }

  onGuiMenuEntryItemConfigRequestChangeTheme(_fDetail: MenuEntryItemConfig, menuId: string, key: string, color: string): void {
    if (Utilities.isValidColor(color)) {
      Menus.asyncUpdateEntryMenuItemTheme(this._sectorId, menuId, key,
                                              color);
    }
  }

  onMenuItemRequestAddSubItem(_fMenuItem: MenuEntryItemConfig, menuItemId: string, tagId: string): void {
    Menus.asyncAddMenuItem(this._sectorId, menuItemId, tagId);
  }

  getFilteredItemsForSmartInputFragment(_fSmartInput: FSmartInput, filterStr: string): Array<{id: string; name: string}> {
    let s = filterStr.toLowerCase();
    let items: Array<{id: string; name: string}> = [];
    let tagIdsInUse: string[] = [];
    for (let i of this._getSubItems()) {
      tagIdsInUse.push((i as { getTagId(): string }).getTagId());
    }
    for (let t of WebConfig.getTags()) {
      if (tagIdsInUse.indexOf(t.getId()) > -1) {
        continue;
      }
      if (t.getName().toLowerCase().indexOf(s) > -1) {
        items.push({id : t.getId(), name : t.getName()});
      }
    }
    return items;
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.WEB_CONFIG:
    case T_DATA.USER_PROFILE:
    case T_DATA.MENUS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _createSubDirFragment(item: ReturnType<typeof this._dataSource.getMenuForGuiMenuConfig>): FoldableItemFragment {
    if (!item) {
      throw new Error("Item is required");
    }
    let itemId = item.getId();
    let f = new FoldableItemFragment();
    f.setItemId(itemId);
    f.setHeaderFragment(new MenuEntryItemName(itemId));
    let fContent = new MenuEntryItemConfig(itemId);
    fContent.setDelegate(this);
    f.setContentFragment(fContent);

    let btn = new Button();
    btn.setName("Delete...");
    btn.setThemeType(Button.T_THEME.DANGER);
    btn.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    btn.setValue(itemId);
    btn.setDelegate(this);
    f.setActionFragment(btn);

    f.setDelegate(this);
    f.setIsOpen(this._fSelected && this._fSelected.getItemId() == item.getId());
    return f;
  }

  _getSubItems(): unknown[] {
    let m = this.#getMenuItem();
    return m ? m.getSubItems() : [];
  }

  #getMenuItem(): ReturnType<typeof this._dataSource.getMenuForGuiMenuConfig> { return this._dataSource.getMenuForGuiMenuConfig(this); }

  #onDeleteMenuItem(itemId: string): void {
    this._confirmDangerousOperation(
        R.get("CONFIRM_DELETE_MENU_ITEM"),
        () => Menus.asyncRemoveMenuItem(this._sectorId, itemId));
  }
}

export default MenuConfig;
