import type { NetworkConfig, Web3ConfigData } from '../../types/global.js';

class Web3ConfigClass {
  #guestIdolId: string | null = null;
  #network: NetworkConfig | null = null;

  getGuestIdolId(): string | null {
    return this.#guestIdolId;
  }

  getNetworkConfig(): NetworkConfig | null {
    return this.#network;
  }

  load(data: Web3ConfigData | null): void {
    this.#guestIdolId = data ? data.guest_idol_id || null : null;
    this.#network = data ? data.network || null : null;
  }
}

export const Web3Config = new Web3ConfigClass();