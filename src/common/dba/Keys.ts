import { Wallet } from '../datatypes/Wallet.js';
import { KeyNode } from '../datatypes/KeyNode.js';
import { Cip1852Key } from '../datatypes/Cip1852Key.js';
import { Bip32Ed25519Key } from '../datatypes/Bip32Ed25519Key.js';
import { MlDsa44Key } from '../datatypes/MlDsa44Key.js';
import { Events as FwkEvents } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import Utilities from '../../lib/ext/Utilities.js';
import * as bip39 from 'bip39';
import { generateFromSeed, verify } from 'bip32-ed25519';
import { sys } from 'pp-api';

interface Cip1852KeyInterface {
  derive(index: number): Cip1852KeyInterface;
  to_public(): Uint8Array;
  to_raw_key(): unknown;
}

interface KeysData {
  e: string | null;
  s: Uint8Array | null;
}

interface KeysInterface {
  asyncGetAccount(): Promise<Uint8Array>;
  getCip1852(path: number[]): Uint8Array | null;
  getBip32Ed25519(path: number[]): Uint8Array | null;
  getMlDsa44(path: number[]): Uint8Array | null;
  setMnemonic(v: string): void;
  cip1852Witness(path: number[], msg: Uint8Array): unknown;
  sign(path: number[], msg: Uint8Array): Promise<string>;
  ed25519Verify(path: number[], msg: Uint8Array, sig: string): Promise<boolean>;
  signUint8Array(path: number[], msg: Uint8Array): Promise<string>;
  reset(data: KeysData | null): void;
  toEncodedStr(): string;
  fromEncodedStr(s: string): void;
}

export class KeysClass implements KeysInterface {
  #entropy: string | null = null;
  #seed: Uint8Array | null = null;
  #METHOD = {
    BIP32: Symbol(),
    BIP32_ED25119: Symbol(),
    CIP1852: Symbol(), // Supposed to be same as BIP32_ED25119 but needs check
  };
  #lib = new Map<symbol, KeyNode>();
  #busyKeys = new Set<symbol>();

  async asyncGetAccount(): Promise<Uint8Array> {
    const dPath = [Wallet.T_PURPOSE.NFSC001, Wallet.T_COIN.NFSC001, 0, 0, 0];
    const k = this.#getBip32Ed25519Impl(dPath);

    const seed = k.deriveSeed();
    const kp = await sys.utl.asEd25519KeyGen(seed);
    return kp.publicKey;
  }

  getCip1852(path: number[]): Uint8Array | null {
    const k = this.#getCip1852Impl(path);
    return k ? k.toPublic() : null;
  }

  getBip32Ed25519(path: number[]): Uint8Array | null {
    const k = this.#getBip32Ed25519Impl(path);
    return k ? k.toPublic() : null;
  }

  getMlDsa44(path: number[]): Uint8Array | null {
    const k = this.#getMlDsa44Impl(path);
    return k ? k.toPublic() : null;
  }

  setMnemonic(v: string): void {
    this.#entropy = bip39.mnemonicToEntropy(v);
    this.#seed = bip39.mnemonicToSeedSync(v);
    /*
    console.log("Seed:", Utilities.uint8ArrayToHex(seed));

    scureBip32.HDKey.fromMasterSeed(seed);
    const priK = seed.slice(0, 32);
    console.log("Private:", Utilities.uint8ArrayToHex(priK));
    */
  }

  cip1852Witness(path: number[], msg: Uint8Array): unknown {
    // Assuming k exists in _lib
    const k = this.#getCip1852Impl(path);
    return k ? k.witness(msg) : null;
  }

  async sign(path: number[], msg: Uint8Array): Promise<string> {
    const k = this.#getMlDsa44Impl(path);
    const decoder = new TextDecoder();
    const msgStr = decoder.decode(msg);
    return Utilities.uint8ArrayToHex(k.sign(msgStr));
  }

  async signUint8Array(path: number[], msg: Uint8Array): Promise<string> {
    const k = this.#getMlDsa44Impl(path);
    return Utilities.uint8ArrayToHex(k.signUint8Array(msg));
  }

  async ed25519Verify(path: number[], msg: Uint8Array, sig: string): Promise<boolean> {
    const k = this.#getBip32Ed25519Impl(path);
    console.log(k);
    const publicKey = k.toPublic();
    const sigBytes = Utilities.uint8ArrayFromHex(sig);
    return verify(msg, sigBytes, publicKey);
  }

  toEncodedStr(): string {
    return JSON.stringify({ e: this.#entropy, s: this.#seed });
  }

  fromEncodedStr(s: string): void {
    this.reset(JSON.parse(s) as KeysData);
  }

  reset(data: KeysData | null): void {
    this.#entropy = data ? data.e : null;
    this.#seed = data ? data.s : null;
    this.#lib.clear();
  }

  #getCip1852Impl(path: number[]): Cip1852Key | null {
    const k = this.#METHOD.CIP1852;
    if (this.#lib.has(k)) {
      const fullPath: number[] = [Wallet.T_PURPOSE.CIP1852, ...path];
      const key = this.#lib.get(k)!.get(fullPath, [true, true, true]);
      return key as Cip1852Key | null;
    } else {
      if (this.#busyKeys.has(k)) {
        return null;
      }
      this.#busyKeys.add(k);
      this.#asyncDeriveBip44Ed25519RootKey(this.#entropy!)
        //__deriveBip44Ed25519RootKeyFromSeed()
        .then((v) => this.#updateLib(k, new KeyNode(new Cip1852Key(v))))
        .finally(() => this.#busyKeys.delete(k));
      return null;
    }
  }

  #getBip32Ed25519Impl(path: number[]): Bip32Ed25519Key {
    const k = this.#METHOD.BIP32_ED25119;
    if (!this.#lib.has(k)) {
      const kBuffer = generateFromSeed(this.#seed!);
      this.#updateLib(k, new KeyNode(new Bip32Ed25519Key(kBuffer)));
    }
    return this.#lib.get(k)!.get(path, [true, true, true]) as Bip32Ed25519Key;
  }

  #getMlDsa44Impl(path: number[]): MlDsa44Key {
    const k = this.#getBip32Ed25519Impl(path);
    const seed = k.deriveSeed();
    return new MlDsa44Key(sys.utl.mlDsa44KeyGen(seed));
  }

  async #asyncDeriveBip44Ed25519RootKey(entropy: string): Promise<CardanoBip32PrivateKey> {
    // TODO: Operation is CPU intensive, should use Worker()
    return this.#deriveBip44Ed25519RootKey(entropy);
  }

  #deriveBip44Ed25519RootKey(entropy: string): CardanoBip32PrivateKey {
    return Cardano.Bip32PrivateKey.from_bip39_entropy(
      Utilities.uint8ArrayFromHex(entropy),
      new Uint8Array()
    );
  }

  #updateLib(k: symbol, v: KeyNode): void {
    this.#lib.set(k, v);
    FwkEvents.trigger(PltT_DATA.KEY_UPDATE, null);
  }
}

export const Keys = new KeysClass();

