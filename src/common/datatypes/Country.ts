import type { CountryData } from '../../types/backend2.js';

export class Country {
  private _data: CountryData;

  constructor(data: CountryData) {
    this._data = data;
  }

  getName(): string {
    return this._data.name;
  }
}

