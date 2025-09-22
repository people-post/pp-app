(function(pdb) {
class Web3Server {
  #multiAddr = null;

  constructor(multiAddr) { this.#multiAddr = multiAddr; }

  getName() { return this.#getHostAddr(this.#multiAddr); }
  getAddress() { return this.#getHostAddr(this.#multiAddr); }

  getApiUrl(path) {
    return this.#multiAddr ? this.#getHostAddr(this.#multiAddr) + path : null;
  }

  #getHostAddr(ma) {
    let na = ma.nodeAddress();
    if (na.family == 6) {
      return "http://[" + na.address + "]:" + na.port;
    } else {
      return "http://" + na.address + ":" + na.port;
    }
  }
};

pdb.Web3Server = Web3Server;
}(window.pdb = window.pdb || {}));
