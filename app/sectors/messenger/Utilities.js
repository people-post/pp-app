export const Utilities = function() {
  function _getGroupName(groupId) {
    let g = dba.Groups.get(groupId);
    if (!g) {
      return "Unknown group";
    }

    let name = g.getName();
    if (name && name.length) {
      return name;
    }

    let items = [];
    for (let id of g.getMemberIds()) {
      if (id == dba.Account.getId()) {
        continue;
      }
      let nn = dba.Account.getUserNickname(id, null);
      if (nn && nn.length) {
        if (items.length > 3) {
          items.push("...");
          break;
        } else {
          items.push(nn);
        }
      }
    }

    if (items.length == 0) {
      return "Empty group";
    }

    return items.join(`<span class="small-info-text">&</span>`);
  }

  return {
    getGroupName : _getGroupName,
  };
}();

// Backward compatibility
if (typeof window !== 'undefined') {
  window.msgr = window.msgr || {};
  window.msgr.Utilities = Utilities;
}