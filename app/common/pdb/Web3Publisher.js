(function(pdb) {
class Web3Publisher {
  #agents = [];

  async asInit(configs) {
    this.#agents = [];
    if (configs) {
      for (let c of configs) {
        let addr = this.#parseAddress(c.address);
        if (addr) {
          let a = new pdb.Web3PublisherAgent();
          await a.asInit(c.type, addr);
          this.#agents.push(a);
        }
      }
    }
  }

  getAgents() { return this.#agents; }

  #parseAddress(sAddr) {
    return sAddr ? MultiformatsMultiaddr.multiaddr(sAddr) : null;
  }
};

pdb.Web3Publisher = Web3Publisher;
}(window.pdb = window.pdb || {}));
