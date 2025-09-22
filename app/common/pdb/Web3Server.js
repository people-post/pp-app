(function(pdb) {
class Web3Server {
  #hostInfo = null;
  #multiAddr = null;

  getName() { return this.#getHostAddr(this.#multiAddr); }
  getAddress() { return this.#getHostAddr(this.#multiAddr); }
  getApiType() { return this.#hostInfo.type; }
  getInfo(key) { return this.#hostInfo[key]; }
  getApiUrl(path) {
    return this.#multiAddr ? this.#getHostAddr(this.#multiAddr) + path : null;
  }

  async asInit(sAddr) {
    this.#multiAddr = this.#parseAddress(sAddr);
    this.#hostInfo = await this.#asFetchHostInfo();
    return !!this.#hostInfo;
  }

  #getHostAddr(ma) {
    let na = ma.nodeAddress();
    if (na.family == 6) {
      return "http://[" + na.address + "]:" + na.port;
    } else {
      return "http://" + na.address + ":" + na.port;
    }
  }

  #parseAddress(sAddr) {
    return sAddr ? MultiformatsMultiaddr.multiaddr(sAddr) : null;
  }

  async #asFetchHostInfo() {
    if (!this.#multiAddr) {
      return null;
    }

    const url = this.getApiUrl("/api/host/info");
    let req = new Request(url, {method : "GET"});
    let res;
    try {
      res = await plt.Api.p2pFetch(req);
    } catch (e) {
      console.error("Failed to contact server", e);
      return null;
    }
    let d = await res.json();
    if (d.error) {
      console.error("Error in server", d.error);
      return null;
    }
    return d.data.info;
  }
};

pdb.Web3Server = Web3Server;
}(window.pdb = window.pdb || {}));
