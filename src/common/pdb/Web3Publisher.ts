import { PublisherAgent, RemoteServer } from 'pp-api';
import { Web3PeerUserRegistry } from './Web3PeerUserRegistry.js';

export class Web3PeerPublisherAgent extends PublisherAgent {
  readonly #peerUser: Web3PeerUserRegistry;

  constructor(server: RemoteServer) {
    super(server);
    this.#peerUser = new Web3PeerUserRegistry(() => this.getServer());
  }

  isInitUserRegistered(): boolean {
    return this.#peerUser.isInitUserRegistered();
  }
  isRegisterEnabled(): boolean {
    return this.#peerUser.isRegisterEnabled();
  }
  isInitUserUsable(): boolean {
    return this.#peerUser.isInitUserUsable();
  }
  getInitUserPeerId(): string | null {
    return this.#peerUser.getInitUserPeerId();
  }
  getInitUserRootCid(): string | null {
    return this.#peerUser.getInitUserRootCid();
  }
  async asIsNameRegistrable(name: string): Promise<boolean> {
    return this.#peerUser.asIsNameRegistrable(name);
  }
  async asIsUserRegistered(userId: string): Promise<boolean> {
    return this.#peerUser.asIsUserRegistered(userId);
  }
  getInitUserId(): string | null {
    return this.#peerUser.getInitUserId();
  }
  getHostPeerId(): string {
    return this.#peerUser.getHostPeerId();
  }
  async asInitForUser(userId: string): Promise<void> {
    return this.#peerUser.asInitForUser(userId);
  }
  async asRegister(msg: string, pubKey: string, sig: string): Promise<void> {
    return this.#peerUser.asRegister(msg, pubKey, sig);
  }
}

export class Web3GroupPublisherAgent extends PublisherAgent {}

export class Web3Publisher {
  #agents: (Web3PeerPublisherAgent | Web3GroupPublisherAgent)[] = [];

  getInitUserPeerId(): string | null {
    let id: string | null = null;
    for (let a of this.#agents) {
      if (a instanceof Web3PeerPublisherAgent) {
        id = a.getInitUserPeerId();
      }
      if (id) {
        break;
      }
    }
    return id;
  }

  getInitUserRootCid(): string | null {
    let cid: string | null = null;
    for (let a of this.#agents) {
      if (a instanceof Web3PeerPublisherAgent) {
        cid = a.getInitUserRootCid();
      }
      if (cid) {
        break;
      }
    }
    return cid;
  }

  async asInit(addrs: string[] | null): Promise<void> {
    // addrs: list of Multiaddr strings
    this.#agents = [];
    if (addrs) {
      for (let s of addrs) {
        let agent = await this.#asCreateAgent(s);
        if (agent) {
          this.#agents.push(agent);
        }
      }
    }
    console.log("Total publisher agents:", this.#agents.length);
  }

  async asInitForUser(userId: string): Promise<void> {
    for (let a of this.#agents) {
      if (a instanceof Web3PeerPublisherAgent) {
        await a.asInitForUser(userId);
      }
    }
  }

  getAgents(): (Web3PeerPublisherAgent | Web3GroupPublisherAgent)[] { return this.#agents; }

  async #asCreateAgent(sAddr: string): Promise<Web3PeerPublisherAgent | Web3GroupPublisherAgent | null> {
    let server = new RemoteServer();
    if (await server.asInit(sAddr)) {
      switch (server.getRegisterType()) {
      case RemoteServer.T_REGISTER.PEER:
        console.log("peer");
        return new Web3PeerPublisherAgent(server);
      case RemoteServer.T_REGISTER.GROUP:
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
}

export default Web3Publisher;
