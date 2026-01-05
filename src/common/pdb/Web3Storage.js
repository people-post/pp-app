import { StorageAgent, RemoteServer } from 'pp-api';
import { Web3PeerServerMixin } from './Web3PeerServerMixin.js';
import { Env } from '../plt/Env.js';

export class Web3PeerStorageAgent extends Web3PeerServerMixin(StorageAgent) {};
export class Web3GroupStorageAgent extends StorageAgent {};

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
      if (Env.hasHost()) {
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
    let server = new RemoteServer();
    if (await server.asInit(sAddr)) {
      switch (server.getRegisterType()) {
      case RemoteServer.T_REGISTER.PEER:
        return new Web3PeerStorageAgent(server);
      case RemoteServer.T_REGISTER.GROUP:
        return new Web3GroupStorageAgent(server);
      default:
        break;
      }
    }
    return null;
  }
};
