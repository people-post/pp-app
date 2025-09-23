(function(pdb) {
class Web3Ledger {
  #agents = [];

  isAvailable() { return this.#agents.length > 0; }

  getAgents() { return this.#agents; }

  async asInit(addrs) {
    // addrs: list of Multiaddr strings
    this.#agents = [];
    if (addrs) {
      for (let s of addrs) {
        let agent = this.#asCreateAgent(multiAddr);
        if (agent) {
          this.#agents.push(agent);
        }
      }
    }
  }

  #parseAddress(sAddr) {
    return sAddr ? MultiformatsMultiaddr.multiaddr(sAddr) : null;
  }

  async #asCreateAgent(sAddr) {
    let multiAddr = this.#parseAddress(sAddr);
    if (!multiAddr) {
      return null;
    }

    let server = new pdb.Web3Server(multiAddr);
    return new pdb.Web3BlockchainAgent(server);
  }
};

pdb.Web3Ledger = Web3Ledger;
}(window.pdb = window.pdb || {}));
