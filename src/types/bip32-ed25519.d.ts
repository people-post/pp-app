declare module 'bip32-ed25519' {
  export function fromSeed2(seed: Uint8Array | Buffer): Buffer;
  export function fromSeed(seed: Uint8Array | Buffer): Buffer;
  export function generateFromSeed(seed: Uint8Array | Buffer): Buffer;
  export function derivePrivate(xprv: Uint8Array | Buffer, index: number): Buffer;
  export function derivePublic(xpub: Uint8Array | Buffer, index: number): Buffer;
  export function toPublic(xprv: Uint8Array | Buffer): Buffer;
  export function sign(message: Uint8Array | Buffer | string, xprv: Uint8Array | Buffer | string): Buffer;
  export function verify(message: Uint8Array | Buffer | string, sig: Uint8Array | Buffer | string, xpub: Uint8Array | Buffer | string): boolean;
}

