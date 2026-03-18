import { ServerDataObject } from './ServerDataObject.js';
import type { CurrencyData } from '../../types/backend2.js';

export class Currency extends ServerDataObject<CurrencyData> {
  getName(): string | null {
    return this._data.name;
  }

  getCode(): string | null {
    return this._data.code;
  }

  getSymbol(): string | null {
    return this._data.symbol;
  }

  getIcon(): string | null {
    return this._data.icon;
  }
}

