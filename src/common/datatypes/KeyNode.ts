interface Key {
  derive(index: number): Key;
}

export class KeyNode {
  #children: Map<number, KeyNode>;
  #key: Key | null;

  constructor(key: Key | null) {
    this.#key = key;
    this.#children = new Map();
  }

  get(path: number[], hardenFlags: boolean[] | null): Key | null {
    if (path && path.length) {
      const k = path[0];
      let b: boolean;
      let subHardenFlags: boolean[] | null;
      if (hardenFlags && hardenFlags.length) {
        b = hardenFlags[0];
        subHardenFlags = hardenFlags.slice(1);
      } else {
        b = false;
        subHardenFlags = null;
      }
      if (!this.#children.has(k)) {
        if (!this.#key) {
          throw new Error('Cannot derive from null key');
        }
        const nk = this.#key.derive(b ? this.#harden(k) : k);
        this.#children.set(k, new KeyNode(nk));
      }
      const n = this.#children.get(k);
      if (!n) {
        throw new Error('KeyNode not found');
      }
      return n.get(path.slice(1), subHardenFlags);
    } else {
      return this.#key;
    }
  }

  #harden(num: number): number {
    return 0x80000000 + num;
  }
}

