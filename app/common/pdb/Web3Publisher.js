(function(pdb) {
class Web3PeerPublisherAgent extends pdb.Web3PeerServerMixin
(pdb.Web3PublisherAgent) {};
class Web3GroupPublisherAgent extends pdb.Web3PublisherAgent {};

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
        let agent = await this.#asCreateAgent();
        if (agent) {
          this.#agents.push(agent);
        }
      }
    }
    console.log("Total publisher agents:", this.#agents.length);
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
      switch (server.getRegisterType()) {
      case pdb.Web3Server.T_REGISTER.PEER:
        console.log("peer");
        return new Web3PeerPublisherAgent(server);
      case pdb.Web3Server.T_REGISTER.GROUP:
        console.log("Gruop");
        return new Web3GroupPublisherAgent(server);
      default:
        console.log("Type error");
        break;
      }
    }
    console.log("Init failed");
    return null;
  }
};

pdb.Web3Publisher = Web3Publisher;
}(window.pdb = window.pdb || {}));
