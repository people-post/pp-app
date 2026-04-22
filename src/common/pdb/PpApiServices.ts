import { asInit } from '../plt/PpApiTypes.js';
import { Web3Resolver } from './Web3Resolver.js';
import { Web3Publisher } from './Web3Publisher.js';
import { Web3Ledger } from './Web3Ledger.js';
import { Web3Storage } from './Web3Storage.js';

export interface PpApiNetworkConfig {
  resolvers?: string[] | null;
  publishers?: string[] | null;
  blockchains?: string[] | null;
  storages?: string[] | null;
}

class PpApiServiceRegistry {
  #resolver: Web3Resolver | null = null;
  #publisher: Web3Publisher | null = null;
  #ledger: Web3Ledger | null = null;
  #storage: Web3Storage | null = null;

  async asInit(): Promise<void> {
    await asInit();
  }

  async asInitNetwork(config: PpApiNetworkConfig | null, userId: string): Promise<void> {
    const resolvers = config?.resolvers ?? null;
    const publishers = config?.publishers ?? null;
    const blockchains = config?.blockchains ?? null;
    const storages = config?.storages ?? null;

    this.#resolver = new Web3Resolver();
    await this.#resolver.asInit(resolvers);

    this.#publisher = new Web3Publisher();
    await this.#publisher.asInit(publishers);
    await this.#publisher.asInitForUser(userId);

    this.#ledger = new Web3Ledger();
    await this.#ledger.asInit(blockchains);

    this.#storage = new Web3Storage();
    await this.#storage.asInit(storages);
    await this.#storage.asInitForUser(userId);
  }

  getResolverOrNull(): Web3Resolver | null {
    return this.#resolver;
  }

  getPublisherOrNull(): Web3Publisher | null {
    return this.#publisher;
  }

  getLedgerOrNull(): Web3Ledger | null {
    return this.#ledger;
  }

  getStorageOrNull(): Web3Storage | null {
    return this.#storage;
  }

  getResolver(): Web3Resolver {
    if (!this.#resolver) {
      throw new Error('PpApiServices: resolver is not initialized');
    }
    return this.#resolver;
  }

  getPublisher(): Web3Publisher {
    if (!this.#publisher) {
      throw new Error('PpApiServices: publisher is not initialized');
    }
    return this.#publisher;
  }

  getLedger(): Web3Ledger {
    if (!this.#ledger) {
      throw new Error('PpApiServices: ledger is not initialized');
    }
    return this.#ledger;
  }

  getStorage(): Web3Storage {
    if (!this.#storage) {
      throw new Error('PpApiServices: storage is not initialized');
    }
    return this.#storage;
  }
}

export const PpApiServices = new PpApiServiceRegistry();