import { Fragment } from './Fragment.js';

export class FFragmentList extends Fragment {
  size(): number { return this._getAllChildControllers().length; }
  getChildren(): Fragment[] { return this._getAllChildControllers() as Fragment[]; }

  append(f: Fragment): void { this.setChild(f as any, f); }

  /** Insert fragments above existing items (order preserved: first in array ends up closest to old top). */
  prependFragments(fs: Fragment[]): void {
    if (!fs.length) {
      return;
    }
    const existing = this.getChildren();
    this.clear();
    for (const f of fs) {
      this.append(f);
    }
    for (const ex of existing) {
      this.append(ex);
    }
  }

  remove(f: Fragment): void {
    this.#remove(f);
    this.render();
  }
  clear(): void {
    for (let f of this._getAllChildControllers()) {
      this.#remove(f as Fragment);
    }
  }

  #remove(f: Fragment): void { this.setChild(f as any, null); }
}

