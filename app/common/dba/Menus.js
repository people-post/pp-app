export const Menus = function() {
  let _lib = new Map();
  let _pendingResponses = [];

  function _get(sectorId, userId) {
    let m = _lib.get(userId);
    if (m && m.has(sectorId)) {
      return m.get(sectorId);
    } else {
      __asyncGetMenus(sectorId, userId);
      return [];
    }
  }

  function _find(itemId) {
    for (let v of _lib.values()) {
      for (let ms of v.values()) {
        for (let m of ms) {
          let item = m.find(itemId);
          if (item) {
            return item;
          }
        }
      }
    }
    return null;
  }

  function __asyncGetMenus(sectorId, userId) {
    if (_pendingResponses.indexOf(sectorId + userId) >= 0) {
      return;
    }
    _pendingResponses.push(sectorId + userId);

    let url = "/api/user/menus?sector=" + sectorId;
    if (userId) {
      url += "&user=" + userId;
    }
    plt.Api.asyncRawCall(url, r => __onGetMenusRRR(r, sectorId, userId));
  }

  function _asyncAddMenu(sectorId, name) {
    let url = "/api/user/add_menu";
    let fd = new FormData();
    fd.append("sector", sectorId);
    fd.append('name', name);
    plt.Api.asyncRawPost(url, fd, r => __onOwnerMenusRRR(r, sectorId));
  }

  function _asyncAddMenuItem(sectorId, parentId, tagId) {
    let url = "/api/user/add_menu_item";
    let fd = new FormData();
    fd.append("sector", sectorId);
    fd.append('parent_id', parentId);
    fd.append('tag_id', tagId)
    plt.Api.asyncRawPost(url, fd, r => __onOwnerMenusRRR(r, sectorId));
  }

  function _asyncRemoveMenuItem(sectorId, menuId) {
    let url = "/api/user/remove_menu_item";
    let fd = new FormData();
    fd.append('sector', sectorId)
    fd.append('id', menuId)
    plt.Api.asyncRawPost(url, fd, r => __onOwnerMenusRRR(r, sectorId));
  }

  function _asyncUpdateMenuEntryItemTheme(sectorId, menuId, key, color) {
    let url = "/api/user/update_menu_entry_item_theme";
    let fd = new FormData();
    fd.append('sector', sectorId)
    fd.append("id", menuId);
    fd.append("key", key);
    fd.append("color", color);
    plt.Api.asyncRawPost(url, fd, r => __onOwnerMenusRRR(r, sectorId));
  }

  function __setMenus(menus, sectorId, userId) {
    if (!_lib.has(userId)) {
      _lib.set(userId, new Map());
    }

    let m = _lib.get(userId);

    let ms = [];
    for (let m of menus) {
      ms.push(new dat.Menu(m));
    }

    m.set(sectorId, ms);
    fwk.Events.trigger(plt.T_DATA.MENUS);
  }

  function __onGetMenusRRR(responseText, sectorId, userId) {
    let idx = _pendingResponses.indexOf(sectorId + userId);
    if (idx >= 0) {
      _pendingResponses.splice(idx, 1);
    }
    __onMenusRRR(responseText, sectorId, userId);
  }

  function __onOwnerMenusRRR(responseText, sectorId) {
    __onMenusRRR(responseText, sectorId, dba.Account.getId());
  }

  function __onMenusRRR(responseText, sectorId, userId) {
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      __setMenus(response.data.menus, sectorId, userId);
    }
  }

  return {
    get : _get,
    find : _find,
    asyncAddMenu : _asyncAddMenu,
    asyncAddMenuItem : _asyncAddMenuItem,
    asyncRemoveMenuItem : _asyncRemoveMenuItem,
    asyncUpdateEntryMenuItemTheme : _asyncUpdateMenuEntryItemTheme,
  };
}();
}();

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dba = window.dba || {};
  window.dba.Menus = Menus;
}
