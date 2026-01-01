import { sys } from 'pp-api';

export class MlDsa44Key {
  #buffer = null;

  constructor(buffer) { this.#buffer = buffer; }

  toPublic() { return this.#buffer.publicKey; }

  sign(msg) {
    const encoder = new TextEncoder();
    const m = encoder.encode(msg);
    return this.signUint8Array(m);
  }

  signUint8Array(msg) {
    return sys.utl.mlDsa44Sign(msg, this.#buffer.secretKey);
  }
};
