interface MlDsa44KeyBuffer {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

type MlDsa44Signer = (msg: Uint8Array, secretKey: Uint8Array) => Uint8Array;

export class MlDsa44Key {
  #buffer: MlDsa44KeyBuffer | null = null;
  readonly #signImpl: MlDsa44Signer;

  constructor(buffer: MlDsa44KeyBuffer, signImpl: MlDsa44Signer) {
    this.#buffer = buffer;
    this.#signImpl = signImpl;
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
    return this.#signImpl(msg, this.#buffer.secretKey);
  }
}

