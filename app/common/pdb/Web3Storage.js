(function(pdb) {
class Web3PeerStorageAgent extends pdb.Web3PeerServerMixin
(pdb.Web3StorageAgent) {};
class Web3GroupStorageAgent extends pdb.Web3StorageAgent {};

class Web3Storage {
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
  }

  async asInitForUser(userId) {
    for (let a of this.#agents) {
      await a.asInitForUser(userId);
    }
  }

  getAgents(userId) {
    // TODO: Support per user setup
    return this.#agents;
  }

  async #asCreateAgent(sAddr) {
    let server = new pdb.Web3Server();
    if (await server.asInit(sAddr)) {
      switch (server.getRegisterType()) {
      case pdb.Web3Server.T_REGISTER.PEER:
        return new Web3PeerStorageAgent(server);
      case pdb.Web3Server.T_REGISTER.GROUP:
        return new Web3GroupStorageAgent(server);
      default:
        break;
      }
    }
    return null;
  }
};

pdb.Web3Storage = Web3Storage;
}(window.pdb = window.pdb || {}));
