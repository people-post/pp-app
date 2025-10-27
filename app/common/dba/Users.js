(function(dba) {

// Public users' information
class UserLib {
  #isLoading = false;
  #mUsers = new Map();

  constructor() { this.#initMap(); }

  async asOnWeb3UserRequestFetchCidJson(user, cid) {
    return await plt.Api.asyncFetchCidJson(cid);
  }

  async asOnWeb3UserRequestFetchCidImage(user, cid) {
    return await plt.Api.asyncFetchCidImage(cid);
  }

  onWeb3UserIdolsLoaded(user) {
    fwk.Events.trigger(plt.T_DATA.USER_IDOLS, user.getId())
  }

  onWeb3UserProfileLoaded(user) {
    fwk.Events.trigger(plt.T_DATA.USER_PUBLIC_PROFILE, user.getId());
  }

  get(id) {
    if (!id) {
      return null;
    }

    if (glb.env.isWeb3() && dba.Account.isAuthenticated() &&
        dba.Account.getId() == id) {
      return dba.Account;
    }

    if (this.#mUsers.has(id)) {
      return this.#mUsers.get(id);
    } else {
      this.#load([ id ]);
      return null;
    }
  }

  async asyncGet(id) {
    if (glb.env.isWeb3() && dba.Account.isAuthenticated() &&
        dba.Account.getId() == id) {
      return dba.Account;
    }

    if (!this.#mUsers.has(id)) {
      let d = await glb.web3Resolver.asResolve(id);
      let u = new pp.User(d);
      u.setDataSource(this);
      u.setDelegate(this);
      this.#mUsers.set(id, u);
    }
    return this.#mUsers.get(id);
  }

  update(user) { this.#mUsers.set(user.getId(), user); }

  reload(userId) {
    this.#mUsers.delete(userId);
    this.#load([ userId ]);
  }

  loadMissing(ids) {
    let missingIds = [];
    for (let id of ids) {
      if (!this.#mUsers.has(id)) {
        missingIds.push(id);
      }
    }
    if (missingIds.length) {
      this.#load(missingIds);
    }
  }

  clear() { this.#initMap(); }

  #initMap() {
    this.#mUsers.clear();
    this.#mUsers.set(
        dat.User.C_ID.SYSTEM,
        new dat.User({nickname : "G-Cabin", icon_url : "file/gcabin_favicon"}));
    this.#mUsers.set(dat.User.C_ID.L_ADD_USER, new dat.User({
      nickname : "Add",
      icon_url : C.PATH.STATIC + "/img/circle_add.svg"
    }));
  }

  #load(ids) {
    if (glb.env.isWeb3()) {
      this.#web3Load(ids);
    } else {
      this.#web2Load(ids);
    }
  }

  #web2Load(ids) {
    if (this.#isLoading) {
      return;
    }
    this.#isLoading = true;
    let url = "api/user/profiles";
    let fd = new FormData();
    for (let id of ids) {
      fd.append("ids", id);
      // Set to default
      this.#mUsers.set(id, null);
    }
    plt.Api.asyncRawPost(url, fd, r => this.#onLoadRRR(ids, r));
  }

  #web3Load(ids) {
    for (let id of ids) {
      glb.web3Resolver.asResolve(id).then(d => this.#onWeb3LoadRRR(id, d));
    }
  }

  #onWeb3LoadRRR(userId, data) {
    let u = new pp.User(data);
    u.setDataSource(this);
    u.setDelegate(this);
    this.#mUsers.set(userId, u);
    fwk.Events.trigger(plt.T_DATA.USER_PUBLIC_PROFILES, [ u ]);
  }

  #onLoadRRR(ids, responseText) {
    this.#isLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      let us = [];
      for (let p of response.data.profiles) {
        us.push(new dat.User(p));
      }
      for (let u of us) {
        this.update(u);
      }
      fwk.Events.trigger(plt.T_DATA.USER_PUBLIC_PROFILES, us);
    }
  }
};

dba.Users = new UserLib();
}(window.dba = window.dba || {}));
