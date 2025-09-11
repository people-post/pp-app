(function(pdb) {
class Web3Ledger {
  #agents = [];

  isAvailable() { return this.#agents.length > 0; }

  getAgents() { return this.#agents; }

  async asInit(configs) {
    this.#agents = [];
    if (configs) {
      for (let c of configs) {
        let addr = this.#parseAddress(c.address);
        if (addr) {
          let a = new pdb.Web3BlockchainAgent();
          await this.#agents.asInit(c.type, addr);
          this.#agents.push(a);
        }
      }
    }
  }

  #parseAddress(sAddr) {
    return sAddr ? MultiformatsMultiaddr.multiaddr(sAddr) : null;
  }
};

pdb.Web3Ledger = Web3Ledger;
}(window.pdb = window.pdb || {}));
