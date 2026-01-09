export class Cip1852Key {
  #key: CardanoBip32PrivateKey;

  constructor(key: CardanoBip32PrivateKey) {
    this.#key = key;
  }

  derive(index: number): Cip1852Key {
    return new Cip1852Key(this.#key!.derive!(index));
  }

  toPublic(): Uint8Array {
    return this.#key!.to_public!();
  }

  witness(msg: Uint8Array): unknown {
    return Cardano.make_vkey_witness(msg, this.#key!.to_raw_key!());
  }
}

