// Cardano types are provided by the cardano.min.js library (defined in global.d.ts)

export class CardanoAccount {
  // m/purpose'/coin_type'/account'/role/index
  static readonly T_ROLE = {
    EXTERNAL: 0, // External chain, from BIP44
    INTERNAL: 1, // Internal chain, from BIP44
    STAKING: 2, // Staking key, from CIP1852
    D_REP: 3, // DRep key, from CIP1852
    C_COLD: 4, // Constitutional Committee Cold Key, from CIP1852
    C_HOT: 5, // Constitutional Committee Hot Key, from CIP1852
  } as const;

  #networkId: number;
  #kPayment: CardanoBip32PrivateKey | null = null;
  #kStaking: CardanoBip32PrivateKey | null = null;
  #address: unknown = null;

  constructor(kPayment: CardanoBip32PrivateKey, kStaking: CardanoBip32PrivateKey) {
    this.#kPayment = kPayment;
    this.#kStaking = kStaking;
    this.#networkId = Cardano.NetworkInfo.testnet_preview().network_id;
  }

  getAddress(): unknown {
    if (!this.#address) {
      this.#address = this.#deriveAddress();
    }
    return this.#address;
  }

  #deriveAddress(): unknown {
    if (!this.#kPayment || !this.#kStaking) {
      throw new Error('Payment or staking key is null');
    }
    const hPayment = this.#kPayment.to_raw_key().hash();
    const hStaking = this.#kStaking.to_raw_key().hash();
    const cPayment = Cardano.Credential.from_keyhash(hPayment);
    const cStaking = Cardano.Credential.from_keyhash(hStaking);
    const bAddr = new Cardano.BaseAddress(this.#networkId, cPayment, cStaking);
    return bAddr.to_address();
  }
}

