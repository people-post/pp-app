(function(pdb) {
class Web3Server {
  static T_REGISTER = {
    PEER : "PEER", // Synced with backend
    GROUP: "GROUP" // Synced with backend
  };

  #hostInfo = null;
  #multiAddr = null;

  isRegisterEnabled() {
    return this.#hostInfo.register && this.#hostInfo.register.is_enabled;
  }

  getName() { return this.#getHostAddr(this.#multiAddr); }
  getAddress() { return this.#getHostAddr(this.#multiAddr); }
  getPeerId() { return this.#hostInfo.peer_id; }
  getRegisterType() {
    return this.#hostInfo.register ? this.#hostInfo.register.type : null;
  }
  getApiUrl(path) {
    return this.#multiAddr ? this.#getHostAddr(this.#multiAddr) + path : null;
  }

  async asInit(sAddr) {
    this.#multiAddr = this.#parseAddressOrUseHost(sAddr);
    this.#hostInfo = await this.#asFetchHostInfo();
    return !!this.#hostInfo;
  }

  #getLocationMultiAddr() {
    const name = window.location.hostname;
    let port = window.location.port;
    if (port.length < 1) {
      if (window.location.protocol == 'https') {
        port = '443';
      } else {
        port = '80';
      }
    }
    return '/dns4/' + name + '/tcp/' + port;
  }

  #getHostAddr(ma) {
    let na = ma.nodeAddress();
    let protocol = "http";
    for (let c of ma.getComponents()) {
      if (c.code == 443) {
        protocol = "https";
        break;
      }
    }
    let hostname = na.address;
    if (na.family == 6) {
      hostname = "[" + na.address + "]";
    }
    return protocol + "://" + hostname + ":" + na.port;
  }

  #parseAddressOrUseHost(sAddr) {
    let s = sAddr;
    if (!s && glb.env.hasHost()) {
      s = this.#getLocationMultiAddr();
    }
    return s ? MultiformatsMultiaddr.multiaddr(s) : null;
  }

  async #asFetchHostInfo() {
    if (!this.#multiAddr) {
      return null;
    }

    const url = this.getApiUrl("/api/host/info");
    let req = new Request(url, {method : "GET"});
    let res;
    try {
      res = await plt.Api.p2pFetch(req, {signal : AbortSignal.timeout(5000)});
    } catch (e) {
      console.error("Failed to contact server", e.message);
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
