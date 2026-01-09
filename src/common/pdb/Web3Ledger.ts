import { RemoteServer } from 'pp-api';
import { Web3BlockchainAgent } from './Web3BlockchainAgent.js';

declare global {
  var pdb: {
    Web3BlockchainAgent: typeof Web3BlockchainAgent;
  };
}

export class Web3Ledger {
  #agents: Web3BlockchainAgent[] = [];

  isAvailable(): boolean { return this.#agents.length > 0; }

  getAgents(): Web3BlockchainAgent[] { return this.#agents; }

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
  }

  async #asCreateAgent(sAddr: string): Promise<Web3BlockchainAgent | null> {
    let server = new RemoteServer();
    if (await server.asInit(sAddr)) {
      return new pdb.Web3BlockchainAgent(server);
    }
    return null;
  }
}

export default Web3Ledger;
