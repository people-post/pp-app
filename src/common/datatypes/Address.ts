import { ServerDataObject } from './ServerDataObject.js';
import type { AddressData } from '../../types/backend2.js';

export class Address extends ServerDataObject<AddressData> {
  getOwnerId(): string | null {
    return this._data.owner_id;
  }

  getNickname(): string | null {
    return this._data.nickname;
  }

  getName(): string | null {
    return this._data.name;
  }

  getCountry(): string | null {
    return this._data.country;
  }

  getState(): string | null {
    return this._data.state;
  }

  getCity(): string | null {
    return this._data.city;
  }

  getZipcode(): string | null {
    return this._data.zipcode;
  }

  getLine(idx: number): string | null {
    const lines = this._data.lines;
    if (!lines) {
      return null;
    }
    return lines[idx];
  }
}

