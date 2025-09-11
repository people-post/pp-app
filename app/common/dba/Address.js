(function(dba) {

dba.Address = function() {
  let _lib = new Map();
  let _pendingResponses = [];

  function _get(id) {
    if (!id) {
      return null;
    }
    if (_lib.has(id)) {
      return _lib.get(id);
    } else {
      __asyncGet(id);
      return null;
    }
  }

  function _update(address) {
    _lib.set(address.getId(), address);
    fwk.Events.trigger(plt.T_DATA.ADDRESS, address);
  }

  function __asyncGet(id) {
    if (_pendingResponses.indexOf(id) >= 0) {
      return;
    }
    _pendingResponses.push(id);
    let url = "/api/user/address";
    let fd = new FormData();
    fd.append("id", id);
    plt.Api.asyncRawPost(url, fd, r => __onGetRRR(r, id));
  }

  function __onGetRRR(responseText, id) {
    let idx = _pendingResponses.indexOf(id);
    if (idx >= 0) {
      _pendingResponses.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      _update(new dat.Address(response.data.address));
    }
  }

  return {
    get : _get,
    update : _update,
  };
}();
}(window.dba = window.dba || {}));
