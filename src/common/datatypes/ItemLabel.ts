import { ServerDataObject } from './ServerDataObject.js';

export class ItemLabel extends ServerDataObject {
  getName(): string | undefined {
    return this._data.name as string | undefined;
  }
}

