import { ServerDataObject } from './ServerDataObject.js';

interface ShopRegisterData {
  name?: string;
  [key: string]: unknown;
}

export class ShopRegister extends ServerDataObject {
  protected declare _data: ShopRegisterData;

  getName(): string | undefined {
    return this._data.name as string | undefined;
  }
}

