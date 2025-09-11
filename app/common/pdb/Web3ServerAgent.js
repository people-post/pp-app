(function(pdb) {
class Web3ServerAgent {
  #typeName = null;
  #multiAddr = null;

  getTypeName() { return this.#typeName; }
  getHostname() { return this.#getHostAddr(this.#multiAddr); }
  getHostAddress() { return this.#getHostAddr(this.#multiAddr); }

  getApiUrl(path) {
    return this.#multiAddr ? this.#getHostAddr(this.#multiAddr) + path : null;
  }

  async asInit(typeName, multiAddr) {
    this.#typeName = typeName;
    this.#multiAddr = multiAddr;
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

pdb.Web3ServerAgent = Web3ServerAgent;
}(window.pdb = window.pdb || {}));
