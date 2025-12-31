export class Web3PeerStorageAgent extends pdb.Web3PeerServerMixin
(pp.StorageAgent) {};
export class Web3GroupStorageAgent extends pp.StorageAgent {};

export class Web3Storage {
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
    let server = new pp.RemoteServer();
    if (await server.asInit(sAddr)) {
      switch (server.getRegisterType()) {
      case pp.RemoteServer.T_REGISTER.PEER:
        return new Web3PeerStorageAgent(server);
      case pp.RemoteServer.T_REGISTER.GROUP:
        return new Web3GroupStorageAgent(server);
      default:
        break;
      }
    }
    return null;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.pdb = window.pdb || {};
  window.pdb.Web3PeerStorageAgent = Web3PeerStorageAgent;
  window.pdb.Web3GroupStorageAgent = Web3GroupStorageAgent;
  window.pdb.Web3Storage = Web3Storage;
}
