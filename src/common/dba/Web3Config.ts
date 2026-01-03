interface Web3ConfigData {
  guest_idol_id?: string | null;
  network?: unknown;
}

class Web3ConfigClass {
  #guestIdolId: string | null = null;
  #network: unknown = null;

  getGuestIdolId(): string | null {
    return this.#guestIdolId;
  }

  getNetworkConfig(): unknown {
    return this.#network;
  }

  load(data: Web3ConfigData | null): void {
    this.#guestIdolId = data ? data.guest_idol_id || null : null;
    this.#network = data ? data.network || null : null;
  }
}

export const Web3Config = new Web3ConfigClass();

