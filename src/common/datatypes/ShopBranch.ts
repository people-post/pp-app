import { ServerDataObject } from './ServerDataObject.js';
import type { ShopBranchData } from '../../types/backend2.js';

export class ShopBranch extends ServerDataObject<ShopBranchData> {

  getName(): string | null {
    return this._data.name;
  }

  getOwnerId(): string | null {
    return this._data.owner_id;
  }

  getAddressId(): string | null {
    return this._data.address_id;
  }
}

