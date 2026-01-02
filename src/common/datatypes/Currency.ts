import { ServerDataObject } from './ServerDataObject.js';

export class Currency extends ServerDataObject {
  getName(): string | undefined {
    return this._data.name as string | undefined;
  }

  getCode(): string | undefined {
    return this._data.code as string | undefined;
  }

  getSymbol(): string | undefined {
    return this._data.symbol as string | undefined;
  }

  getIcon(): string | undefined {
    return this._data.icon as string | undefined;
  }
}

