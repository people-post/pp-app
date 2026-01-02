import { ServerDataObject } from './ServerDataObject.js';

export class ProductDelivery extends ServerDataObject {
  getDescription(): string | undefined {
    return this._data.description as string | undefined;
  }

  setDescription(d: string): void {
    this._data.description = d;
  }
}

