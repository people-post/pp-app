import { ServerDataObject } from './ServerDataObject.js';
import type { ShopRegisterData } from '../../types/backend2.js';

export class ShopRegister extends ServerDataObject<ShopRegisterData> {
  getName(): string | null {
    return this._data.name;
  }
}

