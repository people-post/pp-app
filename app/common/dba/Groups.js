(function(dba) {

dba.Groups = function() {
  // Public groups' information
  let _map = new Map();

  function _loadMissing(ids) {
    let missingIds = [];
    for (let id of ids) {
      if (!_map.has(id)) {
        missingIds.push(id);
      }
    }
    if (missingIds.length) {
      _load(missingIds);
      return true;
    }
    return false;
  }

  function _load(ids) {
    let url = "api/career/groups";
    let fd = new FormData();
    for (let id of ids) {
      fd.append("ids", id);
      // Set to default
      _map.set(id, null);
    }
    plt.Api.asyncRawPost(url, fd, r => __onLoadRRR(ids, r));
  }

  function _get(id) {
    if (!id) {
      return null;
    }
    if (_map.has(id)) {
      return _map.get(id);
    }
    _load([ id ]);
    return null;
  }

  function _getTag(id) {
    // TODO: Separate tag and group
    return _get(id);
  }

  function _update(group) { _map.set(group.getId(), group); }

  function __onLoadRRR(ids, responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      let gs = [];
      for (let d of response.data.groups) {
        let g = new dat.UserGroup(d);
        _update(g);
        gs.push(g);
      }
      fwk.Events.trigger(plt.T_DATA.GROUPS, gs);
    }
  }

  return {
    loadMissing : _loadMissing,
    get : _get,
    getTag : _getTag,
    update : _update,
  };
}();
}(window.dba = window.dba || {}));
