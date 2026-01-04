import { FInput } from './FInput.js';

export class SimpleInput extends FInput {
  protected _hasError: boolean;

  constructor() {
    super();
    this._hasError = false;
  }

  getValue(): string { 
    const el = this._getInputElement();
    return (el && 'value' in el) ? (el as HTMLInputElement).value : ""; 
  }
  setConfig(config: any): void {
    super.setConfig(config);
    this._hasError = false;
  }

  protected _clearErrorMark(): void {
    this._hasError = false;
    let e = this._getInputElement();
    if (e) {
      e.className = e.className.replace(" input-error", "");
      e.className = e.className.replace("input-error ", "");
      e.className = e.className.replace("input-error", "");
    }
  }

  protected _markError(): void {
    this._hasError = true;
    let e = this._getInputElement();
    if (e) {
      if (e.className.indexOf("input-error") < 0) {
        if (e.className.length) {
          e.className = e.className + " input-error";
        } else {
          e.className = "input-error";
        }
      }
    }
  }
}

