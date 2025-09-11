(function(dba) {

dba.Hashtags = function() {
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
    let url = "api/blog/hashtags";
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

  function _update(hashTag) { _map.set(hashTag.getId(), hashTag); }

  function __onLoadRRR(ids, responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      let hts = [];
      for (let d of response.data.hashtags) {
        let ht = new dat.Hashtag(d);
        _update(ht);
        hts.push(ht);
      }
      fwk.Events.trigger(plt.T_DATA.HASHTAGS, hts);
    }
  }

  return {
    loadMissing : _loadMissing,
    get : _get,
    update : _update,
  };
}();
}(window.dba = window.dba || {}));
