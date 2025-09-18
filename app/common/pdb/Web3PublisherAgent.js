(function(pdb) {
class Web3PublisherAgent extends pdb.Web3ServerAgent {
  static T_TYPE = {
    PUBLIC : "PUBLIC", // Aligned with config.json
    PRIVATE: "PRIVATE" // Aligned with config.json
  };

  #hostInfo;
  #mUsers;
  #initUserId;

  isInitUserRegistered() { return this.#mUsers.has(this.#initUserId); }
  isRegisterEnabled() { return !!this.#hostInfo.is_register_enabled; }
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
  getHostPeerId() { return this.#hostInfo.peer_id; }

  async asInit(typeName, multiAddr) {
    await super.asInit(typeName, multiAddr);
    this.#mUsers = new Map();
    this.#hostInfo = await this.#asFetchHostInfo();
  }

  async asInitForUser(userId) {
    this.#initUserId = userId;
    const c = await this.#asFetchUserById(userId);
    if (c) {
      this.#mUsers.set(userId, c);
    }
  }

  async asRegister(msg, pubKey, sig) {
    let url = this.getApiUrl("/api/user/register");
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

  async asyncPublish(cid, bearerId, sig) {
    let url = this.getApiUrl("/api/pin/publish");
    let req = new Request(url, {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
        "Authorization" : "Bearer " + bearerId
      },
      body : JSON.stringify({cid : cid, signature : sig, delay : 10})
    });
    let res = await plt.Api.p2pFetch(req);
    let d = await res.json();
    if (d.error) {
      throw d.error;
    }
    return d.data;
  }

  async #asFetchHostInfo() {
    const url = this.getApiUrl("/api/host/info");
    let req = new Request(url, {method : "GET"});
    let res;
    try {
      res = await plt.Api.p2pFetch(req);
    } catch (e) {
      return {};
    }
    let d = await res.json();
    if (d.error) {
      throw d.error;
    }
    return d.data.info;
  }

  async #asFetchUserByName(name) {
    if (!name) {
      return null;
    }

    const url = this.getApiUrl("/api/user/get?name=" + name);
    return await this.#asFetchUserInfo(url);
  }

  async #asFetchUserById(userId) {
    if (!userId) {
      return null;
    }

    const url = this.getApiUrl("/api/user/get?id=" + userId);
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

pdb.Web3PublisherAgent = Web3PublisherAgent;
}(window.pdb = window.pdb || {}));
