(function(pdb) {
class Web3Resolver {
  #agents = [];
  #lib = new Map();

  getAgents() { return this.#agents; }

  async asInit(addrs) {
    // addrs: list of Multiaddr strings
    this.#agents = [];
    if (addrs) {
      for (let s of addrs) {
        let server = new pdb.Web3Server();
        if (await server.asInit(s)) {
          let agent = new pdb.Web3ServerAgent(server);
          this.#agents.push(agent);
        }
      }
    }
  }

  async asResolveFromCid(cid) {
    let d = await plt.Api.asyncFetchCidJson(cid);
    if (typeof d === 'object' && d !== null) {
      // Internal use
      d._cid = cid;
    } else {
      // Something is wrong in expected format
      d = null;
    }
    return d;
  }

  async asResolve(userId) {
    if (!this.#lib.has(userId)) {
      this.#lib.set(userId, new ext.PerishableObject(600000)); // TTL 10 min
    }

    // 1. Try local cache
    let obj = this.#lib.get(userId);
    let d = obj.getData();
    if (!this.#isValidProfileData(d)) {
      d = await this.#asResolveUserData(userId);
      d.uuid = userId;
      obj.setData(d);
    }
    return d;
  }

  async #asResolveUserData(userId) {
    console.log("Resolving", userId);
    // 1. Try name server
    let cid = await this.#asResolveFromNameServer(userId);
    if (!cid) {
      // 2. Try direct IPNS
      let ipns = plt.Helia.getIpns();
      if (ipns) {
        try {
          let r = await ipns.resolve(this.#getIpnsName(userId),
                                     {signal : AbortSignal.timeout(5000)});
          cid = r.cid.toString();
        } catch (e) {
          // It's OK to fail
        }
      }
    }
    if (!cid) {
      // 3. Try blockchain
      cid = await this.#asResolveFromBlockchain(userId);
    }

    let d;
    if (cid) {
      d = this.asResolveFromCid(cid);
    }

    if (!d) {
      // Name resolve failed, reasons:
      // 1. userId not exist
      // 2. network failure
      // 3. cid resolved to unexpected data
      d = {};
    }
    console.log("Resolved");
    return d;
  }

  async #asResolveFromNameServer(userId) {
    // 1. Try centrialized name server
    let url = this.#getUserIdResolveUrl(userId);
    let req = new Request(url, {method : "GET"});
    let cid;
    try {
      let res = await plt.Api.p2pFetch(req);
      let d = await res.json();
      if (d.error) {
        throw d.error;
      }
      if (d.data.current) {
        cid = d.data.current.cid;
      }
      // TODO: Support d.data.buffer.cid
    } catch (e) {
      // Name server is unavailable
      // 2. Try centrialized name server entry file through IPNS
      cid = this.#localResolve(userId);
    }
    return cid;
  }

  async #asResolveFromBlockchain(userId) {
    // TODO:
    return null;
  }

  #isValidProfileData(d) { return d && d.version; }

  #localResolve(userId) {
    // Local resolve using centrialized server public data
    // Hack
    return null;
  }

  #getIpnsName(userId) {
    // TODO: Maybe we should use customized id system
    let peerId = Libp2PPeerId.peerIdFromString(userId)
    return peerId.toMultihash();
  }

  #getUserIdResolveUrl(userId) {
    if (this.#agents.length < 1) {
      return null;
    }
    // userId is target user id to be resolved
    let path =
        "/api/name/resolve?" + new URLSearchParams({id : userId}).toString();
    let a = this.#agents[0];
    return a.getServer().getApiUrl(path);
  }

  #parseAddress(sAddr) {
    return sAddr ? MultiformatsMultiaddr.multiaddr(sAddr) : null;
  }
};

pdb.Web3Resolver = Web3Resolver;
}(window.pdb = window.pdb || {}));
