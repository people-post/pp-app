(function(pdb) {
const Web3PrivateServerMixin = (Base) => class extends Base {
  #mUsers = new Map();
  #initUserId;

  isInitUserRegistered() { return this.#mUsers.has(this.#initUserId); }
  isRegisterEnabled() { return !!this.getHostInfo("is_register_enabled"); }
  isInitUserUsable() {
    return this.isInitUserRegistered() || this.isRegisterEnabled();
  }

  async asIsNameRegistrable(name) {
    return !await this.#asFetchUserByName(name);
  }

  async asIsUserRegistered(userId) {
    return !!await this.#asFetchUserById(userId);
  }

  getInitUserId() { return this.#initUserId; }
  getHostPeerId() { return this.getHostInfo("peer_id"); }

  async asInitForUser(userId) {
    this.#initUserId = userId;
    const c = await this.#asFetchUserById(userId);
    if (c) {
      this.#mUsers.set(userId, c);
    }
  }

  async asRegister(msg, pubKey, sig) {
    let url = this.getServer().getApiUrl("/api/user/register");
    let req = new Request(url, {
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({data : msg, public_key : pubKey, signature : sig})
    });
    let res = await plt.Api.p2pFetch(req);
    let d = await res.json();
    if (d.error) {
      throw d.error;
    }
    let u = d.data.user;
    this.#mUsers.set(u.id, u);
  }

  async #asFetchUserByName(name) {
    if (!name) {
      return null;
    }

    const url = this.getServer().getApiUrl("/api/user/get?name=" + name);
    return await this.#asFetchUserInfo(url);
  }

  async #asFetchUserById(userId) {
    if (!userId) {
      return null;
    }

    const url = this.getServer().getApiUrl("/api/user/get?id=" + userId);
    return await this.#asFetchUserInfo(url);
  }

  async #asFetchUserInfo(url) {
    let req = new Request(
        url, {method : "GET", headers : {"Content-Type" : "application/json"}});
    let res;
    try {
      res = await plt.Api.p2pFetch(req);
    } catch (e) {
      return null;
    }
    let d = await res.json();
    if (d.error) {
      throw d.error;
    }
    return d.data.user;
  }
};

pdb.Web3PrivateServerMixin = Web3PrivateServerMixin;
}(window.pdb = window.pdb || {}));
