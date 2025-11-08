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
        let agent = this.#asCreateAgent(s);
        if (agent) {
          this.#agents.push(agent);
        }
      }
    }
  }

  async #asCreateAgent(sAddr) {
    let server = new pp.RemoteServer();
    if (await server.asInit(sAddr)) {
      return new pdb.Web3BlockchainAgent(server);
    }
    return null;
  }
};

pdb.Web3Ledger = Web3Ledger;
}(window.pdb = window.pdb || {}));
