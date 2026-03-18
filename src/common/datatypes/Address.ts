import { ServerDataObject } from './ServerDataObject.js';
import type { AddressData } from '../../types/backend2.js';

export class Address extends ServerDataObject<AddressData> {
  getOwnerId(): string | number | undefined {
    return this._data.owner_id as string | number | undefined;
  }

  getNickname(): string | undefined {
    return this._data.nickname as string | undefined;
  }

  getName(): string | undefined {
    return this._data.name as string | undefined;
  }

  getCountry(): string | undefined {
    return this._data.country as string | undefined;
  }

  getState(): string | undefined {
    return this._data.state as string | undefined;
  }

  getCity(): string | undefined {
    return this._data.city as string | undefined;
  }

  getZipcode(): string | undefined {
    return this._data.zipcode as string | undefined;
  }

  getLine(idx: number): string | undefined {
    const lines = this._data.lines as string[] | undefined;
    return lines ? lines[idx] : undefined;
  }
}

