import { Fragment } from './Fragment.js';

export class FInput extends Fragment {
  constructor() {
    super();
    this._config = null;
  }

  getConfig() { return this._config; }
  setConfig(config) { this._config = config; }

  _getInputElementId() { return "EIN_ID_" + this._id; }
  _getInputElement() {
    return document.getElementById(this._getInputElementId());
  }
}

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.FInput = FInput;
}
