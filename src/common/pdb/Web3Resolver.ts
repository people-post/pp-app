import PerishableObject from '../../lib/ext/PerishableObject.js';
import { Web3ResolverAgent } from './Web3ResolverAgent.js';
import { RemoteServer, sys } from 'pp-api';

interface ProfileData {
  _cid?: string;
  uuid?: string;
  version?: unknown;
  [key: string]: unknown;
}

export class Web3Resolver {
  #agents: Web3ResolverAgent[] = [];
  #lib = new Map<string, PerishableObject<ProfileData>>();

  getAgents(): Web3ResolverAgent[] { return this.#agents; }

  async asInit(addrs: string[] | null): Promise<void> {
    // addrs: list of Multiaddr strings
    this.#agents = [];
    if (addrs) {
      for (let s of addrs) {
        let server = new RemoteServer();
        if (await server.asInit(s)) {
          let agent = new Web3ResolverAgent(server);
          this.#agents.push(agent);
        }
      }
    }
  }

  async asResolveFromCid(cid: string): Promise<ProfileData | null> {
    // TODO: Multi thread calls cause data mess up when AbortSignal
    let d: unknown = null;
    try {
      d = await sys.ipfs.asFetchCidJson(cid);
    } catch (e) {
      console.debug(e);
    }
    if (typeof d === 'object' && d !== null) {
      // Internal use
      (d as ProfileData)._cid = cid;
      return d as ProfileData;
    } else {
      // Something is wrong in expected format
      d = null;
    }
    return null;
  }

  async asResolve(userId: string): Promise<ProfileData> {
    if (!this.#lib.has(userId)) {
      this.#lib.set(userId, new PerishableObject<ProfileData>(600000)); // TTL 10 min
    }

    // 1. Try local cache
    let obj = this.#lib.get(userId)!;
    let d = obj.getData();
    if (!this.#isValidProfileData(d)) {
      d = await this.#asResolveUserData(userId);
      d.uuid = userId;
      obj.setData(d);
    }
    return d;
  }

  async #asResolveUserData(userId: string): Promise<ProfileData> {
    console.log("Resolving", userId);
    // 1. Try name server
    let cid = await this.#asResolveFromNameServer(userId);
    if (!cid) {
      // 2. Try direct IPNS
      try {
        cid = await sys.ipfs.asResolve(this.#getIpnsName(userId),
                                          {signal : AbortSignal.timeout(5000)});
      } catch (e) {
        // It's OK to fail
      }
    }
    if (!cid) {
      // 3. Try blockchain
      cid = await this.#asResolveFromBlockchain(userId);
    }

    let d: ProfileData | null = null;
    if (cid) {
      console.debug("Resolved:", cid);
      d = await this.asResolveFromCid(cid);
    }

    if (d) {
      console.debug("Data found:", d);
    } else {
      console.debug("Data not found");
      // Name resolve failed, reasons:
      // 1. userId not exist
      // 2. network failure
      // 3. cid resolved to unexpected data
      d = {};
    }
    return d;
  }

  async #asResolveFromNameServer(userId: string): Promise<string | null> {
    // 1. Try centrialized name server
    let url = this.#getUserIdResolveUrl(userId);
    if (!url) {
      return this.#localResolve(userId);
    }
    let options = {method : "GET" as const};
    let cid: string | null = null;
    try {
      let res = await sys.ipfs.asFetch(url, options);
      let d = await res.json() as { error?: unknown; data?: { current?: { cid: string } } };
      if (d.error) {
        throw d.error;
      }
      if (d.data?.current) {
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

  async #asResolveFromBlockchain(_userId: string): Promise<string | null> {
    // TODO:
    return null;
  }

  #isValidProfileData(d: ProfileData | null): boolean { return d !== null && d.version !== undefined; }

  #localResolve(_userId: string): string | null {
    // Local resolve using centrialized server public data
    // Hack
    return null;
  }

  #getIpnsName(userId: string): string {
    // TODO: Maybe we should use customized id system
    let peerId = sys.utl.peerIdFromString(userId);
    return peerId.toMultihash();
  }

  #getUserIdResolveUrl(userId: string): string | null {
    if (this.#agents.length < 1) {
      return null;
    }
    // userId is target user id to be resolved
    let path =
        "/api/name/resolve?" + new URLSearchParams({id : userId}).toString();
    let a = this.#agents[0];
    return a.getServer().getApiUrl(path);
  }
}

export default Web3Resolver;
