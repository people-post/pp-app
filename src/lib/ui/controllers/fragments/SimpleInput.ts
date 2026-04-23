import { FInput } from './FInput.js';

export class SimpleInput extends FInput {
  protected _hasError: boolean;
  protected _storedValue: string;

  constructor() {
    super();
    this._hasError = false;
    this._storedValue = "";
  }

  protected storeValue(raw: unknown): void {
    this._storedValue = String(raw ?? "");
  }

  getValue(): string { 
    const el = this._getInputElement();
    if (el && 'value' in el) {
      const v = (el as HTMLInputElement).value ?? "";
      this._storedValue = v;
      return v;
    }
    return this._storedValue;
  }
  setConfig(config: any): void {
    super.setConfig(config);
    this._hasError = false;
    if (config && 'value' in config) {
      this.storeValue((config as any).value);
    }
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

