(function(pdb) {
const Web3PeerServerMixin = (Base) => class extends Base {
  #mUsers = new Map();
  #initUserId;

  isInitUserRegistered() { return this.#mUsers.has(this.#initUserId); }
  isRegisterEnabled() { return this.getServer().isRegisterEnabled(); }
  isInitUserUsable() {
    return this.isInitUserRegistered() || this.isRegisterEnabled();
  }

  getInitUserPeerId() {
    const u = this.#mUsers.get(this.#initUserId);
    return u ? u.peer_id : null;
  }

  getInitUserRootCid() {
    const u = this.#mUsers.get(this.#initUserId);
    return u ? u.root_cid : null;
  }

  async asIsNameRegistrable(name) {
    return !await this.#asFetchUserByName(name);
  }

  async asIsUserRegistered(userId) {
    return !!await this.#asFetchUserById(userId);
  }

  getInitUserId() { return this.#initUserId; }
  getHostPeerId() { return this.getServer().getPeerId(); }

  async asInitForUser(userId) {
    this.#initUserId = userId;
    const c = await this.#asFetchUserById(userId);
    if (c) {
      this.#mUsers.set(userId, c);
    }
  }

  async asRegister(msg, pubKey, sig) {
    console.log("Pubkey size", pubKey.length);
    let url = this.getServer().getApiUrl("/api/user/register");
    let options = {
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({data : msg, public_key : pubKey, signature : sig})
    };
    let res = await pp.sys.ipfs.asFetch(url, options);
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
    let options = {
      method : "GET",
      headers : {"Content-Type" : "application/json"}
    };
    let res;
    try {
      res = await pp.sys.ipfs.asFetch(url, options);
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

pdb.Web3PeerServerMixin = Web3PeerServerMixin;
}(window.pdb = window.pdb || {}));
