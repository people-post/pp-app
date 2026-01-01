export class KeyNode {
  #children = new Map();
  #key = null;

  constructor(key) { this.#key = key; }

  get(path, hardenFlags) {
    if (path && path.length) {
      let k = path[0];
      let b, subHardenFlags;
      if (hardenFlags && hardenFlags.length) {
        b = hardenFlags[0];
        subHardenFlags = hardenFlags.slice(1);
      } else {
        b = false;
        subHardenFlags = null;
      }
      if (!this.#children.has(k)) {
        let nk = this.#key.derive(b ? this.#harden(k) : k);
        this.#children.set(k, new KeyNode(nk));
      }
      let n = this.#children.get(k);
      return n.get(path.slice(1), subHardenFlags);
    } else {
      return this.#key;
    }
  }

  #harden(num) { return 0x80000000 + num; }
};
