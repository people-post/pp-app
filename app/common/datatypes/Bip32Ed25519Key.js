import Utilities from '../../lib/ext/Utilities.js';

export class Bip32Ed25519Key {
  #buffer = null; // Uint8Array

  constructor(buffer) { this.#buffer = buffer; }

  derive(index) {
    let nk = Bip32Ed25519.derivePrivate(this.#buffer, index);
    return new Bip32Ed25519Key(nk);
  }

  deriveSeed() { return this.derive(777).toPublic().slice(0, 32); }

  toPublic() { return Bip32Ed25519.toPublic(this.#buffer); }

  async toPublicAsync() {
    return await nobleEd25519.getPublicKeyAsync(this.#getPrivateKey());
  }

  async signEd(msg) {
    const encoder = new TextEncoder();
    const m = await this.#getSha512Hash(msg);
    const hash = encoder.encode(m);
    return await nobleEd25519.signAsync(hash, this.#getPrivateKey());
  }

  #getPrivateKey() { return this.#buffer.slice(0, 32); }

  async #getSha512Hash(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', dataBuffer);
    const hashArray =
        Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex =
        Utilities.uint8ArrayToHex(hashArray); // convert bytes to hex string
    return hashHex;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.Bip32Ed25519Key = Bip32Ed25519Key;
}
