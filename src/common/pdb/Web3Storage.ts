import { StorageAgent, RemoteServer } from '../plt/PpApiTypes.js';
import { Web3PeerUserRegistry } from './Web3PeerUserRegistry.js';

export class Web3PeerStorageAgent extends StorageAgent {
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

export class Web3GroupStorageAgent extends StorageAgent {}

export class Web3Storage {
  #agents: (Web3PeerStorageAgent | Web3GroupStorageAgent)[] = [];

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

  async asInitForUser(userId: string): Promise<void> {
    for (let a of this.#agents) {
      if (a instanceof Web3PeerStorageAgent) {
        await a.asInitForUser(userId);
      }
    }
  }

  getAgents(_userId?: string): (Web3PeerStorageAgent | Web3GroupStorageAgent)[] {
    // TODO: Support per user setup
    return this.#agents;
  }

  async #asCreateAgent(sAddr: string): Promise<Web3PeerStorageAgent | Web3GroupStorageAgent | null> {
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
}

export default Web3Storage;
