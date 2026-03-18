import { ServerDataObject } from './ServerDataObject.js';
import type { ShopRegisterData } from '../../types/backend2.js';

export class ShopRegister extends ServerDataObject {
  protected declare _data: ShopRegisterData;

  getName(): string | undefined {
    return this._data.name as string | undefined;
  }
}

