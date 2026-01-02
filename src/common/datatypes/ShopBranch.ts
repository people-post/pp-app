import { ServerDataObject } from './ServerDataObject.js';

interface ShopBranchData {
  name?: string;
  owner_id?: string;
  address_id?: string;
  [key: string]: unknown;
}

export class ShopBranch extends ServerDataObject {
  protected declare _data: ShopBranchData;

  getName(): string | undefined {
    return this._data.name as string | undefined;
  }

  getOwnerId(): string | undefined {
    return this._data.owner_id as string | undefined;
  }

  getAddressId(): string | undefined {
    return this._data.address_id as string | undefined;
  }
}

