import { PublisherAgent, RemoteServer } from 'pp-api';
import { Web3PeerServerMixin } from './Web3PeerServerMixin.js';
import { Env } from '../plt/Env.js';

export class Web3PeerPublisherAgent extends Web3PeerServerMixin(PublisherAgent) {}
export class Web3GroupPublisherAgent extends PublisherAgent {}

export class Web3Publisher {
  #agents: (Web3PeerPublisherAgent | Web3GroupPublisherAgent)[] = [];

  getInitUserPeerId(): string | null {
    let id: string | null = null;
    for (let a of this.#agents) {
      id = a.getInitUserPeerId();
      if (id) {
        break;
      }
    }
    return id;
  }

  getInitUserRootCid(): string | null {
    let cid: string | null = null;
    for (let a of this.#agents) {
      cid = a.getInitUserRootCid();
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
    } else {
      if (Env.hasHost()) {
        let agent = await this.#asCreateAgent();
        if (agent) {
          this.#agents.push(agent);
        }
      }
    }
    console.log("Total publisher agents:", this.#agents.length);
  }

  async asInitForUser(userId: string): Promise<void> {
    for (let a of this.#agents) {
      await a.asInitForUser(userId);
    }
  }

  getAgents(): (Web3PeerPublisherAgent | Web3GroupPublisherAgent)[] { return this.#agents; }

  async #asCreateAgent(sAddr?: string): Promise<Web3PeerPublisherAgent | Web3GroupPublisherAgent | null> {
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
