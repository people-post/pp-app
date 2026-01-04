import { Fragment } from './Fragment.js';

export class FFragmentList extends Fragment {
  size(): number { return this._getAllChildControllers().length; }
  getChildren(): Fragment[] { return this._getAllChildControllers() as Fragment[]; }

  append(f: Fragment): void { this.setChild(f as any, f); }
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

