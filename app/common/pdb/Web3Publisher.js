(function(pdb) {
class Web3Publisher {
  #agents = [];

  async asInit(configs) {
    this.#agents = [];
    if (configs) {
      for (let c of configs) {
        let addr = this.#parseAddress(c.address);
        if (addr) {
          let a = this.#createAgent(c.type);
          await a.asInit(addr);
          this.#agents.push(a);
        }
      }
    }
  }

  async asInitForUser(userId) {
    for (let a of this.#agents) {
      await a.asInitForUser(userId);
    }
  }

  getAgents() { return this.#agents; }

  #createAgent(type) {
    switch (type) {
    case pdb.Web3PublisherAgent.T_TYPE.PRIVATE:
      return new pdb.Web3PrivatePublisherAgent();
    default:
      return new pdb.Web3PublicPublisherAgent();
    }
  }

  #parseAddress(sAddr) {
    return sAddr ? MultiformatsMultiaddr.multiaddr(sAddr) : null;
  }
};

pdb.Web3Publisher = Web3Publisher;
}(window.pdb = window.pdb || {}));
