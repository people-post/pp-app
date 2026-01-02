import Utilities from '../../lib/ext/Utilities.js';
import { derivePrivate, toPublic } from 'bip32-ed25519';

// Declare global nobleEd25519 (from lib/3rd/ed25519.js)
declare const nobleEd25519: {
  getPublicKeyAsync(privateKey: Uint8Array): Promise<Uint8Array>;
  signAsync(message: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;
};

export class Bip32Ed25519Key {
  #buffer: Uint8Array;

  constructor(buffer: Uint8Array) {
    this.#buffer = buffer;
  }

  derive(index: number): Bip32Ed25519Key {
    const nk = derivePrivate(this.#buffer, index);
    return new Bip32Ed25519Key(nk);
  }

  deriveSeed(): Uint8Array {
    return this.derive(777).toPublic().slice(0, 32);
  }

  toPublic(): Uint8Array {
    return toPublic(this.#buffer);
  }

  async toPublicAsync(): Promise<Uint8Array> {
    return await nobleEd25519.getPublicKeyAsync(this.#getPrivateKey());
  }

  async signEd(msg: string): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    const m = await this.#getSha512Hash(msg);
    const hash = encoder.encode(m);
    return await nobleEd25519.signAsync(hash, this.#getPrivateKey());
  }

  #getPrivateKey(): Uint8Array {
    return this.#buffer.slice(0, 32);
  }

  async #getSha512Hash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = Utilities.uint8ArrayToHex(hashArray); // convert bytes to hex string
    return hashHex;
  }
}

