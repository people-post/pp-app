(function(pdb) {
class Web3Publisher {
  #agents = [];

  async asInit(addrs) {
    // addrs: list of Multiaddr strings
    this.#agents = [];
    if (addrs) {
      for (let s of addrs) {
        let agent = await this.#asCreateAgent(s);
        if (agent) {
          this.#agents.push(agent);
        }
      }
    } else {
      if (glb.env.hasHost()) {
      }
    }
  }

  async asInitForUser(userId) {
    for (let a of this.#agents) {
      await a.asInitForUser(userId);
    }
  }

  getAgents() { return this.#agents; }

  async #asCreateAgent(sAddr) {
    let server = new pdb.Web3Server();
    if (await server.asInit(sAddr)) {
      switch (server.getApiType()) {
      case pdb.Web3PublisherAgent.T_TYPE.PUBLIC:
        return new pdb.Web3PublicPublisherAgent(server);
      default:
        return new pdb.Web3PrivatePublisherAgent(server);
      }
    } else {
      return null;
    }
  }
};

pdb.Web3Publisher = Web3Publisher;
}(window.pdb = window.pdb || {}));
