(function(dba) {

dba.Users = function() {
  // Public users' information
  let _map = __initMap();
  let _isLoading = false;

  function __initMap() {
    let m = new Map();
    m.set(
        dat.User.C_ID.SYSTEM,
        new dat.User({nickname : "G-Cabin", icon_url : "file/gcabin_favicon"}));
    m.set(dat.User.C_ID.L_ADD_USER, new dat.User({
      nickname : "Add",
      icon_url : C.PATH.STATIC + "/img/circle_add.svg"
    }));
    return m;
  }

  function _clear() { _map = __initMap(); }

  function _loadMissing(ids) {
    let missingIds = [];
    for (let id of ids) {
      if (!_map.has(id)) {
        missingIds.push(id);
      }
    }
    if (missingIds.length) {
      _load(missingIds);
    }
  }

  function _load(ids) {
    if (plt.Env.isWeb3()) {
      _web3Load(ids);
    } else {
      _web2Load(ids);
    }
  }

  function _web2Load(ids) {
    if (_isLoading) {
      return;
    }
    _isLoading = true;
    let url = "api/user/profiles";
    let fd = new FormData();
    for (let id of ids) {
      fd.append("ids", id);
      // Set to default
      _map.set(id, null);
    }
    plt.Api.asyncRawPost(url, fd, r => __onLoadRRR(ids, r));
  }

  function _web3Load(ids) {
    for (let id of ids) {
      glb.web3Resolver.asyncResolve(id).then(d => __onWeb3LoadRRR(id, d));
    }
  }

  function __onWeb3LoadRRR(userId, data) {
    let u = new pdb.Web3User(data);
    _map.set(userId, u);
    fwk.Events.trigger(plt.T_DATA.USER_PUBLIC_PROFILES, [ u ]);
  }

  async function _asyncGet(id) {
    if (plt.Env.isWeb3() && dba.Account.isAuthenticated() &&
        dba.Account.getId() == id) {
      return dba.Account;
    }

    if (!_map.has(id)) {
      let d = await glb.web3Resolver.asyncResolve(id);
      _map.set(id, new pdb.Web3User(d));
    }
    return _map.get(id);
  }

  function _get(id) {
    if (!id) {
      return null;
    }

    if (plt.Env.isWeb3() && dba.Account.isAuthenticated() &&
        dba.Account.getId() == id) {
      return dba.Account;
    }

    if (_map.has(id)) {
      return _map.get(id);
    } else {
      _load([ id ]);
      return null;
    }
  }

  function _update(user) { _map.set(user.getId(), user); }
  function _reload(userId) {
    _map.delete(userId);
    _load([ userId ]);
  }

  function __onLoadRRR(ids, responseText) {
    _isLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      let us = [];
      for (let p of response.data.profiles) {
        us.push(new dat.User(p));
      }
      for (let u of us) {
        _update(u);
      }
      fwk.Events.trigger(plt.T_DATA.USER_PUBLIC_PROFILES, us);
    }
  }

  return {
    get : _get,
    asyncGet : _asyncGet,
    loadMissing : _loadMissing,
    update : _update,
    reload : _reload,
    clear : _clear,
  };
}();
}(window.dba = window.dba || {}));
