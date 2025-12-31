export class CardanoAccount {
  // m/purpose'/coin_type'/account'/role/index
  static T_ROLE = {
    EXTERNAL : 0, // External chain, from BIP44
    INTERNAL: 1,  // Internal chain, from BIP44
    STAKING: 2,   // Staking key, from CIP1852
    D_REP: 3,     // DRep key, from CIP1852
    C_COLD: 4,    // Constitutional Committee Cold Key, from CIP1852
    C_HOT: 5,     // Constitutional Committee Hot Key, from CIP1852
  };

  #networkId;
  #kPayment = null;
  #kStaking = null;
  #address = null;

  constructor(kPayment, kStaking) {
    this.#kPayment = kPayment;
    this.#kStaking = kStaking;
    this.#networkId = Cardano.NetworkInfo.testnet_preview().network_id;
  }

  getAddress() {
    if (!this.#address) {
      this.#address = this.#deriveAddress();
    }
    return this.#address;
  }

  #deriveAddress() {
    const hPayment = this.#kPayment.to_raw_key().hash();
    const hStaking = this.#kStaking.to_raw_key().hash();
    const cPayment = Cardano.Credential.from_keyhash(hPayment);
    const cStaking = Cardano.Credential.from_keyhash(hStaking);
    const bAddr = Cardano.BaseAddress.new(this.#networkId, cPayment, cStaking);
    return bAddr.to_address();
  }
};


