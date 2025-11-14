(function(pdb) {
class Web3PeerPublisherAgent extends pdb.Web3PeerServerMixin
(pp.PublisherAgent) {};
class Web3GroupPublisherAgent extends pp.PublisherAgent {};

class Web3Publisher {
  #agents = [];

  getInitUserPeerId() {
    let id = null;
    for (let a of this.#agents) {
      id = a.getInitUserPeerId();
      if (id) {
        break;
      }
    }
    return id;
  }

  getInitUserRootCid() {
    let cid = null;
    for (let a of this.#agents) {
      cid = a.getInitUserRootCid();
      if (cid) {
        break;
      }
    }
    return cid;
  }

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
    let server = new pp.RemoteServer();
    if (await server.asInit(sAddr)) {
      switch (server.getRegisterType()) {
      case pp.RemoteServer.T_REGISTER.PEER:
        console.log("peer");
        return new Web3PeerPublisherAgent(server);
      case pp.RemoteServer.T_REGISTER.GROUP:
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
