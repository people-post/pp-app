import { Fragment } from './Fragment.js';

export class FFragmentList extends Fragment {
  size() { return this._getAllChildControllers().length; }
  getChildren() { return this._getAllChildControllers(); }

  append(f) { this.setChild(f, f); }
  remove(f) {
    this.#remove(f);
    this.render();
  }
  clear() {
    for (let f of this._getAllChildControllers()) {
      this.#remove(f);
    }
  }

  #remove(f) { this.setChild(f, null); }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.FFragmentList = FFragmentList;
}
