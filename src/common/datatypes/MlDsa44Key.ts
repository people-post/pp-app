import { sys } from 'pp-api';

interface MlDsa44KeyBuffer {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

export class MlDsa44Key {
  #buffer: MlDsa44KeyBuffer | null = null;

  constructor(buffer: MlDsa44KeyBuffer) {
    this.#buffer = buffer;
  }

  toPublic(): Uint8Array | null {
    return this.#buffer?.publicKey ?? null;
  }

  sign(msg: string): Uint8Array {
    const encoder = new TextEncoder();
    const m = encoder.encode(msg);
    return this.signUint8Array(m);
  }

  signUint8Array(msg: Uint8Array): Uint8Array {
    if (!this.#buffer) {
      throw new Error('MlDsa44Key buffer is null');
    }
    return sys.utl.mlDsa44Sign(msg, this.#buffer.secretKey);
  }
}

