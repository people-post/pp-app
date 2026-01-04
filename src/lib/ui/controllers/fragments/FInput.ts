import { Fragment } from './Fragment.js';

export class FInput extends Fragment {
  protected _config: any;

  constructor() {
    super();
    this._config = null;
  }

  getConfig(): any { return this._config; }
  setConfig(config: any): void { this._config = config; }

  _getInputElementId(): string { return "EIN_ID_" + this._id; }
  _getInputElement(): HTMLElement | null {
    return document.getElementById(this._getInputElementId());
  }
}

