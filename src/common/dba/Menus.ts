import { Menu } from '../datatypes/Menu.js';
import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { glb } from '../../lib/framework/Global.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    menus?: unknown[];
  };
}

interface MenusInterface {
  get(sectorId: string, userId: string | null): Menu[];
  find(itemId: string): unknown;
  asyncAddMenu(sectorId: string, name: string): void;
  asyncAddMenuItem(sectorId: string, parentId: string, tagId: string): void;
  asyncRemoveMenuItem(sectorId: string, menuId: string): void;
  asyncUpdateEntryMenuItemTheme(sectorId: string, menuId: string, key: string, color: string): void;
}

export class MenusClass implements MenusInterface {
  #lib = new Map<string | null, Map<string, Menu[]>>();
  #pendingResponses: string[] = [];

  get(sectorId: string, userId: string | null): Menu[] {
    const m = this.#lib.get(userId);
    if (m && m.has(sectorId)) {
      return m.get(sectorId)!;
    } else {
      this.#asyncGetMenus(sectorId, userId);
      return [];
    }
  }

  find(itemId: string): unknown {
    for (const v of this.#lib.values()) {
      for (const ms of v.values()) {
        for (const m of ms) {
          const item = m.find(itemId);
          if (item) {
            return item;
          }
        }
      }
    }
    return null;
  }

  #asyncGetMenus(sectorId: string, userId: string | null): void {
    const key = sectorId + (userId || '');
    if (this.#pendingResponses.indexOf(key) >= 0) {
      return;
    }
    this.#pendingResponses.push(key);

    let url = '/api/user/menus?sector=' + sectorId;
    if (userId) {
      url += '&user=' + userId;
    }
    glb.api?.asyncRawCall(url, (r) => this.#onGetMenusRRR(r, sectorId, userId), null);
  }

  asyncAddMenu(sectorId: string, name: string): void {
    const url = '/api/user/add_menu';
    const fd = new FormData();
    fd.append('sector', sectorId);
    fd.append('name', name);
    glb.api?.asyncRawPost(url, fd, (r) => this.#onOwnerMenusRRR(r, sectorId), null);
  }

  asyncAddMenuItem(sectorId: string, parentId: string, tagId: string): void {
    const url = '/api/user/add_menu_item';
    const fd = new FormData();
    fd.append('sector', sectorId);
    fd.append('parent_id', parentId);
    fd.append('tag_id', tagId);
    glb.api?.asyncRawPost(url, fd, (r) => this.#onOwnerMenusRRR(r, sectorId), null);
  }

  asyncRemoveMenuItem(sectorId: string, menuId: string): void {
    const url = '/api/user/remove_menu_item';
    const fd = new FormData();
    fd.append('sector', sectorId);
    fd.append('id', menuId);
    glb.api?.asyncRawPost(url, fd, (r) => this.#onOwnerMenusRRR(r, sectorId), null);
  }

  asyncUpdateEntryMenuItemTheme(sectorId: string, menuId: string, key: string, color: string): void {
    const url = '/api/user/update_menu_entry_item_theme';
    const fd = new FormData();
    fd.append('sector', sectorId);
    fd.append('id', menuId);
    fd.append('key', key);
    fd.append('color', color);
    glb.api?.asyncRawPost(url, fd, (r) => this.#onOwnerMenusRRR(r, sectorId), null);
  }

  #setMenus(menus: unknown[], sectorId: string, userId: string | null): void {
    if (!this.#lib.has(userId)) {
      this.#lib.set(userId, new Map());
    }

    const m = this.#lib.get(userId)!;

    const ms: Menu[] = [];
    for (const menuData of menus) {
      ms.push(new Menu(menuData as Record<string, unknown>));
    }

    m.set(sectorId, ms);
    FwkEvents.trigger(PltT_DATA.MENUS, ms);
  }

  #onGetMenusRRR(responseText: string, sectorId: string, userId: string | null): void {
    const key = sectorId + (userId || '');
    const idx = this.#pendingResponses.indexOf(key);
    if (idx >= 0) {
      this.#pendingResponses.splice(idx, 1);
    }
    this.#onMenusRRR(responseText, sectorId, userId);
  }

  #onOwnerMenusRRR(responseText: string, sectorId: string): void {
    this.#onMenusRRR(responseText, sectorId, window.dba.Account.getId());
  }

  #onMenusRRR(responseText: string, sectorId: string, userId: string | null): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.menus) {
        this.#setMenus(response.data.menus, sectorId, userId);
      }
    }
  }
}

export const Menus = new MenusClass();

