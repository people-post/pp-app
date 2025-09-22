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
    let multiAddr = this.#parseAddress(sAddr);
    if (!multiAddr) {
      return null;
    }

    let server = new pdb.Web3Server(multiAddr);
    let sInfo;
    try {
      sInfo = await this.#asFetchHostInfo(server);
    } catch (e) {
      console.error("Failed to contact server", e);
      return null;
    }

    switch (sInfo.type) {
    case pdb.Web3PublisherAgent.T_TYPE.PUBLIC:
      return new pdb.Web3PublicPublisherAgent(sInfo, server);
    default:
      return new pdb.Web3PrivatePublisherAgent(sInfo, server);
    }
  }

  #parseAddress(sAddr) {
    return sAddr ? MultiformatsMultiaddr.multiaddr(sAddr) : null;
  }

  async #asFetchHostInfo(server) {
    const url = server.getApiUrl("/api/host/info");
    let req = new Request(url, {method : "GET"});
    let res;
    try {
      res = await plt.Api.p2pFetch(req);
    } catch (e) {
      return {};
    }
    let d = await res.json();
    if (d.error) {
      throw d.error;
    }
    return d.data.info;
  }
};

pdb.Web3Publisher = Web3Publisher;
}(window.pdb = window.pdb || {}));
